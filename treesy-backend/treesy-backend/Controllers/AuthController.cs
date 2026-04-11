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
    public class AuthController : ControllerBase
    {
        private readonly TreesyDbContext _db;
        private readonly IConfiguration _config;
        private readonly EmailService _email;
        

        public AuthController(TreesyDbContext db, IConfiguration config, EmailService email)
        {
            _db = db;
            _config = config;
            _email = email; 
        }

        // POST /api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var emailLower = request.Email.Trim().ToLower();

            var existing = await _db.Customers
                .FirstOrDefaultAsync(c => c.Email == emailLower);

            // Kunden eksisterer allerede (oprettet af webhook) — sæt bare password
            if (existing != null && string.IsNullOrEmpty(existing.PasswordHash))
            {
                existing.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
                existing.Name = request.Name ?? existing.Name;
                existing.UpdatedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync();

                _ = _email.SendWelcomeEmailAsync(existing.Email, existing.Name ?? existing.Email);

                var t = GenerateToken(existing);
                return Ok(new { token = t, email = existing.Email, name = existing.Name });
            }

            if (existing != null)
                return BadRequest(new { message = "Email er allerede i brug" });

            var customer = new Customer
            {
                Email = emailLower,
                Name = request.Name,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            _db.Customers.Add(customer);
            await _db.SaveChangesAsync();

            // Send velkomstmail (kan ske asynkront uden await, da vi ikke behøver at vente på det)
            _ = _email.SendWelcomeEmailAsync(customer.Email, customer.Name ?? customer.Email);

            var token = GenerateToken(customer);
            return Ok(new { token, email = customer.Email, name = customer.Name });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var customer = await _db.Customers
                .FirstOrDefaultAsync(c => c.Email == request.Email.Trim().ToLower());

            if (customer == null)
                return Unauthorized(new { message = "Forkert email eller kodeord" });

            // Kunden eksisterer men har intet kodeord (oprettet via Stripe webhook)
            if (string.IsNullOrEmpty(customer.PasswordHash))
                return Unauthorized(new { message = "no_password" }); // ← speciel kode

            bool passwordValid;
            try
            {
                passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, customer.PasswordHash);
            }
            catch
            {
                return Unauthorized(new { message = "Forkert email eller kodeord" });
            }

            if (!passwordValid)
                return Unauthorized(new { message = "Forkert email eller kodeord" });

            var token = GenerateToken(customer);
            return Ok(new { token, email = customer.Email, name = customer.Name });
        }


        [HttpPost("set-password")]
        public async Task<IActionResult> SetPassword([FromBody] SetPasswordRequest request)
        {
            var customer = await _db.Customers
                .FirstOrDefaultAsync(c => c.Email == request.Email.Trim().ToLower());

            if (customer == null)
                return NotFound(new { message = "Ingen konto med den email" });

            if (!string.IsNullOrEmpty(customer.PasswordHash))
                return BadRequest(new { message = "Konto har allerede et kodeord — brug login" });

            customer.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            customer.Name = request.Name ?? customer.Name;
            customer.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            _ = _email.SendWelcomeEmailAsync(customer.Email, customer.Name ?? customer.Email);

            var token = GenerateToken(customer);
            return Ok(new { token, email = customer.Email, name = customer.Name });
        }

       



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