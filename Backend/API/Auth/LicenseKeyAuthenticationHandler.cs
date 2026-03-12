using API.Data;
using API.Data.Domain;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace API.Auth;

public class LicenseKeyAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly DatabaseContext _dbContext;

    public const string SchemeName = "LicenseKey";

    public LicenseKeyAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder, DatabaseContext dbContext)
        : base(options, logger, encoder)
    {
        _dbContext = dbContext;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue("X-License-Key", out var keyValues))
        {
            return AuthenticateResult.NoResult();
        }

        var licenseKey = keyValues.FirstOrDefault();
        if (string.IsNullOrWhiteSpace(licenseKey))
        {
            return AuthenticateResult.NoResult();
        }
        
        if (!TryParseUserIdFromLicenseKey(licenseKey, out var userId))
        {
            return AuthenticateResult.Fail("Invalid license key.");
        }

        try
        {
            var keys = await _dbContext.LicenseKeys
                .Where(k => k.UserId == userId && k.IsActive)
                .ToListAsync(Context.RequestAborted);

            if (keys.Count == 0)
            {
                return AuthenticateResult.Fail("Invalid license key.");
            }

            var isValid = VerifyPassword(keys, licenseKey);

            if (!isValid)
            {
                return AuthenticateResult.Fail("Invalid license key.");
            }

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, userId.ToString()),
                new("auth_type", "license_key")
            };

            var identity = new ClaimsIdentity(claims, SchemeName);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, SchemeName);

            return AuthenticateResult.Success(ticket);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error authenticating license key.");
            return AuthenticateResult.Fail("Error authenticating license key.");
        }
    }

    private static bool VerifyPassword(List<LicenseKey> keys, string licenseKey)
    {
        var passwordHasher = new PasswordHasher<object>();
        return keys.Any(k => passwordHasher.VerifyHashedPassword(null, k.KeyHash, licenseKey) == PasswordVerificationResult.Success);
    }

    private static bool TryParseUserIdFromLicenseKey(string licenseKey, out int userId)
    {
        userId = -1;

        try
        {
            byte[] raw = Convert.FromBase64String(licenseKey);
            if (raw.Length < 4)
            {
                return false;
            }

            userId = BitConverter.ToInt32(raw, 0);
        }
        catch
        {
            return false;
        }

        return userId > 0;
    }
}

