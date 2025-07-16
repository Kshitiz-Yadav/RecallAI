using API.Data.Domain;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options){}

    public DbSet<User> Users { get; set; }
}
