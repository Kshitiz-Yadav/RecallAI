using API.Data;
using API.Data.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.HealthCheck;

[ApiController]
[Route("api/[controller]")]
public class HealthCheckController : Controller
{
    private readonly DatabaseContext _databaseContext;
    private readonly ILogger<HealthCheckController> _logger;

    public HealthCheckController(DatabaseContext databaseContext, ILogger<HealthCheckController> logger)
    {
        _databaseContext = databaseContext;
        _logger = logger;
    }

    [HttpGet("health")]
    public IActionResult HealthCheck()
    {
        _logger.LogInformation("Health check triggered");
        return new OkObjectResult("All is well!");
    }
}
