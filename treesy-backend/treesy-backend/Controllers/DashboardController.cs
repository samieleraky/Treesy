using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using treesy_backend.Data;
using treesy_backend.Helpers;

namespace Treesy.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly TreesyDbContext _db;

        public DashboardController(TreesyDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            var customerIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (customerIdStr == null || !Guid.TryParse(customerIdStr, out var customerId))
                return Unauthorized();

            var customer = await _db.Customers
                .Include(c => c.Subscriptions)
                .Include(c => c.Orders)
                .FirstOrDefaultAsync(c => c.Id == customerId);

            if (customer == null)
                return NotFound();

            var activeSub = customer.Subscriptions
                .Where(s => s.Status == "active")
                .OrderByDescending(s => s.CreatedAt)
                .FirstOrDefault();

            // PlanHelper bruges nu til at formatere plan-navnet i stedet for lokal metode
            var planName = PlanHelper.FormatPlanName(activeSub?.PlanId ?? "");

            var treesPerYear = PlanHelper.GetTreesForPlan(activeSub?.PlanId ?? "");

            var co2Kg = treesPerYear * 100;
            var areaM2 = treesPerYear * 10;
            var footballPitches = Math.Round(areaM2 / 7140.0, 2);

            var monthsActive = activeSub?.CreatedAt != null
                ? (int)Math.Floor((DateTime.UtcNow - activeSub.CreatedAt.Value).TotalDays / 30.44)
                : 0;

            var co2Timeline = new List<object>();
            if (activeSub?.CreatedAt != null)
            {
                var start = activeSub.CreatedAt.Value;
                var co2PerMonth = co2Kg / 12.0;
                var current = new DateTime(start.Year, start.Month, 1);
                var cumulative = 0.0;
                while (current <= DateTime.UtcNow)
                {
                    cumulative += co2PerMonth;
                    co2Timeline.Add(new
                    {
                        month = current.ToString("MMM yy"),
                        co2 = (int)Math.Round(cumulative)
                    });
                    current = current.AddMonths(1);
                }
            }

            // ← Bruger nu PlanHelper.FormatPlanName i stedet for lokal metode
            var recentOrders = customer.Orders
                .Select(o => new
                {
                    id = o.Id,
                    description = PlanHelper.FormatPlanName(o.PlanId) + " — engangskøb",
                    date = o.CreatedAt,
                    amount = (int)o.AmountDkk,
                    status = o.Status
                });

            // ← Bruger nu PlanHelper.FormatPlanName i stedet for lokal metode
            var recentSubs = customer.Subscriptions
                .Select(s => new
                {
                    id = s.Id,
                    description = PlanHelper.FormatPlanName(s.PlanId) + " — " + (s.Billing == "yearly" ? "årlig" : "månedlig"),
                    date = s.CreatedAt ?? DateTime.MinValue,
                    amount = GetMonthlyPrice(s.PlanId, s.Billing),
                    status = s.Status
                });

            var transactions = recentOrders
                .Concat(recentSubs)
                .OrderByDescending(t => t.date)
                .Take(5)
                .ToList();

            return Ok(new
            {
                customer = new
                {
                    name = customer.Name ?? customer.Email,
                    email = customer.Email,
                    memberSince = customer.CreatedAt.ToString("d. MMMM yyyy"),
                    monthsActive
                },
                subscription = activeSub == null ? null : new
                {
                    planId = activeSub.PlanId,
                    planName,
                    billing = activeSub.Billing,
                    status = activeSub.Status,
                    currentPeriodEnd = activeSub.CurrentPeriodEnd.ToString("d. MMMM yyyy")
                },
                stats = new
                {
                    treesPerYear,
                    co2Kg,
                    areaM2,
                    footballPitches,
                    totalTreesPlanted = customer.TotalTreesPlanted
                },
                co2Timeline,
                transactions
            });
        }

        // ← Denne er BEHOLDT da den kun findes her
        private static int GetMonthlyPrice(string planId, string billing) =>
            (planId, billing) switch
            {
                ("active-planter", "monthly") => 160,
                ("active-planter", "yearly") => 1600,
                ("committed-planter", "monthly") => 250,
                ("committed-planter", "yearly") => 2500,
                ("hero-planter", "monthly") => 1000,
                ("hero-planter", "yearly") => 10900,
                ("legend-planter", "monthly") => 8750,
                ("legend-planter", "yearly") => 95000,
                _ => 0
            };

        // ← GetTreesForPlan og FormatPlanName er SLETTET — de lever nu i PlanHelper
    }
}