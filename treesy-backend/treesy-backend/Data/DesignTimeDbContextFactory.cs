using Microsoft.EntityFrameworkCore.Design; // EntityFrameWorkCore design bruges 
using Microsoft.EntityFrameworkCore;
using treesy_backend.Data;

namespace treesy_backend.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<TreesyDbContext> //DesignTimeDbContextFactory implementerer IDesignTimeDbContextFactory<TreesyDbContext> som er en interface der bruges af Entity Framework Core værktøjer (f.eks. migrations) til at oprette en instans af TreesyDbContext under design-tid (når du arbejder med migrations eller andre EF Core værktøjer i udviklingsfasen).
    {
        public TreesyDbContext CreateDbContext(string[] args) //CreateDbContext er metoden der skal implementeres fra IDesignTimeDbContextFactory interfacet. Den tager en array af strings som argument (som kan bruges til at modtage eventuelle parametre, hvis nødvendigt) og returnerer en instans af TreesyDbContext. Denne metode konfigurerer og opretter en DbContext, som EF Core værktøjer kan bruge til at interagere med databasen under design-tid.
        {
            var optionsBuilder = new DbContextOptionsBuilder<TreesyDbContext>(); //erklærer variabel optionsbuilder som en ny instans af DbContextOptionsBuilder<TreesyDbContext>. DbContextOptionsBuilder er en klasse der bruges til at konfigurere indstillingerne for DbContext, såsom hvilken databaseudbyder der skal bruges (f.eks. Npgsql for PostgreSQL), connection string, osv. I dette tilfælde konfigurerer jeg den til at bruge Npgsql med den angivne connection string, så den kan oprette forbindelse til PostgreSQL databasen

            // Indsæt DIN connection string her for at kunne bruge migrations og andre EF core værktøjer under udvikling. Connectionstring peger på min PostgreSQL database hostet på Neon.tech, og indeholder oplysninger om host, database, username, password, SSL mode og trust server certificate. Det er vigtigt at denne connection string er korrekt for at kunne oprette forbindelse til databasen og udføre migrations
            var connectionString = "Host=ep-floral-mountain-aloa4h8p-pooler.c-3.eu-central-1.aws.neon.tech;Database=neondb;Username=neondb_owner;Password=npg_2U3wSVZOzEmy;SSL Mode=Require;Trust Server Certificate=true;";

            optionsBuilder.UseNpgsql(connectionString); //Jeg konfigurerer optionsBuilder til at bruge Npgsql som databaseudbyder, og jeg angiver connectionString som parameter, så den ved hvordan den skal oprette forbindelse til PostgreSQL databasen
            return new TreesyDbContext(optionsBuilder.Options); //Jeg returnerer en ny instans af TreesyDbContext, og jeg passerer de konfigurerede options (optionsBuilder.Options) til konstruktøren, så DbContext kan bruge disse indstillinger til at oprette forbindelse til databasen og udføre operationer som migrations, databaseopdateringer osv. under design-tid.
        }
    }
}