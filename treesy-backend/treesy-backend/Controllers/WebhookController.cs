using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe.Checkout;
using treesy_backend.Data;
using treesy_backend.Models;

namespace Treesy.Api.Controllers
{
    [ApiController]
    [Route("api/stripe/webhook")]
    public class WebhookController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly TreesyDbContext _db;

        public WebhookController(IConfiguration config, TreesyDbContext db)
        {
            _config = config;
            _db = db;
        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
            var json = await new StreamReader(Request.Body).ReadToEndAsync();
            Stripe.Event stripeEvent;

            try
            {
                stripeEvent = Stripe.EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    _config["Stripe:WebhookSecret"]
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Webhook signature verification failed: {ex.Message}");
                return BadRequest();
            }

            if (stripeEvent.Type == "checkout.session.completed")
            {
                var session = stripeEvent.Data.Object as Session;
                var email = session?.CustomerDetails?.Email?.Trim().ToLower() ?? "";
                var mode = session?.Mode;

                Console.WriteLine($"📦 Webhook received: mode={mode}, email={email}");
                Console.WriteLine($"Metadata: planId={session?.Metadata["planId"]}, billing={session?.Metadata["billing"]}");

                try
                {
                    var customer = await _db.Customers.FirstOrDefaultAsync(c => c.Email == email);

                    if (customer == null)
                    {
                        customer = new Customer
                        {
                            Email = email,
                            StripeCustomerId = session?.CustomerId ?? "",
                            PasswordHash = "",
                            CustomerType = "private",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };
                        _db.Customers.Add(customer);
                        await _db.SaveChangesAsync();
                        Console.WriteLine($"✅ Customer created: {customer.Id}");
                    }
                    else
                    {
                        Console.WriteLine($"✅ Customer found: {customer.Id}");
                    }

                    var planId = session?.Metadata["planId"];
                    var billing = session?.Metadata["billing"];

                    if (string.IsNullOrEmpty(planId))
                    {
                        Console.WriteLine("❌ ERROR: planId is null or empty!");
                        return Ok(); // Return ok to Stripe, but log error
                    }

                    if (mode == "subscription")
                    {
                        var subscription = new treesy_backend.Models.Subscription
                        {
                            Id = Guid.NewGuid(),
                            CustomerId = customer.Id,
                            StripeSubscriptionId = session!.SubscriptionId ?? "",
                            PlanId = planId,
                            Billing = billing ?? "monthly",
                            CurrentPeriodEnd = DateTime.UtcNow.AddMonths(1),
                            Status = "active",
                            CreatedAt = DateTime.UtcNow
                        };
                        _db.Subscriptions.Add(subscription);
                        customer.TotalTreesPlanted += GetTreesForPlan(planId);
                        Console.WriteLine($"✅ Subscription added: {subscription.PlanId}");
                    }
                    else if (mode == "payment")
                    {
                        var order = new Order
                        {
                            Id = Guid.NewGuid(),
                            CustomerId = customer.Id,
                            StripeSessionId = session!.Id,
                            PlanId = planId,
                            Trees = GetTreesForPlan(planId),
                            AmountDkk = (session.AmountTotal ?? 0) / 100m,
                            Status = "paid",
                            CreatedAt = DateTime.UtcNow
                        };
                        _db.Orders.Add(order);
                        customer.TotalTreesPlanted += GetTreesForPlan(planId);
                        Console.WriteLine($"✅ Order added: {order.PlanId}, Amount: {order.AmountDkk}");
                    }

                    customer.UpdatedAt = DateTime.UtcNow;

                    // FANG eventuelle exceptions her!
                    try
                    {
                        await _db.SaveChangesAsync();
                        Console.WriteLine($"✅ Database saved successfully!");
                    }
                    catch (Exception dbEx)
                    {
                        Console.WriteLine($"❌ Database error: {dbEx.Message}");
                        if (dbEx.InnerException != null)
                            Console.WriteLine($"Inner: {dbEx.InnerException.Message}");
                        throw; // Re-throw to see the actual error
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ Webhook processing error: {ex.Message}");
                    Console.WriteLine($"Stack trace: {ex.StackTrace}");
                    // Return ok to Stripe so it doesn't retry
                    return Ok();
                }
            }

            return Ok();
        }

        private static int GetTreesForPlan(string planId) => planId switch
        {
            "active-planter" or "active-planter-seed" => 130,
            "committed-planter" or "committed-planter-seed" => 260,
            "hero-planter" or "hero-planter-seed" => 1300,
            "legend-planter" or "legend-planter-seed" => 13000,
            _ => 0
        };
    }
}