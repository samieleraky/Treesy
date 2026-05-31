using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using treesy_backend.Data;
using treesy_backend.Helpers;

namespace Treesy.Api.Controllers
{
    [ApiController] // Apicontroller er tilføjet for at få automatisk modelvalidering og andre API-specifikke features
    [Route("api/[controller]")] // Routen er ændret til "api/[controller]" for at følge konventionen og gøre det mere RESTful
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly TreesyDbContext _db;

        public DashboardController(TreesyDbContext db) //metode som injekterer database-konteksten, så den kan bruges i controlleren
        {
            _db = db;
        }

        [HttpGet] //HTTP GET endpoint for at hente dashboard-data
        public async Task<IActionResult> GetDashboard() //asynkron metode som håndterer GET-anmodninger til dashboardet, liste IActionResult for at kunne returnere forskellige HTTP-responser
        {
            var customerIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier); //Henter kundens ID fra JWT-tokenet ved hjælp af ClaimTypes.NameIdentifier, som vi tidligere har sat til at være customer.Id i auth processen. Gemmer det som en string. 
            if (customerIdStr == null || !Guid.TryParse(customerIdStr, out var customerId)) //hvis customerIdStr er null eller ikke kan parses til en Guid, returneres Unauthorized (401)
                return Unauthorized();

            var customer = await _db.Customers //Henter kunden fra databasen baseret på det udtrukne customerId. Inkluderer både Subscriptions og Orders i forespørgslen for at kunne bruge dem senere i metoden.
                .Include(c => c.Subscriptions)
                .Include(c => c.Orders)
                .FirstOrDefaultAsync(c => c.Id == customerId); //Linq-forespørgsel for at finde den første kunde, der matcher det givne customerId. Hvis ingen kunde findes, returneres null.

            if (customer == null)
                return NotFound();

            var activeSub = customer.Subscriptions //Finder det aktive abonnement ved at filtrere kundens abonnementer, hvor status er "active", og sortere dem efter oprettelsesdato i faldende rækkefølge for at få det seneste aktive abonnement. Hvis der ikke findes noget aktivt abonnement, vil activeSub være null.
                .Where(s => s.Status == "active")
                .OrderByDescending(s => s.CreatedAt)
                .FirstOrDefault();

            // PlanHelper bruges nu til at formatere plan-navnet i stedet for lokal metode
            var planName = PlanHelper.FormatPlanName(activeSub?.PlanId ?? "");

            var treesPerYear = PlanHelper.GetTreesForPlan(activeSub?.PlanId ?? "");  // Bruger nu PlanHelper.GetTreesForPlan for at få antallet af træer per år baseret på det aktive abonnement. Hvis der ikke er noget aktivt abonnement, vil det returnere 0.

            var co2Kg = treesPerYear * 100; // Beregner den estimerede CO₂-lagring i kg ved at multiplicere antallet af træer per år med 100 kg CO₂ per træ.
            var areaM2 = treesPerYear * 10; //beregner arealet i kvadratmeter ved at multiplicere antallet af træer per år med 10 m² per træ (baseret på minimum 3×3 meter mellem træerne, hvilket giver ca. 9 m² plus lidt ekstra plads).
            var footballPitches = Math.Round(areaM2 / 7140.0, 2); //beregner fodbold bane

            var monthsActive = activeSub?.CreatedAt != null  // Beregner hvor mange måneder abonnementet har været aktivt ved at tage forskellen mellem nuværende tidspunkt og oprettelsestidspunktet for det aktive abonnement, og derefter dividere det med gennemsnitlige antal dage i en måned (30.44). Hvis der ikke er noget aktivt abonnement, sættes monthsActive til 0.
                ? (int)Math.Floor((DateTime.UtcNow - activeSub.CreatedAt.Value).TotalDays / 30.44)
                : 0;

