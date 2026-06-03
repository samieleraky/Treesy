using Microsoft.AspNetCore.Authorization; //importerer namespace for Authorize-attribut, som bruges til at beskytte controllerens endpoints, så kun autentificerede brugere kan få adgang
using Microsoft.AspNetCore.Mvc; //importerer namespace for ControllerBase, ApiController, Route, HttpPost, IActionResult. bruges til at udvikle API-controllers
using Microsoft.EntityFrameworkCore; //importerer namespace for Entity Framework Core, som bruges til at interagere med databasen. Det giver adgang til metoder som Include(), FirstOrDefaultAsync(), SaveChangesAsync() osv., som bruges i controlleren til at hente og opdatere data i databasen
using System.Security.Claims; //importerer namespace for Claims, som bruges til at hente oplysninger om den autentificerede bruger (f.eks. brugerens ID) fra JWT-tokenet i HTTP-anmodningen. Det bruges i controlleren til at identificere hvilken kundes abonnement der skal annulleres
using Stripe;
using treesy_backend.Data;
using treesy_backend.Services;
using treesy_backend.Helpers;

namespace Treesy.Api.Controllers
{
    [ApiController] //fortæller ASP.Net Core at denne klasse er en API-controller, hvilket betyder at den håndterer HTTP-anmodninger og returnerer data (typisk i JSON-format) i stedet for HTML-visninger
    [Route("api/subscription")] //jeg angiver ruten for denne controller. endpointet bliver "api/subscription" fordi controllerens navn er "SubscriptionController" (ASP.Net Core fjerner "Controller" fra navnet for at bestemme ruten)
    [Authorize] //jeg beskytter controlleren med Authorize-attributten, hvilket betyder at alle endpoints i denne controller kræver at brugeren er autentificeret (dvs. har en gyldig JWT-token i HTTP-anmodningen)
    public class SubscriptionController : ControllerBase //opretter en SubscriptionController som nedarver fra Controllerbase, hvilket gør den egnet til API endpoints 
    {
        private readonly TreesyDbContext _db; //depdendency injection. Jeg erklærer en privat readonly variabel _db som repræsenterer databasekonteksten. Den bruges til at tilgå og manipulere data i databasen
        private readonly EmailService _email; //dependency injection. Jeg erklærer en privat readonly variabel _email som repræsenterer en service til at sende emails. Den bruges til at sende en annulleringsmail til kunden, når de annullerer deres abonnement

        public SubscriptionController(TreesyDbContext db, EmailService email) //Jeg opretter en contrsuctor som tager 2 afhængigheder som input - db og email. 
        {
            _db = db; //jeg initialiserer _db variablen med den db-kontekst der bliver injiceret, så jeg kan bruge den i controllerens metoder til at interagere med databasen
            _email = email; // initialiserer _email variablen med den email service der bliver injiceret, så jeg kan bruge den i controllerens metoder til at sende emails
        }

        [HttpPost("cancel")] //jeg opretter en HTTP post endpoint "cancel" med ruten api/subscription/cancel
        public async Task<IActionResult> CancelSubscription() //Jeg opretter en asynkron metode, som ikke tager inputparametre, og som returnerer et HTTP-resultat (IActionResult).Asynkron betyder at metoden kan udføre operationer, der tager tid (f.eks. databaseforespørgsler, API-kald) uden at blokere hovedtråden, hvilket forbedrer ydeevnen og skalerbarheden af applikationen
        {
            var customerIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(customerIdStr, out var customerId))
                return Unauthorized();

            var customer = await _db.Customers
                .Include(c => c.Subscriptions)
                .FirstOrDefaultAsync(c => c.Id == customerId);

            if (customer == null)
                return NotFound();

            var activeSub = customer.Subscriptions
                .Where(s => s.Status == "active")
                .OrderByDescending(s => s.CreatedAt)
                .FirstOrDefault();

            if (activeSub == null)
                return BadRequest(new { message = "Intet aktivt abonnement fundet" });

            // Annuller i Stripe
            var service = new SubscriptionService();
            await service.UpdateAsync(activeSub.StripeSubscriptionId, new SubscriptionUpdateOptions
            {
                CancelAtPeriodEnd = true
            });

            // Opdater i database
            activeSub.Status = "cancelled";  // ← tilføj denne linje
            activeSub.CancelledAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            // Send annulleringsmail
            var planName = PlanHelper.FormatPlanName(activeSub.PlanId);
            

            _ = _email.SendCancellationEmailAsync(
                customer.Email,
                customer.Name ?? customer.Email,
                planName,
                activeSub.CurrentPeriodEnd
            );

            return Ok(new
            {
                message = "Abonnement annulleret — du beholder adgang til " +
                          activeSub.CurrentPeriodEnd.ToString("d. MMMM yyyy")
            });
        }
    }
}