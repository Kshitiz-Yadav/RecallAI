using Microsoft.AspNetCore.Mvc;

namespace Backend.HealthCheck;

[ApiController]
[Route("api/[controller]")]
public class HealthCheckController : Controller
{
    [HttpGet("health")]
    public IActionResult HealthCheck()
    {
        return new OkObjectResult("All is well!");
    }
}
