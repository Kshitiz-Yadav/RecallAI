using API.Data;
using API.Dto.Resources;
using API.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static API.Common;
using static API.ApiResponseResolver;
using System.Net;

namespace API.ResourceUsage;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsageController : Controller
{
    private readonly AppSettings _appSettings;
    private readonly DatabaseContext _dbContext;
    private readonly ILogger<UsageController> _logger;
    private readonly string CurrentMonth = $"{DateTime.UtcNow:MM}{DateTime.UtcNow:yyyy}";

    public UsageController(AppSettings appSettings, DatabaseContext dbContext, ILogger<UsageController> logger)
    {
        _appSettings = appSettings;
        _logger = logger;
        _dbContext = dbContext;
    }

    [HttpGet("limits")]
    public IActionResult GetResourceLimits()
    {
        _logger.LogInformation("Get resource limits request received.");
        return ProcessApiResponse(HttpStatusCode.OK, null, _appSettings.ResourceLimits);
    }

    [HttpGet]
    public async Task<IActionResult> GetCurrentMonthUsage()
    {
        _logger.LogInformation("Get monthly usage request received.");
        var userId = GetUserId(User);

        var usages = await _dbContext.UserLimits
            .Where(x => x.UserId == userId && (x.Month == CurrentMonth || x.Resource == Resource.FileStorage))
            .ToDictionaryAsync(u => u.Resource, u => new ResourceLimits
            {
                Input = u.InputUsed,
                Output = u.OutputUsed
            });

        return ProcessApiResponse(HttpStatusCode.OK, null, usages);
    }
}
