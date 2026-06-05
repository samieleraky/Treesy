using Microsoft.AspNetCore.Authorization; //importerer namespace for Authorize-attribut, som bruges til at beskytte controllerens endpoints, så kun autentificerede brugere kan få adgang
using Microsoft.AspNetCore.Mvc; //AspNet Core namespace for ControllerBase, ApiController, Route, HttpGet, IActionResult. bruges til at udvikle API-controllers
using Microsoft.EntityFrameworkCore; //Importerer EntityFramworkCore som tillader mig at interagere med databasen ved hjælp af LINQ-forespørgsler og asynkrone metoder som ToListAsync()
using System.Security.Claims; //Claims namespace bruges til at hente oplysninger om den autentificerede bruger (f.eks. brugerens ID) fra JWT-tokenet i HTTP-anmodningen. Det bruges i controlleren til at identificere hvilken kundes træer der skal hentes
using Stripe;
using treesy_backend.Data;
using treesy_backend.Services;


namespace Treesy.Api.Controllers
{
    [ApiController] //jeg fortæller ASP NET core at det er en controller klasse der håndterer HTTP anmodninger og returnerer data (typisk i JSON-format) i stedet for HTML-visninger
    [Route("api/[controller]")] //jeg angiver ruten for controller. api/Trees fordi controllerens navn er TreesController (ASP.Net Core fjerner "Controller" fra navnet for at bestemme ruten)
    [Authorize] //jeg bruger Authorize attributen til at fortælle ASP NET core at alle endpoints i denne controller kræver at brugeren er autentificeret (dvs. har en gyldig JWT token i HTTP anmodningen)
    public class TreesController : ControllerBase //jeg opretter en controller klasse som nedarver fra ControllerBase, hvilket gør den egnet til at håndtere API endpoints. Denne controller vil håndtere HTTP anmodninger relateret til træer, såsom at hente en liste over træer for den autentificerede kunde
    {
        private readonly TreesyDbContext _db; //dependency injection. Jeg erklærer en privat readonly variabel _db som repræsenterer databasekonteksten. Den bruges til at tilgå og manipulere data i databasen, specifikt for at hente træer relateret til den autentificerede kunde

        public TreesController(TreesyDbContext db) //Jeg opretter en constructor, som modtager en instans af TreesyDbContext via dependency injection. Databasen initialiseres herefter i det private felt _db, så controllerens metoder kan kommunikere med databasen.
        {
            _db = db;
        }

        [HttpGet] //Jeg opretter en HTTP Get endpoint, som betyder at GetTrees metoden kan kaldes via en HTTP Get anmodning. 
        public async Task<IActionResult> GetTrees() //Asynkron metode som returnerer en IActionResult, hvilket er en standard måde at returnere HTTP-responser i ASP.Net Core. Det kan være en succes (OK) eller en fejl (BadRequest) afhængigt af situationen. Denne metode vil hente og returnere en liste over træer for den autentificerede kunde
        {
            var customerIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier); //jeg erklærer en varibel customerIdStr som henter brugerns id via ClaimTypes.NameIdentifier, som er en standard claim type der bruges til at gemme en brugers unikke i JWD tokenet. FindFirstValue finder den første claim af den angivne type og returnerer dens værdi. I dette tilfælde forventer jeg at NameIdentifier claim indeholder kundens ID, som jeg senere bruger til at finde kundens træer i databasen

            if (!Guid.TryParse(customerIdStr, out var customerId)) //Hvis brugeren ikke har et gyldigt ID (dvs. customerIdStr ikke er en gyldig Guid), så returnerer jeg Unauthorized(), hvilket betyder at brugeren ikke har adgang til at hente træerne, fordi deres ID ikke er gyldigt
                return Unauthorized();

            var trees = await _db.Trees //Jeg erklærer en variabel trees som henter træerne fra databasen. await bruges fordi det er en asynktion operation. Jeg bruger LINQ til at filtrere træerne og finde dem der matcher betingelsen t.CustomerId == customerId (dvs. træets CustomerId matcher det ID jeg hentede fra JWT tokenet)
                .Where(t => t.CustomerId == customerId) //hvor træets CustomerId matcher det ID jeg hentede fra JWT tokenet
                .Select(t => new //Vælger kun de relevante felter (Latitude og Longitude) for at returnere til klienten, og omdøber dem til lat og lng for at gøre det mere intuitivt
                {
                    lat = t.Latitude,
                    lng = t.Longitude
                })
                .ToListAsync(); //ToListAsync er en asynkron metode der eksekverer forespørgslen og returnerer resultatet som en liste. Det gør det muligt for serveren at håndtere andre anmodninger, mens den venter på at databaseoperationen er færdig, hvilket forbedrer ydeevnen og skalerbarheden af applikationen

            return Ok(trees); //rturnerer en HTTP 200 OK respons med listen af træer i JSON format. Det betyder at anmodningen var succesfuld, og klienten vil modtage dataene i response body.
        }
    }
}