using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Stripe;
using System.Net.Http.Headers;
using System.Text;

namespace Treesy.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WebhookController : ControllerBase
    {
        private readonly string _mailchimpApiKey = "your-mailchimp-api-key-usX";
        private readonly string _mailchimpListId = "your-audience-id";
        private readonly HttpClient _httpClient;

        public WebhookController()
        {
            _httpClient = new HttpClient();
            var authToken = Convert.ToBase64String(Encoding.ASCII.GetBytes($"anystring:{_mailchimpApiKey}"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authToken);
        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripeEvent = EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                "your-webhook-secret"
            );

            if (stripeEvent.Type == Events.CheckoutSessionCompleted)
            {
                var session = stripeEvent.Data.Object as Session;
                var email = session.CustomerDetails.Email;

                var mcData = new
                {
                    email_address = email,
                    status = "subscribed",
                    tags = new[] { "Stripe Subscriber" }
                };

                var content = new StringContent(JsonConvert.SerializeObject(mcData), Encoding.UTF8, "application/json");

                var url = $"https://usX.api.mailchimp.com/3.0/lists/{_mailchimpListId}/members/";

                var response = await _httpClient.PostAsync(url, content);

                if (!response.IsSuccessStatusCode)
                {
                    // Log fejl hvis ønsket
                }
            }

            return Ok();
        }
    }
}
