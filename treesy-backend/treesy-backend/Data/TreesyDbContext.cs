using Microsoft.EntityFrameworkCore;
using System;
using treesy_backend.Models;

namespace treesy_backend.Data
{
    
    public class TreesyDbContext : Microsoft.EntityFrameworkCore.DbContext //TreesyDbContext arver fra DbContext, som er en del af Entity Framework Core og bruges til at interagere med databasen
    {
        public TreesyDbContext(DbContextOptions<TreesyDbContext> options) : base(options) { } //Konstruktøren for TreesyDbContext tager en parameter af typen DbContextOptions<TreesyDbContext>, som indeholder konfigurationsindstillinger for DbContext (f.eks. hvilken databaseudbyder der skal bruges, connection string, osv.). Konstruktøren kalder base(options) for at videregive disse indstillinger til den overordnede DbContext klasse, så den kan bruge dem til at oprette forbindelse til databasen og udføre operationer som migrations, databaseopdateringer osv.

        public DbSet<Customer> Customers => Set<Customer>(); //Customer klassen gemmes i Customers tabellen i databasen, Subscription klassen gemmes i Subscriptions tabellen osv.
        public DbSet<Subscription> Subscriptions => Set<Subscription>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet <Tree> Trees => Set<Tree>();

        protected override void OnModelCreating(ModelBuilder b) //metode OnmodelCreating bruges til at konfigurere modellen (tabeller, relationer, indekser osv.) ved hjælp af Fluent API. Det giver mig mulighed for at specificere yderligere konfigurationer for mine entiteter ud over det, der kan opnås gennem data annotations i modelklasserne. I dette tilfælde bruger jeg det til at oprette unikke indekser på visse felter og til at specificere præcisionen for et decimalfelt
        {
            b.Entity<Customer>().HasIndex(c => c.StripeCustomerId).IsUnique(); //opretter et indeks på StripCustomerId og gør det unikt. Altså at den samme Stripe kunde ikke kan oprettes flere gange
            b.Entity<Customer>().HasIndex(c => c.Email).IsUnique(); //opretter et indeks på Email og gør det unikt. Altså at den samme email ikke kan oprettes flere gange
            b.Entity<Subscription>().HasIndex(s => s.StripeSubscriptionId).IsUnique(); //opretter et indeks på StripeSubscriptionId og gør det unikt. Altså at den samme Stripe abonnement ikke kan oprettes flere gange
            b.Entity<Order>().HasIndex(o => o.StripeSessionId).IsUnique(); //opretter et indeks på StripeSessionId og gør det unikt. Altså at den samme Stripe session ikke kan oprettes flere gange
            b.Entity<Order>().Property(o => o.AmountDkk).HasPrecision(10, 2); // specificerer at AmountDkk feltet i Order entiteten skal have en decimal præcision på 10 cifre i alt, hvoraf 2 er decimaler. Det betyder at det kan gemme beløb op til 99999999.99 DKK uden at miste nøjagtighed, hvilket er vigtigt for at håndtere penge korrekt i databasen
        }
    }
}