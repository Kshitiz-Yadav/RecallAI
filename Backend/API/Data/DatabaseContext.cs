using API.Data.Domain;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }

    public DbSet<Usage> UserLimits { get; set; }

    public DbSet<DataFile> Files { get; set; }

    public DbSet<ChatHistory> ChatHistory { get; set; }

    public DbSet<UserAccountVerification> UserAccountVerification { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usage>().HasKey(u => new { u.UserId, u.Resource, u.Month });
        base.OnModelCreating(modelBuilder);
    }
}
