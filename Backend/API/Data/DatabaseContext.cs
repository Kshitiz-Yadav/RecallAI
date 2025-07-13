using Microsoft.EntityFrameworkCore;
using RecallAI.Models;

namespace Backend.Data;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options){}

    public DbSet<User> Users { get; set; }
}
