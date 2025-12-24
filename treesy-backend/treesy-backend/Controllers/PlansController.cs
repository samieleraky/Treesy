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
                    Id = "carbon-neutral",
                    Name = "Carbon Neutral",
                    TreesPerYear = 130,
                    Co2OffsetPercent = 100,
                    MonthlyPrice = 160,
                    YearlyPrice = 1600,
                    DiscountNote = "20% rabat ved årlig betaling"
                },
                new {
                    Id = "carbon-net-plus",
                    Name = "Carbon Net Plus",
                    TreesPerYear = 260,
                    Co2OffsetPercent = 200,
                    MonthlyPrice = 250,
                    YearlyPrice = 2500,
                    DiscountNote = "20% rabat ved årlig betaling"
                },
                new {
                    Id = "carbon-hero",
                    Name = "Carbon Hero",
                    TreesPerYear = 1300,
                    Co2OffsetPercent = 1000,
                    MonthlyPrice = 1000,
                    YearlyPrice = 10900,
                    DiscountNote = "10% rabat ved årlig betaling"
                },
                new {
                    Id = "carbon-legend",
                    Name = "Carbon Legend",
                    TreesPerYear = 13000,
                    Co2OffsetPercent = 10000,
                    MonthlyPrice = 8750,
                    YearlyPrice = 95000,
                    DiscountNote = "10% rabat ved årlig betaling"
                }
            };

            return Ok(plans);
        }
    }
}
