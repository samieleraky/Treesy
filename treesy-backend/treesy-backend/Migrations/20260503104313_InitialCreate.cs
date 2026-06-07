using System; //importerer System namespace, som indeholder grundlæggende datatyper og funktioner, herunder Guid og DateTime, som bruges i denne migration
using Microsoft.EntityFrameworkCore.Migrations; //importerer Microsoft.EntityFrameworkCore.Migrations namespace, som indeholder klasser og metoder til at oprette og håndtere database-migrationer i Entity Framework Core. Migrationer bruges til at opdatere databasens struktur i takt med ændringer i datamodellen i koden. I denne fil defineres en migration, der opretter de nødvendige tabeller og relationer for at understøtte Customer, Subscription, Order og Tree modellerne i databasen.

#nullable disable

namespace treesy_backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration //InitialCreate klasse som nedarver fra Migration, og repræsenterer den første migration for at oprette de nødvendige tabeller og relationer i databasen baseret på datamodellen i koden. Denne migration vil blive brugt til at oprette Customers, Orders, Subscriptions og Trees tabellerne i databasen, samt definere deres kolonner, datatyper, primære nøgler, fremmednøgler og indekser.
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder) //Up metoden tager en MigrationBuilder som parameter, og indeholder koden til at oprette de nødvendige tabeller og relationer i databasen. Når denne migration køres, vil Up metoden blive eksekveret for at opdatere databasens struktur i henhold til det, der er defineret i denne metode. I dette tilfælde opretter den Customers, Orders, Subscriptions og Trees tabellerne med de specificerede kolonner, datatyper, primære nøgler, fremmednøgler og indekser.
        {
            migrationBuilder.CreateTable( 
                name: "Customers",
                columns: table => new 
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false), //false betyder at denne kolonne ikke kan være null, altså at hver kunde skal have en unik Id. Guid er en datatype som generer unikke idér, og det bruges her for at sikre at hver kunde har et unikt identifier i databasen
                    StripeCustomerId = table.Column<string>(type: "text", nullable: true), //nullable: true betyder at denne kolonne kan være null, altså at det ikke er obligatorisk for hver kunde at have en StripeCustomerId. Det giver fleksibilitet i tilfælde hvor en kunde endnu ikke har en tilknyttet Stripe-konto, eller hvis StripeCustomerId endnu ikke er blevet oprettet for kunden
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Company = table.Column<string>(type: "text", nullable: true),
                    CustomerType = table.Column<string>(type: "text", nullable: false),
                    TotalTreesPlanted = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.Id); //primary key på Id kolonenm som er en Guid (universelt unik identifier)
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomerId = table.Column<Guid>(type: "uuid", nullable: false),
                    StripePaymentIntentId = table.Column<string>(type: "text", nullable: true),
                    StripeSessionId = table.Column<string>(type: "text", nullable: false),
                    PlanId = table.Column<string>(type: "text", nullable: false),
                    Trees = table.Column<int>(type: "integer", nullable: false),
                    AmountDkk = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey( //fremmednøgle på CustomerId som refererer til Id i Customers tabellen. Det betyder at hver ordre skal være knyttet til en eksisterende kunde, og hvis en kunde slettes, så vil alle deres ordrer også blive slettet (Cascade delete)
                        name: "FK_Orders_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Subscriptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomerId = table.Column<Guid>(type: "uuid", nullable: false),
                    StripeSubscriptionId = table.Column<string>(type: "text", nullable: false),
                    PlanId = table.Column<string>(type: "text", nullable: false),
                    Billing = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CurrentPeriodEnd = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CancelledAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subscriptions", x => x.Id);
                    table.ForeignKey( //fremmednøgle på CustomerId som refererer til Id i Customer tabellen. Det betyder at hver abonnement skal være knyttet til en eksisterende kunde, og hvis en kunde slettes, så vil alle deres abonnementer også blive slettet (Cascade delete)
                        name: "FK_Subscriptions_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Trees",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomerId = table.Column<Guid>(type: "uuid", nullable: false),
                    Latitude = table.Column<double>(type: "double precision", nullable: false), //double precision er en datatyp i PostgreSQL som bruges til at gemme flydende tal med dobbelt præcision, hvilket betyder at det kan gemme meget store eller meget små tal med høj nøjagtighed. I dette tilfælde bruges det til at gemme træets geografiske breddegrad (latitude) og længdegrad (longitude), som er vigtige for at kunne placere træet korrekt på et kort og for at kunne beregne afstande mellem træer eller mellem træer og kunder
                    Longitude = table.Column<double>(type: "double precision", nullable: false),
                    PlantedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trees", x => x.Id);
                    table.ForeignKey( //FK på CustomerId som refererer til Id i Customers tabellen. Det betyder at hver træ skal være knyttet til en eksisterende kunde, og hvis en kunde slettes, så vil alle deres træer også blive slettet (Cascade delete)
                        name: "FK_Trees_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade); //referentialAction.Cascade betyder at hvis en kunde slettes, så vil alle deres træer også blive slettet automatisk af databasen, for at opretholde dataintegriteten og undgå forældreløse poster i Trees tabellen
                });

            //CreateIndex metode bruges til at oprette indekster på specifikke kolonner i tabeller for at forbedre ydeevne ved forespørglser og sikre dataintegritet ved fx Unique indekser. Her opretter jeg indekser på Email og StripeCustomerId i Customers tabellen, på StripeSessionId i Orders tabellen, på CustomerId og StripeSubscriptionId i Subscriptions tabellen, og på CustomerId i Trees tabellen. Disse indekser hjælper med at sikre at forespørgsler der filtrerer eller sorterer baseret på disse kolonner kan udføres hurtigere, og at unikke værdier (som email og Stripe IDs) ikke kan duplikeres i databasen
            migrationBuilder.CreateIndex(
                name: "IX_Customers_Email",
                table: "Customers",
                column: "Email",
                unique: true); //opretter et unikt indeks på Email kolonnen i Customers tabellen, hvilket betyder at hver emailadresse kun kan forekomme én gang i databasen. Det sikrer at ingen kunder kan registrere sig med den samme emailadresse, hvilket er vigtigt for at opretholde dataintegriteten og for at kunne identificere kunder unikt baseret på deres email

            migrationBuilder.CreateIndex(
                name: "IX_Customers_StripeCustomerId",
                table: "Customers",
                column: "StripeCustomerId",
                unique: true); //indeks på StripeCustomerId kolonnen i Customers tabellen, som er unikt. Det betyder at hver Stripe kunde kun kan være knyttet til én kunde i vores database, og det hjælper med at sikre dataintegriteten og forhindrer duplikering af Stripe kunder i vores system

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomerId",
                table: "Orders",
                column: "CustomerId"); //indeks på Orders tabellen for CustomerId kolonnen, som er en fremmednøgle der refererer til Customers tabellen. Dette indeks forbedrer ydeevnen ved forespørgsler der filtrerer ordrer baseret på kunde, da det tillader databasen at finde relevante ordrer hurtigere ved at bruge indekset i stedet for at scanne hele Orders tabellen

            migrationBuilder.CreateIndex(
                name: "IX_Orders_StripeSessionId",
                table: "Orders",
                column: "StripeSessionId",
                unique: true); //indeks på StripesessionId kolonnen i Orders tabellen, som er unik. Det betyder at hver Stripe session kun kan være knyttet til en ordre i vores database, det hjælper med at sikre dataintegriteten

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_CustomerId",
                table: "Subscriptions",
                column: "CustomerId"); //indeks på CustomerId kolonnen i Subscriptions tabellen, som er en fremmednøgle der refererer til Customers tabellen. Dette indeks forbedrer ydeevnen ved forespørgsler der filtrerer abonnementer baseret på kunde, da det tillader databasen at finde relevante abonnementer hurtigere ved at bruge indekset i stedet for at scanne hele Subscriptions tabellen

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_StripeSubscriptionId",
                table: "Subscriptions",
                column: "StripeSubscriptionId",
                unique: true); //StripeSubscriptionId kolonnen i Subscriptions tabellen, som er unik. Det betyder at hver Stripe abonnement kun kan være knyttet til et abonnement i vores database, det hjælper med at sikre dataintegriteten

            migrationBuilder.CreateIndex(
                name: "IX_Trees_CustomerId",
                table: "Trees",
                column: "CustomerId"); //CustomerId kolonnen i Trees tabellen, som er en fremmednøgle der refererer til Customers tabellen. Dette indeks forbedrer ydeevnen ved forespørgsler der filtrerer træer baseret på kunde, da det tillader databasen at finde relevante træer hurtigere ved at bruge indekset i stedet for at scanne hele Trees tabellen
        }

        /// <inheritdoc/> //down metoden er det modsatte af up metoden, og indeholder koden til at rulle de ændringer der blev foretaget i up metoden tilbage. Det betyder at hvis denne migration rulles tilbage, så vil down metoden blive eksekveret for at gendanne databasens struktur til det, den var før denne migration blev anvendt. I dette tilfælde vil den slette Orders, Subscriptions, Trees og Customers tabellerne, hvilket effektivt fjerner alle de ændringer der blev foretaget i Up metoden.
        protected override void Down(MigrationBuilder migrationBuilder) 
        {
            migrationBuilder.DropTable(
                name: "Orders"); //Orders slettes først fordi den har en fremmednøgle til Customers, så den skal slettes før Customers for at undgå referential integrity fejl

            migrationBuilder.DropTable(
                name: "Subscriptions"); //Subscriptions slettes før Customers fordi den har en fremmednøgle til Customers, så den skal slettes før Customers for at undgå referential integrity fejl

            migrationBuilder.DropTable(
                name: "Trees"); //Trees slettes før Customers fordi den har en fremmednøgle til Customers, så den skal slettes før Customers for at undgå referential integrity fejl

            migrationBuilder.DropTable(
                name: "Customers"); //Customers slettes til sidst fordi både Orders, Subscriptions og Trees har fremmednøgler der refererer til Customers, så de skal slettes først for at undgå referential integrity fejl. Når Customers tabellen slettes, så slettes alle data i den, inklusive alle kunder og deres oplysninger, hvilket effektivt ruller alle ændringerne i denne migration tilbage
        }
    }
}
