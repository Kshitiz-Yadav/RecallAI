namespace API;

public class AppSettings
{
    public required string DatabaseConnectionString { get; set; }
    public required string JwtSecret { get; set; }
}
