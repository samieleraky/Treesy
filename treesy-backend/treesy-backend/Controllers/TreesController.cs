using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Stripe;
using treesy_backend.Data;
using treesy_backend.Services;


namespace Treesy.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TreesController : ControllerBase
    {
        private readonly TreesyDbContext _db;

        public TreesController(TreesyDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetTrees()
        {
            var customerIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(customerIdStr, out var customerId))
                return Unauthorized();

            var trees = await _db.Trees
                .Where(t => t.CustomerId == customerId)
                .Select(t => new
                {
                    lat = t.Latitude,
                    lng = t.Longitude
                })
                .ToListAsync();

            return Ok(trees);
        }
    }
}