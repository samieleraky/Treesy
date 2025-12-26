using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;

namespace Treesy.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        [HttpPost("create-checkout-session")]
        public IActionResult CreateCheckoutSession([FromBody] CheckoutRequest request)
        {
            var options = new SessionCreateOptions
            {
                Mode = "subscription",
                SuccessUrl = "http://localhost:5173/success",
                CancelUrl = "http://localhost:5173/cancel",
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = "dkk",
                            UnitAmount = request.Amount * 100, // øre
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = request.PlanName
                            },
                            Recurring = new SessionLineItemPriceDataRecurringOptions
                            {
                                Interval = request.Billing == "monthly" ? "month" : "year"
                            }
                        },
                        Quantity = 1
                    }
                }
            };

            var service = new SessionService();
            var session = service.Create(options);

            return Ok(new { url = session.Url });
        }
    }

    public class CheckoutRequest
    {
        public string PlanName { get; set; }
        public long Amount { get; set; }
        public string Billing { get; set; }
    }
}