            var co2Timeline = new List<object>(); //opretter en liste af objekter som gemmes i en variabel af datatypen var så compiler kan inferere typen. Denne liste vil indeholde data til at vise en tidslinje over CO₂-lagring baseret på det aktive abonnement.
            if (activeSub?.CreatedAt != null) //If statement som tager activesub og tjekker om den ikke er null og at CreatedAt ikke er null, hvis det er sandt så køres koden indeni som beregner CO₂-lagring over tid og tilføjer det til co2Timeline-listen. Hvis der ikke er noget aktivt abonnement eller CreatedAt er null, vil co2Timeline forblive tom.
            {
                var start = activeSub.CreatedAt.Value; //jeg erklærer en variable start og sætter den til at være CreatedAt værdien for det aktive abonnement. Dette repræsenterer starttidspunktet for abonnementet, som bruges som udgangspunkt for at beregne CO₂-lagring over tid.
                var co2PerMonth = co2Kg / 12.0; //jeg erklæerer en variabel CO2PerMonth som tages det totale CO₂-lagring i kg (co2Kg) og dividerer det med 12 for at få den gennemsnitlige CO₂-lagring per måned. 
                var current = new DateTime(start.Year, start.Month, 1); //Current varibel som sættes til den første dag i måneden for startdatoen. 
                var cumulative = 0.0; //Jeg erklærer en variabel cumulative som starter ved 0 og vil blive brugt til at holde styr på den kumulative CO₂-lagring over tid, når vi itererer gennem månederne fra startdatoen til nuværende tidspunkt.
                while (current <= DateTime.UtcNow) //while statement som kærer så længe current datoen er mindre end eller lig med nuværende tidspunkt. Dette loop itererer gennem hver måned fra startdatoen for det aktive abonnement op til nuværende tidspunkt, og i hver iteration tilføjes den månedlige CO₂-lagring (co2PerMonth) til den kumulative total, og et objekt med månedens navn og den kumulative CO₂-lagring i kg tilføjes til co2Timeline-listen.
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
            var recentOrders = customer.Orders // Henter de seneste ordrer for kunden ved at iterere gennem kundens Orders og projicere dem til et nyt format, hvor hver ordre repræsenteres som et objekt med id, beskrivelse (som inkluderer det formaterede plan-navn og "engangskøb"), dato, beløb i DKK og status. Dette giver en liste over de seneste ordrer, som kan vises i dashboardet.
                .Select(o => new //Select statement som intererer gennem hver ordre i custommer tabellen. Der oprettes et nyt anonymt objekt for hver ordre, hvor id sættes til ordrenes Id, description sættes til det formaterede plan-navn (ved hjælp af PlanHelper.FormatPlanName) plus " — engangskøb", date sættes til ordrenes CreatedAt, amount sættes til ordrenes AmountDkk castet til int, og status sættes til ordrenes Status. Resultatet er en liste af ordrer i det ønskede format.
                {
                    id = o.Id,
                    description = PlanHelper.FormatPlanName(o.PlanId) + " — engangskøb",
                    date = o.CreatedAt,
                    amount = (int)o.AmountDkk,
                    status = o.Status
                });

            // ← Bruger nu PlanHelper.FormatPlanName i stedet for lokal metode
            var recentSubs = customer.Subscriptions //opretter en variabel recentsubs som indeholder subscriptions i customer
                .Select(s => new //linq select statement som itererer gennem hvert abonnemt, hvor hvert objekt transformeres til et nyt anynoment objekt
                {
                    id = s.Id,
                    description = PlanHelper.FormatPlanName(s.PlanId) + " — " + (s.Billing == "yearly" ? "årlig" : "månedlig"),
                    date = s.CreatedAt ?? DateTime.MinValue,
                    amount = GetMonthlyPrice(s.PlanId, s.Billing),
                    status = s.Status
                });

            var transactions = recentOrders //jeg opretter en variabel transactions som indeholder recentorders
                .Concat(recentSubs) //.Concat metoden bruges til at kombinere recentOrders og recentSubs til en enkelt sekvens af transaktioner. Dette giver os en samlet liste over både engangsordrer og abonnementsordrer.
                .OrderByDescending(t => t.date) //Den kombinerede liste sorteres derefter i faldende rækkefølge baseret på datoen for hver transaktion, så de nyeste transaktioner kommer først.
                .Take(5)
                .ToList();

            return Ok(new //OK metoden returnerer en HTTP 200 OK status sammen med et objekt, der indeholder alle de relevante data til dashboardet, herunder kundeoplysninger, abonnementsdetaljer, CO₂-lagringsstatistikker, tidslinje for CO₂-lagring og de seneste transaktioner.
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

       
        private static int GetMonthlyPrice(string planId, string billing) =>
            (planId, billing) switch //metode som tager planId, billing som paramenter og returnerer prisen for det givne abonnement baseret på en switch expression. Den matcher kombinationen af planId og billing (enten "monthly" eller "yearly") og returnerer den tilsvarende pris i DKK. Hvis ingen match findes, returneres 0 som standard.
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