using Microsoft.EntityFrameworkCore;
using Backend.Data;

Console.WriteLine("🚀 Running EF Core migrations...");

var optionsBuilder = new DbContextOptionsBuilder<DatabaseContext>();

// Use env var for connection string (injected from Docker)
var connectionString = Environment.GetEnvironmentVariable("DatabaseConnectionString");

if (string.IsNullOrWhiteSpace(connectionString))
{
    Console.WriteLine("❌ Missing DatabaseConnectionString");
    return;
}

optionsBuilder.UseNpgsql(connectionString);
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

using var context = new DatabaseContext(optionsBuilder.Options);

context.Database.Migrate();

Console.WriteLine("✅ Migrations applied successfully.");
