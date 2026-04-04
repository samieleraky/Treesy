using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using treesy_backend.Data;
using treesy_backend.Models;

namespace Treesy.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly TreesyDbContext _db;
        private readonly IConfiguration _config;

        public AuthController(TreesyDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        // POST /api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Tjek om email allerede er i brug
            var exists = await _db.Customers.AnyAsync(c => c.Email == request.Email);
            if (exists)
                return BadRequest(new { message = "Email er allerede i brug" });

            var customer = new Customer
            {
                Email = request.Email.Trim().ToLower(),
                Name = request.Name,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            _db.Customers.Add(customer);
            await _db.SaveChangesAsync();

            var token = GenerateToken(customer);
            return Ok(new { token, email = customer.Email, name = customer.Name });
        }

        // POST /api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var customer = await _db.Customers
                .FirstOrDefaultAsync(c => c.Email == request.Email.Trim().ToLower());

            if (customer == null || customer.PasswordHash == null)
                return Unauthorized(new { message = "Forkert email eller kodeord" });

            var passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, customer.PasswordHash);
            if (!passwordValid)
                return Unauthorized(new { message = "Forkert email eller kodeord" });

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
}