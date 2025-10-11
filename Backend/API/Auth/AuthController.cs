using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using API.Data;
using API.Data.Domain;
using API.Dto.Auth;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using static API.ApiResponseResolver;

namespace API.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : Controller
{
    private readonly AppSettings _appSettings;
    private readonly DatabaseContext _dbContext;
    private readonly PasswordHasher<object> _passwordHasher;
    private readonly ILogger<AuthController> _logger;
    private readonly IEmailService _emailService;

    public AuthController(AppSettings appSettings, DatabaseContext dbContext, ILogger<AuthController> logger, IEmailService emailService)
    {
        _passwordHasher = new PasswordHasher<object>();
        _appSettings = appSettings;
        _dbContext = dbContext;
        _logger = logger;
        _emailService = emailService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser([FromBody] UserCredentials credentials)
    {
        _logger.LogInformation("Register User request received for {userName}", credentials.Email);
        var username = credentials.Email.ToLower();
        var password = credentials.Password;
        var user = await _dbContext.Users.FirstOrDefaultAsync<User>(u => u.Email ==  username);
        if(user != null)
        {
            _logger.LogError("Error while registering user {userName}: Username already exists.", username);
            return ProcessApiResponse(HttpStatusCode.BadRequest, "Username already exists.");
        }

        await _dbContext.AddAsync<User>(new User
        {
            Email = username,
            PasswordHash = HashPassword(password),
            IsVerified = false
        });
        await _dbContext.SaveChangesAsync();

        var otp = await _emailService.SendOtpEmail(username);
        await _dbContext.AddAsync<UserAccountVerification>(new UserAccountVerification
        {
            Email = username,
            Otp = otp,
            Expiry = DateTime.UtcNow.AddMinutes(5)
        });
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("User {userName} created successfully", username);
        return ProcessApiResponse(HttpStatusCode.Created);
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] UserCredentials credentials)
    {
        _logger.LogInformation("Verifying OTP for {userName}", credentials.Email);
        var username = credentials.Email.ToLower();

        var otpEntry = await _dbContext.UserAccountVerification.FirstOrDefaultAsync(o => o.Email == username && o.Otp == credentials.Otp);
        if (otpEntry == null)
        {
            return ProcessApiResponse(HttpStatusCode.Unauthorized, "Invalid OTP Provided");
        }

        if(otpEntry.Expiry < DateTime.UtcNow)
        {
            return ProcessApiResponse(HttpStatusCode.BadRequest, "This OTP has Expired");
        }

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == username);
        if (user != null)
        {
            user.IsVerified = true;
        }

        await _dbContext.SaveChangesAsync();
        return ProcessApiResponse(HttpStatusCode.OK, "OTP verified successfully");
    }

    [HttpPost("send-otp")]
    public async Task<IActionResult> ResendOtp([FromBody] UserCredentials credentials)
    {
        _logger.LogInformation("Resending OTP for {userName}", credentials.Email);
        var username = credentials.Email.ToLower();

        var otpEntry = await _dbContext.UserAccountVerification.FirstOrDefaultAsync(o => o.Email == username);
        if (otpEntry == null)
        {
            return ProcessApiResponse(HttpStatusCode.BadRequest, "This user does not exist");
        }

        var otp = await _emailService.SendOtpEmail(username);
        otpEntry.Otp = otp;
        otpEntry.Expiry = DateTime.UtcNow.AddMinutes(5);
        await _dbContext.SaveChangesAsync();
        return ProcessApiResponse(HttpStatusCode.OK, "OTP resent successfully");
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] UserCredentials credentials)
    {
        _logger.LogInformation("Reseting password for {userName}", credentials.Email);
        var username = credentials.Email.ToLower();
        var otpEntry = await _dbContext.UserAccountVerification.FirstOrDefaultAsync(o => o.Email == username && o.Otp == credentials.Otp);
        if (otpEntry == null)
        {
            return ProcessApiResponse(HttpStatusCode.Unauthorized, "Invalid OTP Provided");
        }

        if (otpEntry.Expiry < DateTime.UtcNow)
        {
            return ProcessApiResponse(HttpStatusCode.BadRequest, "This OTP has Expired");
        }

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == username);
        if (user != null)
        {
            user.PasswordHash = HashPassword(credentials.Password);
        }

        await _dbContext.SaveChangesAsync();
        return ProcessApiResponse(HttpStatusCode.OK, "Password updated successfully");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserCredentials credentials)
    {
        _logger.LogInformation("Login request received for {userName}", credentials.Email);
        var username = credentials.Email.ToLower();
        var password = credentials.Password;
        var user = await _dbContext.Users.FirstOrDefaultAsync<User>(u => u.Email == username);
        if(user == null)
        {
            return ProcessApiResponse(HttpStatusCode.BadRequest, "This user does not exist");
        }

        if (!user.IsVerified)
        {
            return ProcessApiResponse(HttpStatusCode.Unauthorized, "Email verification pending");
        }

        if(!VerifyPassword(user.PasswordHash, password))
        {
            return ProcessApiResponse(HttpStatusCode.BadRequest, "The username and password do not match");
        }

        return ProcessApiResponse(HttpStatusCode.OK, null, GenerateToken(user));
    }

    private string HashPassword(string password)
    {
        return _passwordHasher.HashPassword(null, password);
    }

    private bool VerifyPassword(string hash, string password)
    {
        return _passwordHasher.VerifyHashedPassword(null, hash, password) == PasswordVerificationResult.Success;
    }

    private string GenerateToken(User user)
    {

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_appSettings.JwtSecret);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        ]),
            Expires = DateTime.UtcNow.AddDays(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
