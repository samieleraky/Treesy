using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using treesy_backend.Data;

namespace treesy_backend.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<TreesyDbContext>
    {
        public TreesyDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<TreesyDbContext>();

            // Indsæt DIN connection string her:
            var connectionString = "Host=ep-floral-mountain-aloa4h8p-pooler.c-3.eu-central-1.aws.neon.tech;Database=neondb;Username=neondb_owner;Password=npg_2U3wSVZOzEmy;SSL Mode=Require;Trust Server Certificate=true;";

            optionsBuilder.UseNpgsql(connectionString);
            return new TreesyDbContext(optionsBuilder.Options);
        }
    }
}