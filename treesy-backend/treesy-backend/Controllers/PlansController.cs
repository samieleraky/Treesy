using Microsoft.AspNetCore.Mvc; //namespace for ControllerBase, ApiController, Route, HttpGet, IActionResult. bruges til at udvikle API-controllers

namespace Treesy.Api.Controllers
{
    [ApiController] //fortæller ASP.Net Core at denne klasse er en API-controller, hvilket betyder at den håndterer HTTP-anmodninger og returnerer data (typisk i JSON-format) i stedet for HTML-visninger
    [Route("api/[controller]")] //jeg angiver ruten for denne controller. endpointet bliver "api/plans" fordi controllerens navn er "PlansController" (ASP.Net Core fjerner "Controller" fra navnet for at bestemme ruten)
    public class PlansController : ControllerBase //Jeg opretter en controller klasser som nedarver fra Controllerbase, som giver adgang til metoder såsom OK() og BadRequest()
    {
        [HttpGet] //Jeg angiver at GetPlans kan kaldes via en HTTP-get 
        public IActionResult GetPlans() //Jeg opretter en metode GetPlans som returnere en list over de abonnementer, systemet tilbyder. Systemet returnere en IActionResult som er en standard måde at returnere HTTP-responser i ASP.Net Core. Det kan være en succes (OK) eller en fejl (BadRequest) afhængigt af situationen
        {
            var plans = new[] //jeg er klærer variablen plans som en array af objekter, hvor hver objekt repræsenterer et abonnement
            {
                new { //jeg erklærer et abonnement med id, name, subtitle, icon, featured, features, monthlyPrice, yearlyPrice, monthlyDetail og yearlyDetail
                    id = "active-planter", //unikt id for abonnementet, bruges til at identificere det i systemet og i Stripe
                    name = "Active Planter",
                    subtitle = "130 træer / år",
                    icon = "🌱",
                    featured = true,
                    features = new[] {
                        "13 tons CO₂ lagret* (Ved anslået 100 kg CO₂ per træ)",
                        "100% af en gennemsnitlig danskers klima aftryk* (ved estimeret 13 tons om året)",
                        "⁠⁠1.170 m² skov oprettet* (ved minimum 3×3 meter mellem træerne)"
                    },
                    monthlyPrice = 160,
                    yearlyPrice = 1600,

                    monthlyDetail="(14,80 kr / træ)",
                    yearlyDetail="(12,30 kr / træ)"
                },
                new {
                    id = "committed-planter",
                    name = "Committed Planter",
                    subtitle = "260 træer / år",
                    icon = "🌿",
                    featured = false,
                    features = new[] {
                        "26 tons CO₂ lagret* (Ved anslået 100 kg CO₂ per træ)",
                        "200% af en gennemsnitlig danskers klima aftryk* (ved estimeret 13 tons om året)",
                        "⁠⁠2.340 m² skov oprettet* (ved minimum 3×3 meter mellem træerne)"
                    },
                    monthlyPrice = 250,
                    yearlyPrice = 2500,

                    monthlyDetail="(11,54 kr / træ)",
                    yearlyDetail="(9,62 kr / træ)"
                },
                new {
                    id = "hero-planter",
                    name = "Hero Planter",
                    subtitle = "1.300 træer / år",
                    icon = "🌳",
                    featured = false,
                    features = new[] {
                        "130 tons CO₂ lagret* (Ved anslået 100 kg CO₂ per træ)",
                        "1.000% af en gennemsnitlig danskers klima aftryk* (ved estimeret 13 tons om året)",
                        "11.700 m² skov oprettet* (ved minimum 3×3 meter mellem træerne)"
                    },
                    monthlyPrice = 1000,
                    yearlyPrice = 10900,

                    monthlyDetail="(9,23 kr / træ)",
                    yearlyDetail="(8,38 kr / træ)"
                },
                new {
                    id = "legend-planter",
                    name = "Legend Planter",
                    subtitle = "13.000 træer / år",
                    icon = "🌲",
                    featured = false,
                    features = new[] {
                        "1.300 tons CO₂ lagret* (Ved anslået 100 kg CO₂ per træ)",
                        "10.000% af en gennemsnitlig danskers klima aftryk* (ved estimeret 13 tons om året)",
                        "117.000 m² skov oprettet* (ved minimum 3×3 meter mellem træerne)"
                    },
                    monthlyPrice = 8750,
                    yearlyPrice = 95000,

                    monthlyDetail="(8,04 kr / træ)",
                    yearlyDetail="(7,31 kr / træ)"

                }
            };

            return Ok(plans); //jeg returnerer en HTTP 200 OK respons med plans dataene i JSON-format. Dette gør det muligt for frontend-applikationen at hente og vise disse abonnementer til brugerne
        }
    }
}
