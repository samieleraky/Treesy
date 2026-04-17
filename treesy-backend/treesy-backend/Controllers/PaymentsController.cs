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

        // 🔹 1. CREATE CHECKOUT SESSION
        [HttpPost("create-checkout-session")]
        public IActionResult CreateCheckoutSession([FromBody] CheckoutRequest request)
        {
            Console.WriteLine($"Modtaget planId: '{request.PlanId}'");
            Console.WriteLine($"Modtaget billing: '{request.Billing}'");

            var priceId = GetStripePriceId(request.PlanId, request.Billing);

            Console.WriteLine($"PriceId fundet: {priceId ?? "NULL"}");

            if (priceId == null)
                return BadRequest("Invalid plan");

            var mode = request.Billing == "onetime" ? "payment" : "subscription";

            // HENT FRONTEND URL FRA ENVIRONMENT VARIABLE
            var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:5173";

            var options = new SessionCreateOptions
            {
                Mode = mode,
                SuccessUrl = $"{frontendUrl}/success?session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl = $"{frontendUrl}/cancel",
                Metadata = new Dictionary<string, string>
        {
            { "planId", request.PlanId },
            { "billing", request.Billing }
        },
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

        // 🔹 2. VERIFY SESSION (NY!)
        [HttpGet("verify-session")]
        public IActionResult VerifySession(string sessionId)
        {
            var service = new SessionService();
            var session = service.Get(sessionId);

            var email = session.CustomerDetails?.Email;
            var planId = session.Metadata.ContainsKey("planId")
            ? session.Metadata["planId"]: "unknown";
            var billing = session.Metadata["billing"];

            Console.WriteLine($"✅ Payment verified for: {email}");
            Console.WriteLine($"Plan: {planId}, Billing: {billing}");

            // 🚨 HER SKAL DU SENERE GEMME I DATABASE
            // Eksempel:
            // - Find/opret customer
            // - Opret order eller subscription

            return Ok(new
            {
                success = true,
                email,
                planId,
                billing
            });
        }

        // 🔹 PRICE MAPPING
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

                ("active-planter-seed", "onetime") => "price_1TH10jDMkh8CiWDY5GQAaFUJ",
                ("committed-planter-seed", "onetime") => "price_1TH11JDMkh8CiWDYPikwodri",
                ("hero-planter-seed", "onetime") => "price_1TH14DDMkh8CiWDYowYDtzYY",
                ("legend-planter-seed", "onetime") => "price_1TH16ODMkh8CiWDYMFmM2m9o",

                _ => null
            };
        }
    }

    // 🔹 REQUEST MODEL
    public class CheckoutRequest
    {
        public string PlanId { get; set; } = "";
        public string Billing { get; set; } = "";
        public string Email { get; set; } = "";
    }
}