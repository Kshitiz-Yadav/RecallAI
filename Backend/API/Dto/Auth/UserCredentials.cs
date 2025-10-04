namespace API.Dto.Auth;

public class UserCredentials
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Otp { get; set; }
}
