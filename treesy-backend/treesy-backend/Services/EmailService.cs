using SendGrid;
using SendGrid.Helpers.Mail; //Jeg importerer SendGrid og SendGrid.Helpers.Mail namespaces, som indeholder klasser og metoder til at oprette og sende emails ved hjælp af SendGrid's API. Disse namespaces giver mig adgang til klasser som SendGridClient, EmailAddress, MailHelper osv., som jeg bruger i min EmailService til at konstruere og sende emails.

namespace treesy_backend.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config; //Jeg erklærer en privat readonly variabel _config af typen IConfiguration, som bruges til at hente konfigurationsindstillinger (f.eks. SendGrid API-nøgle, afsender-email osv.) fra appsettings.json eller miljøvariabler. Dette gør det nemt at administrere og sikre følsomme oplysninger som API-nøgler uden at hardkode dem i koden.

        public EmailService(IConfiguration config) //Constructor for EmailService som tager en parameter af typen IConfiguration, som injiceres via dependency injection. 
        {
            _config = config; // Jeg initialiserer _config variablen med den injicerede konfiguration, så jeg kan bruge den i mine metoder til at hente de nødvendige indstillinger for at sende emails.
        }

        // ── Velkomstmail ved kontooprettelse ──────────────────────────────────
        public async Task SendWelcomeEmailAsync(string toEmail, string name) //Asynkron metode hvilket betyder at den kan udføre operationer, der tager tid (feks. API kald) uden at blokere hovedtråden. Den tager to parementere - toEmail som er modtagerens email adresse, og name som er modtagerens navn. Disse bruges til at personliggøre emailen og for at sende den til den rigtige modtager
        {
            var html = $@"               
 <div style='font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;
             max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;
             overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)'>

     <div style='background:linear-gradient(135deg,#065f46,#10b981);
                 padding:40px 32px;text-align:center'>
         <h1 style='color:white;margin:0;font-size:28px'>
             Velkommen til Treesy 🌱
         </h1>
     </div>

     <div style='padding:32px'>
         <p style='font-size:16px;color:#374151;line-height:1.6'>
             Hej {name},
         </p>
         <p style='font-size:16px;color:#374151;line-height:1.6'>
             Tak fordi du er blevet en del af Treesy. Din konto er nu oprettet 
             og klar til brug.
         </p>
         <p style='font-size:16px;color:#374151;line-height:1.6'>
             Dine træer plantes i to omgange om året — omkring regnsæsonerne 
             i Tanzania.
         </p>

         <div style='text-align:center;margin:32px 0'>
             <a href='https://treesy-sami.vercel.app/dashboard'
                style='background:linear-gradient(135deg,#10b981,#065f46);
                       color:white;padding:14px 32px;border-radius:50px;
                       text-decoration:none;font-weight:700;font-size:15px;
                       display:inline-block'>
                 Se dit dashboard →
             </a>
         </div>

         <p style='font-size:13px;color:#9ca3af;text-align:center;
                    margin-top:32px;border-top:1px solid #f3f4f6;padding-top:20px'>
             Treesy · Bæredygtighed der virker
         </p>
     </div>
 </div>";


            await SendAsync(toEmail, name, "Velkommen til Treesy 🌱", html); //SendAsync metode som tager modtagerens email, navn, html som indeholder indholdet ovenover. Asynkron  
        }

        // ── Ordrebekræftelse ved betaling ────────────────────────────────────
        public async Task SendOrderConfirmationAsync( //Task er en asynkron metode som ikke returnerer noget (void) og som udføre operationer som tager tid såsom API kald
            string toEmail, //jeg tager flere parametre som input for at kunne personliggøre og specificere indholdet i ordrebekræftelsesmailen. toEmail er modtagerens email adresse, som bruges til at sende mailen til den rigtige person
            string name,
            string planName,
            string billing,
            decimal amount,
            int trees,
            DateTime periodEnd)
        {
            var billingText = billing == "yearly" ? "Årlig" : "Månedlig";
            var periodEndText = periodEnd.ToString("d. MMMM yyyy");

            var html = $@"
            <div style='font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;
                        max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;
                        overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)'>

                <div style='background:linear-gradient(135deg,#065f46,#10b981);
                            padding:40px 32px;text-align:center'>
                    <h1 style='color:white;margin:0;font-size:28px'>
                        Betaling bekræftet 🌳
                    </h1>
                </div>

                <div style='padding:32px'>
                    <p style='font-size:16px;color:#374151;line-height:1.6'>
                        Hej {name},
                    </p>
                    <p style='font-size:16px;color:#374151;line-height:1.6'>
                        Vi har modtaget din betaling. Her er en oversigt over din ordre:
                    </p>

                    <table style='width:100%;border-collapse:collapse;margin:24px 0;
                                  border-radius:12px;overflow:hidden'>
                        <tr style='background:#f0fdf4'>
                            <td style='padding:14px 16px;font-size:14px;color:#6b7280;
                                       font-weight:600'>PAKKE</td>
                            <td style='padding:14px 16px;font-size:15px;color:#065f46;
                                       font-weight:700'>{planName}</td>
                        </tr>
                        <tr style='background:#ffffff'>
                            <td style='padding:14px 16px;font-size:14px;color:#6b7280;
                                       font-weight:600'>ABONNEMENT</td>
                            <td style='padding:14px 16px;font-size:15px;color:#111827;
                                       font-weight:600'>{billingText}</td>
                        </tr>
                        <tr style='background:#f0fdf4'>
                            <td style='padding:14px 16px;font-size:14px;color:#6b7280;
                                       font-weight:600'>BELØB</td>
                            <td style='padding:14px 16px;font-size:15px;color:#111827;
                                       font-weight:700'>{amount:N0} kr</td>
                        </tr>
                        <tr style='background:#ffffff'>
                            <td style='padding:14px 16px;font-size:14px;color:#6b7280;
                                       font-weight:600'>TRÆER / ÅR</td>
                            <td style='padding:14px 16px;font-size:15px;color:#111827;
                                       font-weight:600'>{trees:N0} træer</td>
                        </tr>
                        <tr style='background:#f0fdf4'>
                            <td style='padding:14px 16px;font-size:14px;color:#6b7280;
                                       font-weight:600'>NÆSTE BETALING</td>
                            <td style='padding:14px 16px;font-size:15px;color:#111827;
                                       font-weight:600'>{periodEndText}</td>
                        </tr>
                    </table>

                    <div style='text-align:center;margin:32px 0'>
                        <a href='https://treesy-sami.vercel.app/dashboard'
                           style='background:linear-gradient(135deg,#10b981,#065f46);
                                  color:white;padding:14px 32px;border-radius:50px;
                                  text-decoration:none;font-weight:700;font-size:15px;
                                  display:inline-block'>
                            Se dit dashboard →
                        </a>
                    </div>

                    <p style='font-size:13px;color:#9ca3af;text-align:center;
                               margin-top:32px;border-top:1px solid #f3f4f6;padding-top:20px'>
                        Treesy · Bæredygtighed der virker
                    </p>
                </div>
            </div>";

            await SendAsync(toEmail, name, $"Din ordre er bekræftet — {planName} 🌳", html);
        }

        // ── Annulleringsbekræftelse ───────────────────────────────────────────
        public async Task SendCancellationEmailAsync(
            string toEmail,
            string name,
            string planName,
            DateTime periodEnd)
        {
            var periodEndText = periodEnd.ToString("d. MMMM yyyy"); // jeg erklærer en variabel periodEndText som indeholder en formateret version af periodEnd daton. ToString konverterer DateTime objektet til en string, og "d. MMMM yyyy" formatet betyder at det vil blive vist som dag (d), fuldt månedsnavn (MMMM) og år (yyyy). For eksempel, hvis periodEnd er 15. august 2024, så vil periodEndText være "15. august 2024". Dette gør det nemt at inkludere en læsbar dato i annulleringsmailen, så kunden ved præcis hvornår deres adgang til tjenesten udløber efter annulleringen.

            var html = $@"
            <div style='font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;
                        max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;
                        overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)'>

                <div style='background:#374151;padding:40px 32px;text-align:center'>
                    <h1 style='color:white;margin:0;font-size:28px'>
                        Abonnement annulleret
                    </h1>
                </div>

                <div style='padding:32px'>
                    <p style='font-size:16px;color:#374151;line-height:1.6'>
                        Hej {name},
                    </p>
                    <p style='font-size:16px;color:#374151;line-height:1.6'>
                        Dit abonnement på <strong>{planName}</strong> er nu annulleret.
                    </p>

                    <div style='background:#f0fdf4;border:1px solid #86efac;border-radius:12px;
                                padding:20px;margin:24px 0'>
                        <p style='margin:0;font-size:15px;color:#065f46;font-weight:600'>
                            🌿 Du beholder adgang til din pakke frem til:<br>
                            <span style='font-size:18px'>{periodEndText}</span>
                        </p>
                    </div>

                    <p style='font-size:16px;color:#374151;line-height:1.6'>
                        Fortryder du? Du kan altid tilkøbe dig en af vores abonnementpakker, eller en af vores enkelte pakker gennem vores hjemmeside.
                    </p>

                    <div style='text-align:center;margin:32px 0'>
                        <a href='https://treesy-sami.vercel.app'
                           style='background:linear-gradient(135deg,#10b981,#065f46);
                                  color:white;padding:14px 32px;border-radius:50px;
                                  text-decoration:none;font-weight:700;font-size:15px;
                                  display:inline-block'>
                            Gå til Treesy →
                        </a>
                    </div>

                    <p style='font-size:13px;color:#9ca3af;text-align:center;
                               margin-top:32px;border-top:1px solid #f3f4f6;padding-top:20px'>
                        Treesy · Bæredygtighed der virker
                    </p>
                </div>
            </div>";

            await SendAsync(toEmail, name, "Dit Treesy abonnement er annulleret", html);
        }

        // ── Privat hjælpemetode ──────────────────────────────────────────────
        private async Task SendAsync(

            string toEmail,
            string toName,
            string subject,
            string htmlContent)
        {

            //Debug
            Console.WriteLine("Email method called"); //Jeg har tilføjet flere Console.WriteLine statements for at logge vigtige oplysninger, når SendAsync metoden kaldes. Dette inkluderer modtagerens email, navn, emne for emailen, og de vigtigste SendGrid konfigurationsindstillinger (API-nøgle, afsender-email). Disse logs vil hjælpe mig med at debugge og sikre, at metoden modtager de korrekte input og at konfigurationen er korrekt, når jeg tester email-funktionaliteten.
            Console.WriteLine("API key: " + _config["SendGrid:APIKey"]);
            Console.WriteLine("From email: " + _config["SendGrid:FromEmail"]);
            Console.WriteLine("To Email: " + toEmail);

            var apiKey = _config["SendGrid:ApiKey"];
            var fromEmail = _config["SendGrid:FromEmail"];
            var fromName = _config["SendGrid:FromName"];

            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(fromEmail, fromName);
            var to = new EmailAddress(toEmail, toName);

            var msg = MailHelper.CreateSingleEmail(
                from, to, subject,
                plainTextContent: subject, // Fallback til plain text
                htmlContent: htmlContent
            );

            var response = await client.SendEmailAsync(msg);

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Body.ReadAsStringAsync();
                Console.WriteLine($"❌ SendGrid fejl: {response.StatusCode} — {body}");
            }
            else
            {
                Console.WriteLine($"✅ Email sendt til {toEmail}: {subject}");
            }
        }
    }
}