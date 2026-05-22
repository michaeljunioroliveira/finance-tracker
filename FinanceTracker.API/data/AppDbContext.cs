using Microsoft.EntityFrameworkCore;
using FinanceTracker.API.Models;

namespace FinanceTracker.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // Equivalente ao @Entity no Spring — diz que Transaction vira tabela
    public DbSet<Transaction> Transactions { get; set; }
}