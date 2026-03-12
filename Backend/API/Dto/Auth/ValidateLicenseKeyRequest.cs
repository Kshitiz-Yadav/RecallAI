namespace API.Dto.Auth;

public class ValidateLicenseKeyRequest
{
    public int UserId { get; set; }
    public required string Key { get; set; }
}
