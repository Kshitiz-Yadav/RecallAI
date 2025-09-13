using API.Data.Domain;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }

    public DbSet<UserLimits> UserLimits { get; set; }

    public DbSet<DataFile> Files { get; set; }

    public DbSet<ChatHistory> ChatHistory { get; set; }
}
