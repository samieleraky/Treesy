using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    [HttpPost]
    public IActionResult CreateOrder([FromBody] OrderRequest request)
    {
        return Ok(new
        {
            success = true,
            planId = request.PlanId
        });
    }
}

public class OrderRequest
{
    public string PlanId { get; set; }
}
