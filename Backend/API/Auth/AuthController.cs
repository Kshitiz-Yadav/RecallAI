using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using API.Data;
using API.Data.Domain;

namespace API.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : Controller
{
    private readonly AppSettings _appSettings;
    private readonly DatabaseContext _dbContext;
    private readonly PasswordHasher<object> _passwordHasher;
    private readonly Logger<AuthController> _logger;

    public AuthController(AppSettings appSettings, DatabaseContext dbContext, Logger<AuthController> logger)
    {
        _passwordHasher = new PasswordHasher<object>();
        _appSettings = appSettings;
        _dbContext = dbContext;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser(string userName, string password)
    {
        _logger.LogInformation("Register User request received for {userName}", userName);
        userName = userName.ToLower();
        var user = await _dbContext.Users.FirstOrDefaultAsync<User>(u => u.Email ==  userName);
        if(user != null)
        {
            _logger.LogError("Error while registering user {userName}: Username already exists.", userName);
            return BadRequest("Username already exists.");
        }

        await _dbContext.AddAsync<User>(new User
        {
            Email = userName,
            PasswordHash = HashPassword(password)
        });
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("User {userName} created successfully", userName);
        return Created();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(string username, string password)
    {
        _logger.LogInformation("Login request received for {userName}", username);
        username = username.ToLower();
        var user = await _dbContext.Users.FirstOrDefaultAsync<User>(u => u.Email == username);
        if(user == null)
        {
            return BadRequest("User does not exist.");
        }

        if(!VerifyPassword(user.PasswordHash, password))
        {
            return BadRequest("The username and password do not match");
        }

        return new OkObjectResult(GenerateToken(username));
    }

    private string HashPassword(string password)
    {
        return _passwordHasher.HashPassword(null, password);
    }

    private bool VerifyPassword(string hash, string password)
    {
        return _passwordHasher.VerifyHashedPassword(null, hash, password) == PasswordVerificationResult.Success;
    }

    private string GenerateToken(string userId)
    {

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_appSettings.JwtSecret);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([
            new Claim(ClaimTypes.NameIdentifier, userId)
        ]),
            Expires = DateTime.UtcNow.AddDays(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
