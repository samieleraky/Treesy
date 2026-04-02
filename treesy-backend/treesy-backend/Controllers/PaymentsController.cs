using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

namespace Treesy.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IConfiguration _config;

        public PaymentsController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("create-checkout-session")]
        public IActionResult CreateCheckoutSession([FromBody] CheckoutRequest request)
        {

            // ← TILFØJ DISSE TO LINJER:
            Console.WriteLine($"Modtaget planId: '{request.PlanId}'");
            Console.WriteLine($"Modtaget billing: '{request.Billing}'");


            // 🔒 Map planId → Stripe PriceId
            var priceId = GetStripePriceId(request.PlanId, request.Billing);

            // ← TILFØJ DENNE LINJE:
            Console.WriteLine($"PriceId fundet: {priceId ?? "NULL"}");

            if (priceId == null)
                return BadRequest("Invalid plan");

            //Seed credits er one-time purchases, abonnementer er subscriptions
            var mode = request.Billing == "onetime" ? "payment" : "subscription";

            var options = new SessionCreateOptions
            {
                Mode = mode,
                SuccessUrl = "http://localhost:5173/success",
                CancelUrl = "http://localhost:5173/cancel",
                Metadata = new Dictionary<string, string>
                {
                    { "planId", request.PlanId },
                    { "billing", request.Billing }
                },

                //CustomerEmail = request.Email,

                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        Price = priceId,
                        Quantity = 1
                    }
                }
            };

            var service = new SessionService();
            var session = service.Create(options);

            return Ok(new { url = session.Url });
        }
        //Sample map. In production, you would likely want to store this mapping in a database or configuration file.
        private string? GetStripePriceId(string planId, string billing)
        {
            return (planId, billing) switch
            {
                ("active-planter", "monthly") => "price_1SoSuzDMkh8CiWDY9A4XWlfG",
                ("active-planter", "yearly") => "price_1SoSxHDMkh8CiWDYB4CWDWSF",

                ("committed-planter", "monthly") => "price_1SoSvQDMkh8CiWDYcq6b7mFt",
                ("committed-planter", "yearly") => "price_1SoSxnDMkh8CiWDY9DPWWGN1",

                ("hero-planter", "monthly") => "price_1SoSvjDMkh8CiWDYAN6c0g9c",
                ("hero-planter", "yearly") => "price_1SoSwUDMkh8CiWDYqlnI5NXf",

                ("legend-planter", "monthly") => "price_1SoSy8DMkh8CiWDY9vnnMYzh",
                ("legend-planter", "yearly") => "price_1SoSydDMkh8CiWDYbCNM0nLf",

                ("active-planter-seed", "onetime") => "price_1TH10jDMkh8CiWDY5GQAaFUJ",   // seed credit Active
                ("committed-planter-seed", "onetime") => "price_1TH11JDMkh8CiWDYPikwodri", // seed credit Committed
                ("hero-planter-seed", "onetime") => "price_1TH14DDMkh8CiWDYowYDtzYY",       // seed credit Hero
                ("legend-planter-seed", "onetime") => "price_1TH16ODMkh8CiWDYMFmM2m9o",     // seed credit Legend
                _ => null
            };
        }
    }

    public class CheckoutRequest
    {
        public string PlanId { get; set; } = "";
        public string Billing { get; set; } = "";
        public string Email { get; set; } = "";
    }
}