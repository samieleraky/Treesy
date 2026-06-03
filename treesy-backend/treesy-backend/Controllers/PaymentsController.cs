using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

namespace Treesy.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase // Jeg er erklærer controllerklassen PaymentsController som håndterer betalingsrelaterede requests. Den nedarver fra Controllerbase hvilket giver den adgang til metoder som Ok(), BadRequest() og andre HTTPS-responser
    {
        private readonly IConfiguration _config; //Jeg erklærer et privat feæt af typen IConfiguration, som bruges til at hente konfigurationsværdier (f.eks. environment variables). Dette er nyttigt for at kunne konfigurere ting som Stripe API nøgler og frontend URL uden at hardcode dem i koden.

        public PaymentsController(IConfiguration config) //Jeg opretter en constructor for PaymentsController. Den modtager en instans af Iconfiguration via dependency Injection og gemmer den i feltet _config så vi kan bruge den i vores metoder senere. Dette gør det muligt at hente konfigurationsværdier fra environment variables eller appsettings.json uden at hardcode dem i koden.
        {
            _config = config;
        }

        // 🔹 1. CREATE CHECKOUT SESSION
        [HttpPost("create-checkout-session")] //Jeg angiver at metoden createCheckoutSession kan kaldes via HTTP post request på endpoint /api/payments/create-checkout-session.
        public IActionResult CreateCheckoutSession([FromBody] CheckoutRequest request) // Her deklarerer jeg en metode, som modtager data fra request body og binder dem til et objekt af typen CheckoutRequest. Metoden returnerer et IActionResult, så den kan returnere forskellige HTTP-responser.

        {
            Console.WriteLine($"Modtaget planId: '{request.PlanId}'"); //log for at se hvilken planId der modtages fra frontend -> fejlsøgning
            Console.WriteLine($"Modtaget billing: '{request.Billing}'"); //log for at se hvilken billing type der modtages fra frontend -> fejlsøgning

            var priceId = GetStripePriceId(request.PlanId, request.Billing); //jeg erklærer en variablen priceid. Den får værdi, som returnes fra metoden GetStripePriceId(). Formålet er at finde den stripe Price ID der matcher den valgte plan og betalingsform

            Console.WriteLine($"PriceId fundet: {priceId ?? "NULL"}"); //log for at se hvilken priceId der blev fundet baseret på planId og billing. Hvis ingen priceId blev fundet, vil den logge "NULL" 

            if (priceId == null) //If metode som undersøger om der blev fundet en gyldig Stripe Price ID. Hvis ikke den findes returnes "invalid plan"
                return BadRequest("Invalid plan");

            var mode = request.Billing == "onetime" ? "payment" : "subscription"; //Mode er enten "payment" eller "subscription" afhængig af om billing typen er "onetime" eller ej. Dette bruges senere til at fortælle Stripe hvilken type checkout session der skal oprettes.

            // HENT FRONTEND URL FRA ENVIRONMENT VARIABLE
            var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:5173"; //	Her erklærer jeg variablen frontendUrl. Først forsøger jeg at hente værdien fra en miljøvariabel. Hvis miljøvariablen ikke findes, bruges standardværdien http://localhost:5173.


            var options = new SessionCreateOptions //Her erklærer jeg et objekt af typen SessionCreateOptions. Objektet bruges til at konfigurere den checkout-session, der skal oprettes hos Stripe.

            {
                Mode = mode, //Her angiver jeg, om checkout-sessionen skal være en almindelig betaling eller et abonnement.e
                SuccessUrl = $"{frontendUrl}/success?session_id={{CHECKOUT_SESSION_ID}}", //Her angiver jeg den URL, brugeren sendes tilbage til efter en succesfuld betaling.
                CancelUrl = $"{frontendUrl}/cancel", //Her angiver jeg den URL, brugeren sendes tilbage til, hvis betalingen annulleres
                Metadata = new Dictionary<string, string> //Her erklærer jeg en dictionary med metadata. disse oplysninger gennems sammen med checkout-sessionen hos stripe og kan bruges senere til at identificere den valgte plan og betalingsform
        {
            { "planId", request.PlanId }, //Jeg tilføjer planId til metadata, så vi senere kan se hvilken plan brugeren valgte, når vi verificerer sessionen.
            { "billing", request.Billing } //Jeg tilføjer billing til metadata, så vi senere kan se hvilken betalingsform brugeren valgte, når vi verificerer sessionen.
        },
                LineItems = new List<SessionLineItemOptions> //Her erklærer jeg en liste over de produkter, som checkout-sessionen skal indeholde.
        {
            new SessionLineItemOptions
            {
                Price = priceId, //jeg angiver den Stripe Price Id som kunden skal betale for
                Quantity = 1 // jeg angiver at kunden kun køber 1 enhed af dette produkt. Det betyder at kunden kun betaler for 1 abonnement eller 1 engangskøb, afhængig af hvad priceId repræsenterer.
            }
        }
            };

            var service = new SessionService(); // Her erklærer jeg et objekt af typen SessionService. Klassen kommer fra Stripe-biblioteket og bruges til at arbejde med checkout-sessioner.
            var session = service.Create(options); // Jeg erklærer variabelen session og kalder Create() metoden. Stripe opretter checkout-sessionen og returnerer et objekt med info om sessionen

            return Ok(new { url = session.Url }); //Her returnerer jeg en HTTP 200 OK-respons som indeholder URLen til Stripe Checkout
        }

        // 🔹 2. VERIFY SESSION (NY!)
        [HttpGet("verify-session")] //jeg angiver at metoden kan kaldes via en HTTP-GET request på endpointet /api/payments/verify-session
        public IActionResult VerifySession(string sessionId) //jeg erklærer metoden VerifySession som tager sessionId som parameter. Dette sessionId bruges til at hente information om den specifikke checkout-session fra Stripe, så vi kan verificere betalingen og hente de gemte metadata (planId og billing).
        {
            var service = new SessionService(); // Her erklærer jeg endnu en instans af SessionService, som bruges til at hente information om en eksisterende Stripe-session.
            var session = service.Get(sessionId); // Her erklærer jeg variablen session og henter checkout-sessionen fra Stripe baseret på det modtagne sessionId

            var email = session.CustomerDetails?.Email; // 	Her erklærer jeg variablen email og henter kundens emailadresse fra Stripe-sessionen.

            var planId = session.Metadata.ContainsKey("planId") //Her erklærer jeg variablen planId. Hvis metadata indeholder en planId, anvendes den værdi. Ellers bruges værdien "unknown".
            ? session.Metadata["planId"]: "unknown"; 
            var billing = session.Metadata["billing"];

            Console.WriteLine($"✅ Payment verified for: {email}"); //Jeg logger en besked i konsollen for at indikere, at betalingen er blevet verificeret, og jeg inkluderer kundens emailadresse i loggen for at kunne identificere hvilken kunde det drejer sig om.
            Console.WriteLine($"Plan: {planId}, Billing: {billing}"); //Jeg logger også den valgte plan og betalingsform for at kunne se hvilken plan kunden har købt og hvordan de har valgt at betale.


            return Ok(new //returnerer en HTTP 200 OK-respons som indeholder information om at betalingen er blevet verificeret, samt kundens email, den valgte plan og betalingsform. Dette kan bruges af frontend til at vise en bekræftelse til kunden eller opdatere brugergrænsefladen baseret på den købte plan.
            {
                success = true,
                email,
                planId,
                billing
            });
        }

        // 🔹 PRICE MAPPING
        private string? GetStripePriceId(string planId, string billing) //jeg erklærer en privat metode som tager planid og betalingsform som parameter. Metoden returnerer en string som er Stripe Price Id'en der matcher den valgte plan og betalingsform. Hvis der ikke findes en matchende Price Id, returneres null. Dette bruges til at sikre at vi opretter checkout-sessionen med den korrekte pris baseret på kundens valg.
        {
            return (planId, billing) switch //Her anvender jeg et switch expression, som matcher kombinationen af planId og billing med den korrekte Stripe Price ID.
            {
                ("active-planter", "monthly") => "price_1SoSuzDMkh8CiWDY9A4XWlfG", //matches med den aktive planter plan med månedlig betaling og returnerer den tilsvarende Stripe Price ID
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

                _ => null //hvis ingen kombination matcher, returnerer metoden nul
            };
        }
    }

    // 🔹 REQUEST MODEL
    public class CheckoutRequest //CheckoutRequest-klasse som bruges til at modtage data fra frontend, når der oprettes en checkout session
    {
        public string PlanId { get; set; } = ""; //jeg erklærer en public property planId som indeholder den plan brugeren har valgt 
        public string Billing { get; set; } = "";
        public string Email { get; set; } = "";
    }
}