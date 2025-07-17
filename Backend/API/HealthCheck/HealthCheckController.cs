using API.Data;
using API.Data.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.HealthCheck;

[Authorize]
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

    [HttpGet("dbhealth")]
    public async Task<IActionResult> DatabaseHealthCheck()
    {
        _logger.LogInformation("Database health check triggered");
        await _databaseContext.Users.AddAsync(new User
        {
            Email = "abc",
            PasswordHash = "pass"
        });
        await _databaseContext.SaveChangesAsync();
        var entry = _databaseContext.Users.FirstOrDefault(e => e.Email == "abc");
        if (entry != null)
        {
            return Ok("The DB connection is all good!");
        }

        return BadRequest();
    }
}
