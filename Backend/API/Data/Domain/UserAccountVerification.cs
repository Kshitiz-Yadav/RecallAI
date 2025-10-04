namespace API.Data.Domain;

public class UserAccountVerification
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public int Otp { get; set; }
    public DateTime Expiry { get; set; }
}
