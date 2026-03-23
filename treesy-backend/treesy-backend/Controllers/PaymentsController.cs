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
            // 🔒 Map planId → Stripe PriceId
            var priceId = GetStripePriceId(request.PlanId, request.Billing);

            if (priceId == null)
                return BadRequest("Invalid plan");

            var options = new SessionCreateOptions
            {
                Mode = "subscription",
                SuccessUrl = "http://localhost:5173/success",
                CancelUrl = "http://localhost:5173/cancel",

                CustomerEmail = request.Email,

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
                ("carbon-neutral", "monthly") => "price_123",
                ("carbon-neutral", "yearly") => "price_456",

                ("carbon-net-plus", "monthly") => "price_789",
                ("carbon-net-plus", "yearly") => "price_101",

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