namespace API.Data.Domain;

public class LicenseKey
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public required string Name { get; set; }
    public required string KeyHash { get; set; }
    public bool IsActive { get; set; }
}
