using API.Data;
using API.Data.Domain;
using API.Dto.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Security.Cryptography;
using static API.ApiResponseResolver;
using static API.Common;

namespace API.Auth;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LicenseKeyController : Controller
{
    private readonly DatabaseContext _dbContext;
    private readonly ILogger<LicenseKeyController> _logger;
    private readonly PasswordHasher<object> _passwordHasher;

    public LicenseKeyController(DatabaseContext dbContext, ILogger<LicenseKeyController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
        _passwordHasher = new PasswordHasher<object>();
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateLicenseKeyRequest request)
    {
        _logger.LogInformation("Create License key request received for {name}", request.Name);

        var userId = GetUserId(User);

        var existing = await _dbContext.LicenseKeys.FirstOrDefaultAsync(a => a.UserId == userId && a.Name == request.Name);
        if (existing != null)
        {
            return ProcessApiResponse(HttpStatusCode.Conflict, "An License key with this name already exists.");
        }

        var plainKey = GenerateLicenseKey(userId);
        var keyHash = HashLicenseKey(plainKey);

        await _dbContext.AddAsync(new LicenseKey
        {
            UserId = userId,
            Name = request.Name,
            KeyHash = keyHash,
            IsActive = true
        });
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("License Key created successfully.");
        return ProcessApiResponse(
            HttpStatusCode.Created,
            "This is the only time you will see this license key. Store it securely.",
            new GetLicenseKeyResponse { Key = plainKey });
    }

    [HttpGet("keys")]
    public async Task<IActionResult> GetKeys()
    {
        var userId = GetUserId(User);

        var names = await _dbContext.LicenseKeys.Where(a => a.UserId == userId && a.IsActive).Select(a => a.Name).ToListAsync();
        return ProcessApiResponse(HttpStatusCode.OK, null, new LicenseKeysResponse { Names = names });
    }

    [HttpPut("revoke/{keyName}")]
    public async Task<IActionResult> RevokeKey(string keyName)
    {
        var userId = GetUserId(User);

        var entry = await _dbContext.LicenseKeys.FirstOrDefaultAsync(a => a.UserId == userId && a.Name == keyName);
        if (entry == null)
        {
            return ProcessApiResponse(HttpStatusCode.NotFound, "License key not found");
        }

        entry.IsActive = false;
        await _dbContext.SaveChangesAsync();
        return ProcessApiResponse(HttpStatusCode.OK, "License key revoked successfully");
    }

    private static string GenerateLicenseKey(int userId)
    {
        // 4 bytes for userId + 32 random bytes
        var randomBytes = RandomNumberGenerator.GetBytes(32);
        var buffer = new byte[4 + randomBytes.Length];

        var userBytes = BitConverter.GetBytes(userId);
        Array.Copy(userBytes, 0, buffer, 0, 4);
        Array.Copy(randomBytes, 0, buffer, 4, randomBytes.Length);

        return Convert.ToBase64String(buffer);
    }

    private string HashLicenseKey(string password)
    {
        return _passwordHasher.HashPassword(null, password);
    }
}
