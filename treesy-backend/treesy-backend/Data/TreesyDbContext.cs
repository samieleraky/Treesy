using Microsoft.EntityFrameworkCore;
using System;
using treesy_backend.Models;

namespace treesy_backend.Data
{
    
    public class TreesyDbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public TreesyDbContext(DbContextOptions<TreesyDbContext> options) : base(options) { }

        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Subscription> Subscriptions => Set<Subscription>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet <Tree> Trees => Set<Tree>();

        // OnModelCreating is used to configure the model (tables, relationships, indexes, etc.) using the Fluent API
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