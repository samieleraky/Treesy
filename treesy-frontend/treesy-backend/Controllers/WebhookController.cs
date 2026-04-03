using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe.Checkout;
using treesy_backend.Data;
using treesy_backend.Models;

namespace Treesy.Api.Controllers
{
    [ApiController]
    [Route("api/stripe/webhook")]
    public class WebhookController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly TreesyDbContext _db;

        public WebhookController(IConfiguration config, TreesyDbContext db)
        {
            _config = config;
            _db = db;
        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
            var json = await new StreamReader(Request.Body).ReadToEndAsync();
            Stripe.Event stripeEvent;                          // ← fuldt navn
            try
            {
                stripeEvent = Stripe.EventUtility.ConstructEvent( // ← fuldt navn
                    json,
                    Request.Headers["Stripe-Signature"],
                    _config["Stripe:WebhookSecret"]
                );
            }
            catch
            {
                return BadRequest();
            }

            if (stripeEvent.Type == "checkout.session.completed")
            {
                var session = stripeEvent.Data.Object as Session;
                var email = session?.CustomerDetails?.Email ?? "";
                var mode = session?.Mode;

                var customer = await _db.Customers.FirstOrDefaultAsync(c => c.Email == email)
                    ?? new treesy_backend.Models.Customer { Email = email, StripeCustomerId = session?.CustomerId ?? "" };

                if (customer.Id == Guid.Empty) _db.Customers.Add(customer);

                if (mode == "subscription")
                {
                    _db.Subscriptions.Add(new treesy_backend.Models.Subscription
                    {
                        CustomerId = customer.Id,
                        StripeSubscriptionId = session!.SubscriptionId ?? "",
                        PlanId = session.Metadata["planId"],
                        Billing = session.Metadata["billing"],
                        CurrentPeriodEnd = DateTime.UtcNow.AddMonths(1),
                        Status = "active"
                    });
                    customer.TotalTreesPlanted += GetTreesForPlan(session.Metadata["planId"]);
                }
                else if (mode == "payment")
                {
                    _db.Orders.Add(new Order
                    {
                        CustomerId = customer.Id,
                        StripeSessionId = session!.Id,
                        PlanId = session.Metadata["planId"],
                        Trees = GetTreesForPlan(session.Metadata["planId"]),
                        AmountDkk = (session.AmountTotal ?? 0) / 100m,
                        Status = "paid"
                    });
                    customer.TotalTreesPlanted += GetTreesForPlan(session.Metadata["planId"]);
                }

                customer.UpdatedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync();
            }

            if (stripeEvent.Type == "invoice.paid")
                Console.WriteLine("Subscription renewed");

            if (stripeEvent.Type == "invoice.payment_failed")
                Console.WriteLine("Payment failed");

            return Ok();
        }

        private static int GetTreesForPlan(string planId) => planId switch
        {
            "active-planter" or "active-planter-seed" => 130,
            "committed-planter" or "committed-planter-seed" => 260,
            "hero-planter" or "hero-planter-seed" => 1300,
            "legend-planter" or "legend-planter-seed" => 13000,
            _ => 0
        };
    }
}