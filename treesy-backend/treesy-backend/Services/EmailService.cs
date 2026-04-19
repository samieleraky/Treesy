using SendGrid;
using SendGrid.Helpers.Mail;

namespace treesy_backend.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        // ── Velkomstmail ved kontooprettelse ──────────────────────────────────
        public async Task SendWelcomeEmailAsync(string toEmail, string name)
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


            await SendAsync(toEmail, name, "Velkommen til Treesy 🌱", html);
        }

        // ── Ordrebekræftelse ved betaling ────────────────────────────────────
        public async Task SendOrderConfirmationAsync(
            string toEmail,
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
            var periodEndText = periodEnd.ToString("d. MMMM yyyy");

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
            Console.WriteLine("Email method called");
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