using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Stripe;
using treesy_backend.Data;
using treesy_backend.Services;

namespace Treesy.Api.Controllers
{
    [ApiController]
    [Route("api/subscription")]
    [Authorize]
    public class SubscriptionController : ControllerBase
    {
        private readonly TreesyDbContext _db;
        private readonly EmailService _email;

        public SubscriptionController(TreesyDbContext db, EmailService email)
        {
            _db = db;
            _email = email;
        }

        [HttpPost("cancel")]
        public async Task<IActionResult> CancelSubscription()
        {
            var customerIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(customerIdStr, out var customerId))
                return Unauthorized();

            var customer = await _db.Customers
                .Include(c => c.Subscriptions)
                .FirstOrDefaultAsync(c => c.Id == customerId);

            if (customer == null)
                return NotFound();

            var activeSub = customer.Subscriptions
                .Where(s => s.Status == "active")
                .OrderByDescending(s => s.CreatedAt)
                .FirstOrDefault();

            if (activeSub == null)
                return BadRequest(new { message = "Intet aktivt abonnement fundet" });

            // Annuller i Stripe
            var service = new SubscriptionService();
            await service.UpdateAsync(activeSub.StripeSubscriptionId, new SubscriptionUpdateOptions
            {
                CancelAtPeriodEnd = true
            });

            // Opdater i database
            activeSub.Status = "cancelled";  // ← tilføj denne linje
            activeSub.CancelledAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            // Send annulleringsmail
            var planName = activeSub.PlanId switch
            {
                "active-planter" => "Active Planter",
                "committed-planter" => "Committed Planter",
                "hero-planter" => "Hero Planter",
                "legend-planter" => "Legend Planter",
                _ => activeSub.PlanId
            };

            _ = _email.SendCancellationEmailAsync(
                customer.Email,
                customer.Name ?? customer.Email,
                planName,
                activeSub.CurrentPeriodEnd
            );

            return Ok(new
            {
                message = "Abonnement annulleret — du beholder adgang til " +
                          activeSub.CurrentPeriodEnd.ToString("d. MMMM yyyy")
            });
        }
    }
}