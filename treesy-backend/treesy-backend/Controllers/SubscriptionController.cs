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
    [ApiController] //fortæller ASP.Net Core at denne klasse er en API-controller, hvilket betyder at den håndterer HTTP-anmodninger og returnerer data (typisk i JSON-format)
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
            var customerIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier); //jeg erklærer en variabel customerIdStre som henter brugerns id via ClaimTypes.NameIdentifier, som er en standard claim type der bruges til at gemme en brugers unikke i JWD tokenet. FindFirstValue finder den første claim af den angivne type og returnerer dens værdi. I dette tilfælde forventer jeg at NameIdentifier claim indeholder kundens ID, som jeg senere bruger til at finde kunden i databasen og annullere deres abonnement
            if (!Guid.TryParse(customerIdStr, out var customerId)) //if metode. Jeg prøver at parse customerIdStr til en Guid (globally unique identifier som generer unikke idér). Hvis parsing fejler (dvs. customerIdStr ikke er en gyldig Guid), så returnerer jeg Unauthorized(), hvilket betyder at brugeren ikke har adgang til at annullere abonnementet, fordi deres ID ikke er gyldigt
                return Unauthorized();

            var customer = await _db.Customers //Jeg erklærer en varibel customer som henter kunden fra databasen. await bruges fordi det er en asynktion operation. 
                .Include(c => c.Subscriptions) //Include metoden bruger en linq eksrepssion til at inkludere relaterede data i forespørgslen. I dette tilfælde inkluderer jeg kundens abonnementer (Subscriptions), så jeg kan tjekke deres status senere i koden
                .FirstOrDefaultAsync(c => c.Id == customerId); //FirstOrDefaultAsync er en asynkron metode der finder den første post i Customers tabellen som matcher betingelsen c.Id == customerId (dvs. kundens ID matcher det ID jeg hentede fra JWT tokenet). 

            if (customer == null) //Hvis ingen kunde findes, returnerer den null. NotFound() betyder at ressource ikke blev fundet, i dette tilfælde betyder det at kunden med det angivne ID ikke findes i databasen, og derfor kan abonnementet ikke annulleres
                return NotFound();

            var activeSub = customer.Subscriptions //Jeg erklærer en variabel activeSub som henter det aktive abonnement for kunden. Jeg bruger LINQ til at filtrere kundens abonnementer og finde det første abonnement hvor status er "active". Jeg sorterer også abonnementerne efter CreatedAt i faldende rækkefølge, så hvis der er flere aktive abonnementer, får jeg det nyeste. Hvis der ikke findes noget aktivt abonnement, returnerer den null
                .Where(s => s.Status == "active")
                .OrderByDescending(s => s.CreatedAt)
                .FirstOrDefault(); //FirstOrDefault finder det første abonnemt der matcher betingelsen (status == "active") og returnerer det. 

            if (activeSub == null) //if metode. hvis ingen aktivt abonnemt returnes BadRequest(), hvilket betyder at anmodningen er ugyldig, fordi der ikke findes noget aktivt abonnement at annullere for denne kunde
                return BadRequest(new { message = "Intet aktivt abonnement fundet" });

            // Annuller i Stripe
            var service = new SubscriptionService(); //Jeg opretter en instans af Stripe's SubscriptionService, som bruges til at interagere med Stripe's API for at håndtere abonnementer. Jeg bruger denne service til at annullere kundens abonnement i Stripe, så de ikke bliver opkrævet i fremtiden
            await service.UpdateAsync(activeSub.StripeSubscriptionId, new SubscriptionUpdateOptions // Jeg kalder UpdateAsync metoden som tager abonnementets Stripe ID og en SubscriptionUpdateOptions objekt som specificerer hvordan abonnementet skal opdateres. I dette tilfælde sætter jeg CancelAtPeriodEnd til true, hvilket betyder at abonnementet vil blive annulleret ved slutningen af den nuværende faktureringsperiode, så kunden beholder adgang indtil da
            {
                CancelAtPeriodEnd = true
            });

            // Opdater i database
            activeSub.Status = "cancelled";  //Databasen opdateres for at afspejle annulleringen. 
            activeSub.CancelledAt = DateTime.UtcNow; //Jeg sætter status for abonnementet til "cancelled" og opdaterer CancelledAt til det aktuelle tidspunkt i UTC. Dette hjælper med at holde styr på, at abonnementet er blevet annulleret, og hvornår det skete
            await _db.SaveChangesAsync(); //Jeg gemmer ændringerne i databasen ved at kalde SaveChangeAsync metoden.  

            // Send annulleringsmail
            var planName = PlanHelper.FormatPlanName(activeSub.PlanId); //jeg erklærer en variabel PlanName som kalder PlanHelper.FormatPlaneName metoden som tager kundens active abonnemt og id 
            

            _ = _email.SendCancellationEmailAsync( //Jeg sender en email til kunden ved at kalde SendCancellationEmailAsync metoden på emailservicen. Jeg bruger =_ for at ignorer det returnede task objekt
                customer.Email, //Jeg sender emailen til kundens emailadresse
                customer.Name ?? customer.Email, //Kunden har måske ikke et navn i databasen, så jeg bruger null-coalescing operator (??) til at falde tilbage på emailadressen som navn, hvis Name er null
                planName, //jeg inkluderer navnet på abonnementen 
                activeSub.CurrentPeriodEnd //Jeg inkluderer også slutdatoen for den nuværende faktureringsperiode, så kunden ved hvor længe de har adgang til tjenesten efter annulleringen
            );

            return Ok(new //Jeg returnerer en  HTTP-response (200 ok) med en besked i Json format at abonnemt er annuleret. Slutdatoen gemmes som string og vises i dag, måned, år. 
            {
                message = "Abonnement annulleret — du beholder adgang til " +
                          activeSub.CurrentPeriodEnd.ToString("d. MMMM yyyy")
            });
        }
    }
}