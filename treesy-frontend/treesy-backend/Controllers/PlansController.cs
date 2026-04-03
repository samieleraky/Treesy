using Microsoft.AspNetCore.Mvc;

namespace Treesy.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlansController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetPlans()
        {
            var plans = new[]
            {
                new {
                    id = "active-planter",
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

            return Ok(plans);
        }
    }
}
