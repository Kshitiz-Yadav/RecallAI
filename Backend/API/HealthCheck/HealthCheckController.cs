using API.Data;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using static API.ApiResponseResolver;

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
        return ProcessApiResponse(HttpStatusCode.OK, "Ready to amplify, Recall AI!");
    }
}
