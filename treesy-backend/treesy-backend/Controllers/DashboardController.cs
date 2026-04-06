using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using treesy_backend.Data;



namespace Treesy.Api.Controllers
{
    [ApiController] //Den tillader at klassen fungerer som en API-controller, hvilket betyder, at den kan håndtere HTTP-anmodninger og returnere HTTP-responser.
    [Route("api/[controller]")] //Definerer ruten for controlleren. "controller" er en placeholder, der automatisk erstattes med navnet på controlleren (uden "Controller"-suffikset). I dette tilfælde vil ruten være "api/dashboard".
    [Authorize] //Angiver, at alle handlinger i denne controller kræver, at brugeren er autentificeret. Det betyder, at kun brugere, der har logget ind og har en gyldig token, kan få adgang til disse endpoints.

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
            //Hent bruger-ID fra token
            var customerIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (customerIdStr == null || !Guid.TryParse(customerIdStr, out var customerId))
                return Unauthorized();

            var customer = await _db.Customers
                .Include(c => c.Subscriptions)
                .Include(c => c.Orders)
                .FirstOrDefaultAsync(c => c.Id == customerId);

            if (customer == null)
                return NotFound();

            //Aktivt abonnemt
            var activeSub = customer.Subscriptions
                .Where(s => s.Status == "active")
                .OrderByDescending(s => s.CreatedAt)
                .FirstOrDefault();

            //Plan navn

            var planName = activeSub?.PlanId switch
            {
                "active-planter" => "Active Planter",
                "committed-planter" => "Committed Planter",
                "hero-planter" => "Hero Planter",
                "legend-planter" => "Legend Planter",
                _ => activeSub?.PlanId ?? "Ingen aktiv pakke"
            };

            // Træer pr. år baseret på plan
            var treesPerYear = GetTreesForPlan(activeSub?.PlanId ?? "");

            // CO2 og areal
            var co2Kg = treesPerYear * 100;
            var areaM2 = treesPerYear * 10;
            var footballPitches = Math.Round(areaM2 / 7140.0, 2);

            // Måneder aktiv
            var monthsActive = activeSub?.CreatedAt != null
                ? (int)Math.Floor((DateTime.UtcNow - activeSub.CreatedAt.Value).TotalDays / 30.44)
                : 0;

            // CO2 over tid (én datapunkt per måned siden opstart)
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

            // Seneste transaktioner — både abonnementer og orders
            var recentOrders = customer.Orders
     .Select(o => new
     {
         id = o.Id,
         description = FormatPlanName(o.PlanId) + " — engangskøb",
         date = o.CreatedAt,
         amount = (int)o.AmountDkk,
         status = o.Status
     });

            var recentSubs = customer.Subscriptions
                .Select(s => new
                {
                    id = s.Id,
                    description = FormatPlanName(s.PlanId) + " — " + (s.Billing == "yearly" ? "årlig" : "månedlig"),
                    date = s.CreatedAt ?? DateTime.MinValue, // 🔥 FIX
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

        private static int GetTreesForPlan(string planId) => planId switch
        {
            "active-planter" => 130,
            "committed-planter" => 260,
            "hero-planter" => 1300,
            "legend-planter" => 13000,
            _ => 0
        };

        private static string FormatPlanName(string planId) => planId switch
        {
            "active-planter" or "active-planter-seed" => "Active Planter",
            "committed-planter" or "committed-planter-seed" => "Committed Planter",
            "hero-planter" or "hero-planter-seed" => "Hero Planter",
            "legend-planter" or "legend-planter-seed" => "Legend Planter",
            _ => planId
        };

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
    }


  

}
