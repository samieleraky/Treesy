using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe.Checkout;
using treesy_backend.Data;
using treesy_backend.Models;
using treesy_backend.Services;

namespace Treesy.Api.Controllers
{
    [ApiController]
    [Route("api/stripe/webhook")]
    public class WebhookController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly TreesyDbContext _db;
        private readonly EmailService _email;

        public WebhookController(IConfiguration config, TreesyDbContext db, EmailService email)
        {
            _config = config;
            _db = db;
            _email = email;
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

                // ✅ FIX 1: Hent planId og billing FØRST (flyttet op!)
                var planId = session?.Metadata["planId"];
                var billing = session?.Metadata["billing"];

                Console.WriteLine($"📦 Webhook received: mode={mode}, email={email}");
                Console.WriteLine($"Metadata: planId={planId}, billing={billing}");

                // Tjek om planId findes
                if (string.IsNullOrEmpty(planId))
                {
                    Console.WriteLine("❌ ERROR: planId is null or empty!");
                    return Ok();
                }

                // ✅ FIX 2: Brug planId og billing HER (de er nu defineret)
                var planName = FormatPlanName(planId);
                var trees = GetTreesForPlan(planId);

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
                        await _db.SaveChangesAsync(); // Gem først for at få Customer.Id
                        Console.WriteLine($"✅ Customer created: {customer.Id}");
                    }
                    else
                    {
                        Console.WriteLine($"✅ Customer found: {customer.Id}");
                    }

                    // Opret subscription eller order
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
                    await _db.SaveChangesAsync();

                    // ✅ FIX 3: Send email EFTER alt er gemt (flyttet ned!)
                    if (mode == "subscription")
                    {
                        _ = _email.SendOrderConfirmationAsync(
                            email,
                            customer.Name ?? email,
                            planName,
                            billing ?? "monthly",
                            (session.AmountTotal ?? 0) / 100m,
                            trees,
                            DateTime.UtcNow.AddMonths(1)
                        );
                    }
                    else if (mode == "payment")
                    {
                        _ = _email.SendOrderConfirmationAsync(
                            email,
                            customer.Name ?? email,
                            planName,
                            "onetime",
                            (session.AmountTotal ?? 0) / 100m,
                            trees,
                            DateTime.UtcNow
                        );
                    }

                    Console.WriteLine($"✅ Database saved successfully!");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ Webhook processing error: {ex.Message}");
                    Console.WriteLine($"Stack trace: {ex.StackTrace}");
                    return Ok();
                }
            }

            return Ok();
        }

        // ✅ FIX 4: Tilføj den manglende FormatPlanName funktion
        private static string FormatPlanName(string planId)
        {
            return planId switch
            {
                "active-planter" or "active-planter-seed" => "Active Planter",
                "committed-planter" or "committed-planter-seed" => "Committed Planter",
                "hero-planter" or "hero-planter-seed" => "Hero Planter",
                "legend-planter" or "legend-planter-seed" => "Legend Planter",
                _ => planId // Hvis ukendt, returnér originalt navn
            };
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