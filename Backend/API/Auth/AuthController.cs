using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using API.Data;
using API.Data.Domain;
using API.Dto.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : Controller
{
    private readonly AppSettings _appSettings;
    private readonly DatabaseContext _dbContext;
    private readonly PasswordHasher<object> _passwordHasher;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AppSettings appSettings, DatabaseContext dbContext, ILogger<AuthController> logger)
    {
        _passwordHasher = new PasswordHasher<object>();
        _appSettings = appSettings;
        _dbContext = dbContext;
        _logger = logger;
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
            return BadRequest("Username already exists.");
        }

        await _dbContext.AddAsync<User>(new User
        {
            Email = username,
            PasswordHash = HashPassword(password)
        });
        await _dbContext.SaveChangesAsync();

        var storedUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == username);
        if (storedUser == null)
        {
            _logger.LogError("Could not create user successfully.");
            return StatusCode((int)HttpStatusCode.InternalServerError, "Could not create user successfully..");
        }

        await _dbContext.AddAsync<UserLimits>(new UserLimits
        {
            UserId = storedUser.Id,
            MaxStorage = _appSettings.FileStorageLimit,
            UsedStorage = 0
        });
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("User {userName} created successfully", username);
        return Created();
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
            return BadRequest("User does not exist.");
        }

        if(!VerifyPassword(user.PasswordHash, password))
        {
            return BadRequest("The username and password do not match");
        }

        return new OkObjectResult(GenerateToken(user));
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
