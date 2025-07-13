using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography.X509Certificates;

namespace Backend.HealthCheck;

[ApiController]
[Route("api/[controller]")]
public class HealthCheckController : Controller
{
    private readonly DatabaseContext _databaseContext;

    public HealthCheckController(DatabaseContext databaseContext)
    {
        _databaseContext = databaseContext;
    }

    [HttpGet("health")]
    public IActionResult HealthCheck()
    {
        return new OkObjectResult("All is well!");
    }

    [HttpGet("dbhealth")]
    public async Task<IActionResult> DatabaseHealthCheck()
    {
        await _databaseContext.Users.AddAsync(new RecallAI.Models.User
        {
            Email = "abc",
            PasswordHash = "pass"
        });
        await _databaseContext.SaveChangesAsync();
        var entry = _databaseContext.Users.FirstOrDefault(e => e.Email == "abc");
        if (entry != null)
        {
            return Ok();
        }
        return BadRequest();
    }
}
