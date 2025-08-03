namespace API;

public class AppSettings
{
    public required string DatabaseConnectionString { get; set; }
    public required string JwtSecret { get; set; }
    public int FileStorageLimit { get; set; }
    public required string NServiceBusConnectionString { get; set; }
}
