using Microsoft.EntityFrameworkCore;
using treesy_backend.Models;

namespace treesy_backend.Data
{
    public class TreesyDbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public TreesyDbContext(DbContextOptions<TreesyDbContext> options) : base(options) { }

        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Subscription> Subscriptions => Set<Subscription>();
        public DbSet<Order> Orders => Set<Order>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            b.Entity<Customer>().HasIndex(c => c.StripeCustomerId).IsUnique();
            b.Entity<Customer>().HasIndex(c => c.Email).IsUnique();
            b.Entity<Subscription>().HasIndex(s => s.StripeSubscriptionId).IsUnique();
            b.Entity<Order>().HasIndex(o => o.StripeSessionId).IsUnique();
            b.Entity<Order>().Property(o => o.AmountDkk).HasPrecision(10, 2);
        }
    }
}