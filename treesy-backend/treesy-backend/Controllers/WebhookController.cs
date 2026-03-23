using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

namespace Treesy.Api.Controllers
{
    [ApiController]
    [Route("api/stripe/webhook")]
    public class WebhookController : ControllerBase
    {
        private readonly IConfiguration _config;

        public WebhookController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
            var json = await new StreamReader(Request.Body).ReadToEndAsync();

            Event stripeEvent;

            try
            {
                stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    _config["Stripe:WebhookSecret"]
                );
            }
            catch
            {
                return BadRequest();
            }

            // ✅ Når betaling gennemføres
            if (stripeEvent.Type == "checkout.session.completed")
            {
                var session = stripeEvent.Data.Object as Session;

                var email = session?.CustomerDetails?.Email;
                var subscriptionId = session?.SubscriptionId;

                // 🔥 HER SKAL DU GEMME I DATABASE (VIGTIGT)
                // SaveSubscription(email, subscriptionId);

                Console.WriteLine($"New subscription: {email}");
            }

            // ✅ Når subscription fortsætter / renew
            if (stripeEvent.Type == "invoice.paid")
            {
                var invoice = stripeEvent.Data.Object as Invoice;

                Console.WriteLine("Subscription renewed");
            }

            // ❌ Hvis betaling fejler
            if (stripeEvent.Type == "invoice.payment_failed")
            {
                Console.WriteLine("Payment failed");
            }

            return Ok();
        }
    }
}
