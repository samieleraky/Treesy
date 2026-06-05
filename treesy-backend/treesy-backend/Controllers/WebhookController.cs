using Microsoft.AspNetCore.Mvc; //AspNet Core namespace for ControllerBase, ApiController, Route, HttpGet, IActionResult. bruges til at udvikle API-controllers
using Microsoft.EntityFrameworkCore; //EntityFrameworkCore namespace, som tillader mig at interagere med databasen ved hjælp af LINQ-forespørgsler og asynkrone metoder som ToListAsync()
using Stripe.Checkout;
using treesy_backend.Data;
using treesy_backend.Models;
using treesy_backend.Services;
using treesy_backend.Helpers;

namespace Treesy.Api.Controllers 
{
    [ApiController] //Jeg fortæller ASP NET Core at der er en controllerklasse, som håndterer HTTP-anmodninger og returnerer data (typisk i JSON-format) i stedet for HTML-visninger
    [Route("api/stripe/webhook")] //route for controlleren. Stripe sender webhook anmodninger til endpointet "api/stripe/webhook".
    public class WebhookController : ControllerBase //Jeg opretter en controllerklasse, som nedarver fra ControllerBase. Dette giver adgang til metoder som Ok(), BadRequest() og adgang til HTTP-requesten
    {
        private readonly IConfiguration _config; //dependency injection. Jeg erklærer en privat readonly variabel til konfigurationsdata. Den bruges til at hente værdier fra eksempelvis appsettings.json, herunder Stripe Webhook Secret.
        private readonly TreesyDbContext _db; //bruges til at oprette og opdatere databasne
        private readonly EmailService _email; //bruges til at sende emails

        public WebhookController(IConfiguration config, TreesyDbContext db, EmailService email) //Constructor som tager IConfiguration, TreesyDbContext og EmailService som input. Disse afhængigheder injiceres af ASP.NET Core's dependency injection system, så jeg kan bruge dem i controllerens metoder til at håndtere webhook-anmodninger, interagere med databasen og sende emails
        {
            _config = config;
            _db = db;
            _email = email;
        }

