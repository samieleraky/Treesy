using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using treesy_backend.Data;
using treesy_backend.Models;
using treesy_backend.Services;


namespace Treesy.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase  //basis klasse for API controllers, som giver adgang til ting som ModelState og BadRequest()
    {
        private readonly TreesyDbContext _db; //dependency injection af database context, som vi bruger til at tilgå databasen
        private readonly IConfiguration _config; //bruges til at hente JWT secret key og issuer/audience info fra appsettings.json
        private readonly EmailService _email;

        // constructor, som modtager dependencies via dependency injection. ASP.NET Core vil automatisk oprette en instans af TreesyDbContext, IConfiguration og EmailService og sende dem ind i konstruktøren, når den opretter AuthController.
        public AuthController(TreesyDbContext db, IConfiguration config, EmailService email)
        {
            _db = db;
            _config = config;
            _email = email; 
        }

        // POST /api/auth/register kan kaldes med denne endpoint for at oprette en ny bruger
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request) //Frombody bruges af ASP.NET core til automatisk at binde JSON-data fra request body til RegisterRequest objektet, så vi nemt kan arbejde med det i koden
        {
            var emailLower = request.Email.Trim().ToLower(); // Jeg gemmer request.Email i en lokal variabel emailLower, hvor jeg både trim'er og lowercaser den. Det gør jeg for at sikre, at emailen bliver gemt i en standardiseret form i databasen, så vi undgår problemer med store/små bogstaver eller utilsigtede mellemrum, når vi senere skal tjekke om en email allerede findes eller når brugeren logger ind.

            var existing = await _db.Customers // først tjekker jeg om der allerede findes en kunde med den email i databasen. Det gør jeg ved at bruge Entity Frameworks LINQ-metode FirstOrDefaultAsync, som returnerer den første kunde der matcher betingelsen (c.Email == emailLower) eller null hvis ingen kunder matcher. Jeg bruger emailLower her for at sikre, at tjekket er case-insensitive og ignorerer mellemrum.
                .FirstOrDefaultAsync(c => c.Email == emailLower); //c => c.Email == emailLower er en linq query som EF core oversætter til en SQL query der tjekker om der findes en række i Customers tabellen hvor Email kolonnen matcher emailLower variablen

            // Kunden eksisterer allerede (oprettet af webhook) — sæt bare password
            if (existing != null && string.IsNullOrEmpty(existing.PasswordHash))
            {
                existing.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password); // password bliver ikke gemt direkte, det bliver hashed med BCrypt
                existing.Name = request.Name ?? existing.Name; // Brug request.Name hvis den findes, ellers behold eksisterende navn
                existing.UpdatedAt = DateTime.UtcNow; // opdateringstidspunkt sættes til nu
                await _db.SaveChangesAsync(); // gem ændringerne i databasen. EF core sender ændringer til databaseb

                _ = _email.SendWelcomeEmailAsync(existing.Email, existing.Name ?? existing.Email); //constructor som tager email og name, og sender en velkomstmail til den email. Det sker asynkront uden await, fordi vi ikke behøver at vente på at mailen bliver sendt før vi kan returnere response til klienten.

                var t = GenerateToken(existing); // generer JWT token for den eksisterende kunde, som nu har fået sat et password. Frontend kan gemme tokenet
                return Ok(new { token = t, email = existing.Email, name = existing.Name }); //Returnerer en 200 OK response med en JSON body der indeholder token, email og name på den kunde der lige er blevet opdateret
            }

            if (existing != null) //hvis email allerede eksisterer returnes følgende besked
                return BadRequest(new { message = "Email er allerede i brug" });

            // Hvis email ikke eksisterer, opretter vi en ny customer med den email, det name og det password der blev sendt i requestet. Password bliver hashed med BCrypt 
            var customer = new Customer
            {
                Email = emailLower,
                Name = request.Name,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            _db.Customers.Add(customer); //customer tilføjes til Customers tabellen i databasen
            await _db.SaveChangesAsync();

            // Send velkomstmail (kan ske asynkront uden await, da vi ikke behøver at vente på det)
            _ = _email.SendWelcomeEmailAsync(customer.Email, customer.Name ?? customer.Email);

            var token = GenerateToken(customer); // generer JWT token for den nye kunde, som frontend kan gemme
            return Ok(new { token, email = customer.Email, name = customer.Name }); //Returnerer en 200 OK response med en JSON body der indeholder token, email og name på den kunde der lige er blevet oprettet
        }


        [HttpPost("login")] //end til login af bruger
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var customer = await _db.Customers // først finder vi kunden i databasen baseret på den email der blev sendt i login requestet. Vi trim'er og lowercaser emailen for at sikre at tjekket er case-insensitive og ignorerer mellemrum
                .FirstOrDefaultAsync(c => c.Email == request.Email.Trim().ToLower());

            if (customer == null) //hvis kunden ikke findes returneres følgende besked
                return Unauthorized(new { message = "Forkert email eller kodeord" });

            // Kunden eksisterer men har intet kodeord (oprettet via Stripe webhook)
            if (string.IsNullOrEmpty(customer.PasswordHash))
                return Unauthorized(new { message = "no_password" }); // ← speciel kode til frontend som indikerer at brugeren skal sætte et password før de kan logge ind

            bool passwordValid; //verificering af password
            try 
            {
                passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, customer.PasswordHash);
            }
            catch
            {
                return Unauthorized(new { message = "Forkert email eller kodeord" });
            }

            if (!passwordValid) //hvis password ikke matcher å returneres følgende besked
                return Unauthorized(new { message = "Forkert email eller kodeord" });

            var token = GenerateToken(customer); // hvis login er succesfuldt genereres et JWT token for kunden, som frontend kan gemme og bruge til at autentificere fremtidige API kald
            return Ok(new { token, email = customer.Email, name = customer.Name });
        }


        [HttpPost("set-password")] //Denne endpoint kan bruges af brugere der er oprettet via Stripe webhook (som ikke har et password) til at sætte et password og dermed få adgang til at logge ind via email/password i stedet for kun via Stripe login. 
        public async Task<IActionResult> SetPassword([FromBody] SetPasswordRequest request) //Den tager SetPasswordRequest som objekt der indeholder email, password og name (name er valgfrit og kan bruges til at sætte et navn for kunder der er oprettet via webhook og derfor ikke har et navn)
        {
            var customer = await _db.Customers //find customer i databasen baseret på emailen i requestet. Vi trim'er og lowercaser emailen for at sikre at tjekket er case-insensitive og ignorerer mellemrum
                .FirstOrDefaultAsync(c => c.Email == request.Email.Trim().ToLower());

            if (customer == null) //hvis ingen kunde findes returneres følgende besked
                return NotFound(new { message = "Ingen konto med den email" });

            if (!string.IsNullOrEmpty(customer.PasswordHash)) //hvis kunden allerede har et password (altså ikke er oprettet via webhook eller allerede har sat et password) returneres følgende besked, da denne endpoint kun er til kunder der ikke har et password endnu
                return BadRequest(new { message = "Konto har allerede et kodeord — brug login" });

            customer.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password); //sæt password ved at hashe det med BCrypt og gemme det i PasswordHash kolonnen
            customer.Name = request.Name ?? customer.Name; //sæt navn hvis det blev sendt i requestet, ellers behold eksisterende navn (som kan være null)
            customer.UpdatedAt = DateTime.UtcNow; //sæt opdateringstidspunkt til nu
            await _db.SaveChangesAsync(); //gem ændringer til databasen

            _ = _email.SendWelcomeEmailAsync(customer.Email, customer.Name ?? customer.Email); //emaail sendes til kunde 

            var token = GenerateToken(customer); //token genereres gemmes i frontend så kunden kan logge ind med det nye password fremover
            return Ok(new { token, email = customer.Email, name = customer.Name }); //Returnerer en 200 OK response med en JSON body der indeholder token, email og name på den kunde der lige har sat sit password
        }




        //metode som tager customer som parameter og genererer et JWT token baseret på kundens id, email og name. Tokenet signeres med en secret key fra appsettings.json og har en udløbstid på 30 dage. Frontend kan gemme dette token og sende det i Authorization headeren for at få adgang til beskyttede endpoints.
        private string GenerateToken(Customer customer)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
            );
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, customer.Id.ToString()),
                new Claim(ClaimTypes.Email, customer.Email),
                new Claim("name", customer.Name ?? "")
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(30),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class RegisterRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string? Name { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class SetPasswordRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string? Name { get; set; }
    }


}