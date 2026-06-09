using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;  
using Microsoft.EntityFrameworkCore;
using Stripe;
using treesy_backend.Data;
using treesy_backend.Services;

var builder = WebApplication.CreateBuilder(args); //Webapplication builder bruges til at konfiguere og oprette en webapplikation i ASP.Net Core

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme) //Tilføjer JWT Bearer authentication til applikationen som gør det muligt for applikation at authentificere og autoriserer brugerer baseret på JSON Web Tokens (JWT).
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, // ValidateIssuer = true betyder at applikation vil validere at den issuer (udsteder) der er angivet i JWT tokenet matcher den forventede issuer, som er konfigureret i appsettings.json under "Jwt:Issuer". Dette hjælper med at sikre at tokenet er udstedt af en betroet kilde og ikke er blevet forfalsket.
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            )
        };
    });



builder.Services.AddEndpointsApiExplorer(); //Tilføje API explorer services som er nødvendige for generere Swagger dokumentation for APIet. Det gør det muligt for Swagger at opdage og dokumentere API endpoints i applikationen, så udviklere kan se og teste dem via Swagger UI.
builder.Services.AddSwaggerGen();

//Database connection  
builder.Services.AddDbContext<TreesyDbContext>(options => //registrerer TreesyDBcontext i ASP.Net Core's dependency injection container, så den kan injiceres i controllerne og andre services, der har brug for at interagere med databasen. Jeg konfigurerer også DbContext til at bruge Npgsql som databaseudbyder, og jeg angiver connection string som parameter, så den ved hvordan den skal oprette forbindelse til PostgreSQL databasen. Connection string hentes fra konfigurationen (appsettings.json eller miljøvariabler) for at gøre det nemt at ændre databaseforbindelsen uden at skulle ændre koden.
{
    var connectionString = builder.Configuration["DB_CONNECTION"] //henter connection string 
                           ?? Environment.GetEnvironmentVariable("DB_CONNECTION");

    options.UseNpgsql(connectionString); //UseNpgsql er postgreSQL databaseudbyder for Entity Framework Core. Jeg konfigurerer DbContext til at bruge Npgsql med den angivne connection string, så den kan oprette forbindelse til PostgreSQL databasen og udføre databaseoperationer som migrations, queries osv.
});


//Stripe
StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"]; //Jeg henter stripe Secret key fra min usersecrets. StripeConfiguration.ApiKey bruges til at konfigurere Stripe's API klient med den nødvendige autentificering, så applikationen kan interagere med Stripe's API for at håndtere betalinger, abonnementer osv. 

builder.Services.AddCors(options => //Cors policy som tillader anmodninger fra frontend i vercel og gør det muligt at kommunikerer med backend uden at det blokeres
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("https://treesy-sami.vercel.app")
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

builder.Services.AddSingleton<EmailService>(); // AddSingleton er en metode i ASP.Net Core's dependency injection container som registrerer en service (i dette tilfælde EmailService) som en singleton, hvilket betyder at der kun oprettes én instans af EmailService for hele applikationens levetid. Denne instans deles på tværs af alle controllerne og services, der har brug for at sende emails, så de kan bruge den samme EmailService instans til at håndtere email-funktionaliteten i applikationen.
var app = builder.Build(); //Variabel app som indeholder Build metoden som bygger og konfiguerer webapplikationen 

// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();


app.UseHttpsRedirection(); // UseHttpsRedirection() registrerer middleware, der automatisk omdirigerer HTTP-forespørgsler til HTTPS for at sikre krypteret kommunikation mellem klient og server. 

// Cors
app.UseCors("AllowFrontend");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers(); //MapControllers() registrerer applikationens controller-baserede API-endpoints og gør dem tilgængelige for indgående HTTP-forespørgsler

app.Run(); //Starter applikationen når den er bygget og konfigueret