        [HttpPost] //Jeg opretter en HTTP-post endpoint, som betyder at Post-metoden kan kaldes via HTTP Post-anmodninger.
        public async Task<IActionResult> Post() //asynkron metode som håndterer Stripe-webhook anmodninger. den returnerer en IActionResult, hvilket er en standard måde at returnere HTTP-responser i ASP.NET Core. Det kan være en succes (OK) eller en fejl (BadRequest) afhængigt af situationen. Denne metode vil håndtere forskellige typer af Stripe-events, såsom "checkout.session.completed", og opdatere databasen og sende emails baseret på event-typen og dataene i eventet.
        {
            var json = await new StreamReader(Request.Body).ReadToEndAsync(); //Jeg erklærer en variabel json. Den indeholder hele HTTP requestens body som en string. Jeg bruger en StreamReader til at læse requestens body stream og ReadToEndAsync for at læse hele streamen asynkront. Dette er nødvendigt fordi Stripe sender event-data i requestens body som JSON, og jeg skal have det som en string for at kunne parse det senere til et Stripe.Event objekt.
            Stripe.Event stripeEvent; // Jeg erklærer en variabel StripeEvent, som senere skal indeholde det verificerede Stripe-event.

            try //Try catch til at håndtere eventuelle fejl der kan opstå under verifikation af stripe-eventet
            {
                stripeEvent = Stripe.EventUtility.ConstructEvent( //Jeg bruger Stripe's EventUtility.ConstructEvent metode til at verificere og konstruere et Stripe.Event objekt fra den modtagne JSON og Stripe-Signature headeren. Denne metode sikrer at eventet faktisk kommer fra Stripe og ikke er blevet manipuleret undervejs. Den tager tre parametre:
                    json, //Json var fra linje 29 som indeholder hele HTTP requestens body som en string, som er det rå event-data fra Stripe
                    Request.Headers["Stripe-Signature"], //Request.Headers["Stripe-Signature"] henter Stripe-Signature headeren fra HTTP requesten, som indeholder den signatur som Stripe sender med hver webhook-anmodning. Denne signatur bruges til at verificere at eventet kommer fra Stripe og ikke er blevet manipuleret
                    _config["Stripe:WebhookSecret"] //_config["Stripe:WebhookSecret"] henter Stripe Webhook Secret fra konfigurationen (f.eks. appsettings.json). Dette er en hemmelig nøgle som jeg har konfigureret i Stripe dashboardet for at sikre at kun Stripe kan sende gyldige webhook-anmodninger til mit endpoint. Denne nøgle bruges sammen med Stripe-Signature headeren til at verificere eventet. Hvis verifikationen fejler (f.eks. hvis signaturen ikke matcher eller hvis eventet er blevet manipuleret), så vil ConstructEvent kaste en exception, som jeg fanger i catch-blokken og returnerer BadRequest()
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Webhook signature verification failed: {ex.Message}");
                return BadRequest(); //BadRequest metode fra ControllerBase returnerer en HTTP 400 Bad Request respons, hvilket betyder at anmodningen var ugyldig. I dette tilfælde betyder det at Stripe-eventet ikke kunne verificeres, og derfor afvises anmodningen.
            }

            if (stripeEvent.Type == "checkout.session.completed") //hvis typen af det modtagne Stripe-event er "checkout.session.completed", så betyder det at en kunde har gennemført en checkout-session i Stripe, og jeg skal håndtere dette event ved at opdatere databasen og sende en bekræftelsesemail til kunden. Jeg tjekker event-typen ved at sammenligne stripeEvent.Type med den forventede string "checkout.session.completed". Hvis de matcher, så går jeg videre med at håndtere eventet inden for if-blokken.
            {
                var session = stripeEvent.Data.Object as Session; //Jeg erklærer en variabel sesson, som indeholder det Stripe Checkout Session-objekt, der er knyttet til det modtagne event. Jeg bruger stripeEvent.Data.Object for at få adgang til det rå dataobjekt i eventet, og jeg caster det til en Session, som er den specifikke type af objekt jeg forventer for "checkout.session.completed" events. Dette giver mig adgang til alle de relevante oplysninger om checkout-sessionen, såsom kundens email, planId, billing, beløb osv., som jeg senere bruger til at opdatere databasen og sende emails.
                var email = session?.CustomerDetails?.Email?.Trim().ToLower() ?? ""; //Jeg erklærer en variabel email, som indeholder kundens emailadresse hentet fra checkout-sessionen. Jeg bruger session?.CustomerDetails?.Email for at få adgang til emailen, og jeg bruger null-conditional operatorer (?.) for at undgå null reference exceptions, hvis nogen af disse objekter er null. Jeg bruger også Trim() for at fjerne eventuelle førende eller efterfølgende mellemrum, og ToLower() for at konvertere emailen til små bogstaver, så den er i et standardiseret format. Hvis emailen ikke findes (dvs. hvis session eller CustomerDetails eller Email er null), så sætter jeg email til en tom string "" ved hjælp af null-coalescing operator (??).
                var mode = session?.Mode; //Jeg erklærer en variabel mode, som indeholder betalings- eller abonnementsmoden for checkout-sessionen. Jeg bruger session?.Mode for at få adgang til denne information, og jeg bruger null-conditional operator (?.) for at undgå null reference exceptions, hvis session er null. Mode kan være "subscription" hvis kunden har købt et abonnement, eller "payment" hvis kunden har foretaget et engangskøb. Jeg bruger denne information senere i koden for at bestemme hvordan jeg skal opdatere databasen og sende emails baseret på typen af køb.

                var planId = session?.Metadata["planId"]; // jeg erklærer en variabel planId som indeholder planId'et for det købte abonnement eller produkt, som er gemt i sessionens metadata. Jeg bruger session?.Metadata["planId"] for at få adgang til denne information, og jeg bruger null-conditional operator (?.) for at undgå null reference exceptions, hvis session eller Metadata er null. PlanId er en vigtig information, fordi den fortæller mig hvilket abonnement eller produkt kunden har købt, og jeg bruger den senere i koden for at opdatere databasen korrekt og sende relevante oplysninger i emailen til kunden.
                var billing = session?.Metadata["billing"]; //Jeg er klærer en variabel billing som indeholder faktureringscyklus for abonnementet, som er gemt i sessionens metadata. Jeg bruger session?.Metadata["billing"] for at få adgang til denne information, og jeg bruger null-conditional operator (?.) for at undgå null reference exceptions, hvis session eller Metadata er null. Billing kan være "monthly" eller "yearly", og jeg bruger denne information senere i koden for at opdatere databasen korrekt og sende relevante oplysninger i emailen til kunden.

                Console.WriteLine($"📦 Webhook received: mode={mode}, email={email}"); //Jeg logger nogle grundlæggende oplysninger om det modtagne webhook-event, såsom mode (subscription eller payment) og emailen på kunden, for at hjælpe med fejlfinding og overvågning. Dette giver mig mulighed for at se i loggene, hvilke events der kommer ind, og hvilke data de indeholder, hvilket er nyttigt for at sikre at webhook-håndteringen fungerer som forventet og for at identificere eventuelle problemer.
                Console.WriteLine($"Metadata: planId={planId}, billing={billing}");

                // Tjek om planId findes
                if (string.IsNullOrEmpty(planId))
                {
                    Console.WriteLine("❌ ERROR: planId is null or empty!");
                    return Ok();
                }

                // Jeg erklærer variabeler planName, trees og treeCount. planName og trees kaldes ved hjælpe af PlanHelper-klassen, som er en hjælpeklasse jeg har oprettet for at håndtere logik relateret til abonnementer og produkter. PlanName formaterer planId'et til et mere læsbart format, som jeg senere bruger i emailen til kunden. Trees henter antallet af træer der er knyttet til det købte abonnement eller produkt baseret på planId'et, 
                var planName = PlanHelper.FormatPlanName(planId); //jeg erklærer en variabel planName som kalder PlanHelper.FormatPlaneName metoden, som tager planId'et og formaterer det til et mere læsbart format. For eksempel, hvis planId er "active-planter-monthly", så kan FormatPlanName returnere "Active Planter Monthly". Dette gør det nemmere at inkludere planens navn i emailen til kunden og i loggene, så det er mere forståeligt for både mig og kunden.
                var trees = PlanHelper.GetTreesForPlan(planId); // og treeCount gemmer dette antal for senere brug i databasen og emailen.
                var treeCount = trees;
                var random = new Random(); //jeg opretter en tilfædighedsgenerator

                try //try catch til at hente eller oprette kunden i databasen, og for at håndtere eventuelle fejl der kan opstå under denne proces, såsom databasefejl eller andre uventede problemer. Hvis der opstår en exception, fanges den i catch-blokken, hvor jeg logger fejlen og returnerer Ok() for at sikre at Stripe ikke forsøger at sende webhook-anmodningen igen.
                {
                    var customer = await _db.Customers.FirstOrDefaultAsync(c => c.Email == email); //jeg erklærer en variabel customer, som forsøger at hente en eksistende kunde fra databasen. Jeg bruger _db.Customers.FirstOrDefaultAsync(c => c.Email == email) for at søge i Customers tabellen efter en kunde hvis email matcher den email jeg hentede fra checkout-sessionen. Hvis en sådan kunde findes, returneres den, ellers returneres null. Dette giver mig mulighed for at genbruge eksisterende kunder i databasen, hvis de har købt før, i stedet for at oprette en ny kunde hver gang.

                    if (customer == null) //hvis ingen customer findes, så opretter jeg en ny kunde i databasen
                    {
                        customer = new Customer //jeg opretter en ny instans af customer-klassen, som repræsenterer en kunde i databasen og sætter dens egenskaber
                        {
                            Email = email, //jeg initialiserer Email egenskaben med den email jeg hentede fra checkout-sessionen
                            StripeCustomerId = session?.CustomerId ?? "", //jeg initialiserer StripeCustomerId egenskaben med det Stripe Customer ID jeg hentede fra checkout-sessionen. Dette ID er unikt for hver kunde i Stripe, og det kan være nyttigt at gemme det i databasen for at kunne knytte kunder i min database til deres tilsvarende poster i Stripe, hvilket kan hjælpe med fremtidige opdateringer eller support
                            PasswordHash = "", //jeg initialiserer passwordHash med en tom string fordi kunder der oprettes via stripe checkout ikke har et password
                            CustomerType = "private", //jeg initialiserer CustomerType med "private" som standard, da de fleste kunder sandsynligvis vil være private personer. Dette felt kan senere bruges til at differentiere mellem forskellige typer af kunder (f.eks. private, virksomheder) hvis det bliver relevant for forretningslogikken
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };
                        _db.Customers.Add(customer);
                        await _db.SaveChangesAsync(); // await da det er en asynkron operation der gemmer den nye kunde i databasen. Det er vigtigt at gemme kunden før jeg opretter abonnementet eller ordren, fordi jeg har brug for kundens ID for at kunne knytte abonnementet eller ordren til kunden i databasen
                        Console.WriteLine($"✅ Customer created: {customer.Id}");
                    }
                    else
                    {
                        Console.WriteLine($"✅ Customer found: {customer.Id}"); //hvis kunden allerede findes i databasen, logger jeg det for at bekræfte at jeg genbruger eksisterende kunder korrekt, og for at hjælpe med fejlfinding og overvågning. Det viser mig i loggene, hvilke kunder der allerede findes, og hvilke der er nye, hvilket kan være nyttigt for at sikre at webhook-håndteringen fungerer som forventet og for at identificere eventuelle problemer med kundeoprettelsen eller genbrug.
                    }

                    // Hvis checkouten var et abonnement:
                    if (mode == "subscription")
                    {
                        var subscription = new treesy_backend.Models.Subscription //jeg erklærer en variabel subscription. Jeg instantiere en ny Subscription klasse som repræsentere et abonnemt i databasen. Jeg sætter dens egenskaber baseret på dataene fra checkout-sessionen og de variabler jeg tidligere har erklæret. Id er en ny Guid, CustomerId er kundens ID fra databasen, StripeSubscriptionId er det abonnement ID jeg hentede fra checkout-sessionen, PlanId er det planId jeg hentede fra sessionens metadata, Billing er faktureringscyklus (monthly eller yearly) hentet fra sessionens metadata, CurrentPeriodEnd sættes til en måned frem i tiden (dette kan senere opdateres baseret på Stripe's webhook events for at reflektere den faktiske periode), Status sættes til "active" fordi abonnementet lige er blevet oprettet, og CreatedAt sættes til det aktuelle tidspunkt i UTC.
                        {
                            Id = Guid.NewGuid(), //Jeg initialiserer objektets Id-property ved at tildele den en ny GUID genereret af Guid.NewGuid(). Dette sikrer, at objektet får en unik identifikator, som kan bruges til entydigt at identificere abonnementet i databasen
                            CustomerId = customer.Id, //Jeg initialiserer objektet CustomerId-property ved at tildelde den Id'et fra den kunde, som jeg enten har hentet fra databasen eller oprettet tidligere i koden. Dette skaber en relation mellem abonnementet og kunden i databasen, så jeg kan spore hvilket abonnement der tilhører hvilken kunde
                            StripeSubscriptionId = session!.SubscriptionId ?? "", // Jeg initialiserer objektets StripeSubscriptionId-property ved at tildele den SubscriptionId'et fra checkout-sessionen. Dette ID er unikt for abonnementet i Stripe, og det kan være nyttigt at gemme det i databasen for at kunne knytte abonnementet i min database til det tilsvarende abonnement i Stripe, hvilket kan hjælpe med fremtidige opdateringer eller support. Jeg bruger null-coalescing operator (??) for at sikre, at hvis SubscriptionId er null, så sættes StripeSubscriptionId til en tom string "" i stedet for at kaste en exception.
                            PlanId = planId, //jeg initialistere objektets planId-property med det planId jeg hentede fra sessions metadata. Dette fortæller mig hvilket abonnement eller produkt kunden har købt, og jeg bruger det senere i koden for at opdatere databasen korrekt og sende relevante oplysninger i emailen til kunden.
                            Billing = billing ?? "monthly", //jeg initialisere objektets Billingproperty med faktureringscyklus hentet fra sessions metadata. Jeg bruger monthly som default værdi hvis billing er null, da det er den mest almindelige faktureringscyklus for abonnementer. Dette felt kan senere bruges til at differentiere mellem forskellige typer af abonnementer og for at håndtere fakturering og fornyelser korrekt baseret på cyklussen.
                            CurrentPeriodEnd = DateTime.UtcNow.AddMonths(1), //jeg initialiserer objektets CurrentPeriodEnd-property til en måned frem i tiden fra det aktuelle tidspunkt i UTC. Dette er en forenklet antagelse om, at abonnementsperioden varer en måned, og det kan senere opdateres baseret på Stripe's webhook events (f.eks. invoice.payment_succeeded) for at reflektere den faktiske periode baseret på Stripe's faktureringslogik og eventuelle ændringer i abonnementet.
                            Status = "active", //jeg initialiserer objektets Status property til "active", fordi abonnementet lige er blevet oprettet og er aktivit
                            CreatedAt = DateTime.UtcNow
                        };
                        _db.Subscriptions.Add(subscription); //Tilføj det nye abonnemt til subscription tabellen i databasen
                        customer.TotalTreesPlanted += treeCount; //Jeg opdaterer kundens TotalTreesPlanted property ved at lægge det antal træer, der er knyttet til det købte abonnement eller produkt (treeCount), til den eksisterende værdi. Dette holder styr på det samlede antal træer, som kunden har plantet gennem deres abonnementer og køb, og det kan bruges til at vise denne information i kundens profil eller dashboard, samt for at spore kundens samlede bidrag til træplantning gennem tjenesten.

                        // 🌳 Opret individuelle træer
                        for (int i = 0; i < treeCount; i++) // for each loop som kører treecount gange, hvor treeCount er det antal træer der er knyttet til det købte abonnemt eller produkt
                        {
                            var tree = new Tree //jeg erklærer en variabel tree, som instantierer en ny tree klasse som repræsenterer et træ i databasen. Jeg sætter dens egenskaber nedenunder
                            {
                                CustomerId = customer.Id, //Jeg initialiserer objektets CustomerId-Property med kundends ID fra databasen, hvilket skaber en relation mellem træer og kunden i databasen, så jeg kan spore hvilke træer der tilhører hvilken kunde
                                Latitude = -6.79 + random.NextDouble() * 0.1, //jeg initialiserer objektet latitude property med en tilfældig værdi inden for et bestemt område. Jeg starter med en baseværdi på -6.79 og tilføjer en tilfældig værdi mellem 0 og 0.1 genereret af random.NextDouble(). Dette giver mig en latitude-værdi, der ligger et sted mellem -6.79 og -6.69, hvilket kan repræsentere et geografisk område, hvor træerne plantes.
                                Longitude = 39.20 + random.NextDouble() * 0.1, //jeg initialiserer onjektet longitude property med en tilfældig værdi inden for et bestemt område. Jeg starter med en baseværdi på 39.20 og tilføjer en tilfældig værdi mellem 0 og 0.1 genereret af random.NextDouble(). Dette giver mig en longitude-værdi, der ligger et sted mellem 39.20 og 39.30, hvilket kan repræsentere et geografisk område, hvor træerne plantes.
                                PlantedAt = DateTime.UtcNow // jeg initialiserer objektets PlantedAt property med det aktuelle tidspunkt i UTC, hvilket registrerer hvornår træet blev "plantet" i systemet. Dette kan bruges til at spore træernes alder og for at vise denne information i kundens profil eller dashboard.
                            };

                            _db.Trees.Add(tree); // tilføjer træet til Trees tabellen i databsen
                        }
                        Console.WriteLine($"✅ Subscription added: {subscription.PlanId}"); //besked vises til brugeren om at abonnemtet er tilføjet, og viser hvilket planId der er knyttet til det købte abonnement eller produkt. Dette hjælper med at bekræfte i loggene, at abonnementet er blevet oprettet korrekt i databasen, og giver mig mulighed for at se hvilke abonnementer der bliver købt baseret på planId'et.
                    }
                    else if (mode == "payment") //hvis checkout-session var et engangskøb (mode er payment).
                    {
                        var order = new Order //Jeg erklærer en varabel order, som indeholder en instants af Order-klassen som repræsenterer en order i databasen
                        {
                            Id = Guid.NewGuid(), //jeg initialiserer objektets Id-property ved at tildele den en ny GUID genereret af Guid.NewGuid().
                            CustomerId = customer.Id, //Jeg initialistere objektets CustomerId-property med det ID fra den kunde, som jeg enten har hentet fra databasen eller oprettet tidligere i koden. 
                            StripeSessionId = session!.Id,//jeg initialiserer objektets StripeSessionId-property med det Session ID jeg hentede fra checkout-sessionen. Dette ID er unikt for sessionen i Stripe, og det kan være nyttigt at gemme det i databasen for at kunne knytte ordren i min database til den tilsvarende session i Stripe, hvilket kan hjælpe med fremtidige opdateringer eller support. Jeg bruger null-forsegling operator (!) for at fortælle compileren at session ikke er null på dette tidspunkt, da jeg allerede har tjekket det tidligere i koden.
                            PlanId = planId, //jeg initialiserer objektets planId med planId jeg hentede fra sessions metadata. Dette fortæller mig hvilket abonnemt eller produkt kunden har købt
                            Trees = PlanHelper.GetTreesForPlan(planId), //Jeg initialiserer objektets Trees property med det antal træer der er knyttet til det købte abonnement eller produkt, som jeg får ved at kalde PlanHelper.GetTreesForPlan(planId). Dette holder styr på hvor mange træer der er knyttet til denne ordre, og det kan bruges til at vise denne information i kundens profil eller dashboard, samt for at spore det samlede antal træer plantet gennem engangskøb.
                            AmountDkk = (session.AmountTotal ?? 0) / 100m, //AmountDkk initialiseres med det totale beløb for sessionen, som jeg henter fra session.AmountTotal. Dette beløb er i øre, så jeg dividerer det med 100m for at konvertere det til kroner. Jeg bruger null-coalescing operator (??) for at sikre, at hvis AmountTotal er null, så sættes AmountDkk til 0 i stedet for at kaste en exception.
                            Status = "paid",
                            CreatedAt = DateTime.UtcNow
                        };
                        _db.Orders.Add(order);
                        customer.TotalTreesPlanted += treeCount;

                        // 🌳 Opret individuelle træer
                        for (int i = 0; i < treeCount; i++)
                        {
                            var tree = new Tree
                            {
                                CustomerId = customer.Id,
                                Latitude = -6.79 + random.NextDouble() * 0.1,
                                Longitude = 39.20 + random.NextDouble() * 0.1,
                                PlantedAt = DateTime.UtcNow
                            };

                            _db.Trees.Add(tree);
                        }
                        Console.WriteLine($"✅ Order added: {order.PlanId}, Amount: {order.AmountDkk}");
                    }

                    customer.UpdatedAt = DateTime.UtcNow; //jeg initialiserer kundens UpdateAt property med det aktuelle tidspunkt i UTC for at registrere hvornår kunden sidst blev opdateret i databasen
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

       
    }
}