using System.Text;
using FitnessTrainingSystem.Infrastructure;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using FitnessTrainingSystem.Infrastructure.Hubs;

// Load environment variables from .env files
string[] envPaths = [
    Path.Combine(Directory.GetCurrentDirectory(), "..", "..", ".env"),
    Path.Combine(Directory.GetCurrentDirectory(), "..", ".env"),
    Path.Combine(Directory.GetCurrentDirectory(), ".env")
];

foreach (var path in envPaths)
{
    if (File.Exists(path))
    {
        DotNetEnv.Env.Load(path);
    }
}

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

// Add services to the container.
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddAutoMapper(cfg => cfg.AddMaps(typeof(FitnessTrainingSystem.Application.Common.Mappings.ProductPackageProfile).Assembly));
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(FitnessTrainingSystem.Application.Features.AiRecommendations.Commands.GenerateWorkoutPlan.GenerateWorkoutPlanCommand).Assembly));

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddSignalR();

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!))
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];

                // Read token from query string if it is a SignalR hub request
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/r/notifications"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];

                // Read token from query string if it is a SignalR hub request
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/r/notifications"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

// CORS: fixed origins + optional extras from config (comma-separated Cors:AllowedOrigins)
var fixedOrigins = new[] { "http://localhost:5173", "https://fptu-se-su26.github.io", "https://swp391-su26-ai-audit-project-swp391-sigma.vercel.app" };
var extraOrigins = (builder.Configuration["Cors:AllowedOrigins"] ?? "")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
var allOrigins = fixedOrigins.Concat(extraOrigins).Distinct().ToArray();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(allOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

var app = builder.Build();

// Auto-create missing tables in development
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.EnsureCreated();
    // Ensure EmailOTP table exists (for OTP feature) - snake_case columns match EF Core naming convention
    db.Database.ExecuteSqlRaw(@"
        CREATE TABLE IF NOT EXISTS `EmailOTP` (
            `id` VARCHAR(36) NOT NULL,
            `email` VARCHAR(100) NOT NULL,
            `otp_code` VARCHAR(10) NOT NULL,
            `purpose` VARCHAR(50) NOT NULL,
            `expired_at` DATETIME NOT NULL,
            `is_used` TINYINT(1) NOT NULL DEFAULT 0,
            `attempt_count` INT NOT NULL DEFAULT 0,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            INDEX `IX_EmailOTP_Email` (`email`),
            INDEX `IX_EmailOTP_Purpose` (`purpose`),
            INDEX `IX_EmailOTP_ExpiredAt` (`expired_at`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    }
    
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection(); // Disabled: HTTPS port not configured

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<FitnessTrainingSystem.Infrastructure.Hubs.NotificationHub>("/r/notifications");

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

try
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<FitnessTrainingSystem.Infrastructure.Persistence.ApplicationDbContext>();
    
    void SafeExecuteSql(string sql)
    {
        try { dbContext.Database.ExecuteSqlRaw(sql); } catch { }
    }

    SafeExecuteSql("ALTER TABLE users ADD COLUMN refresh_token longtext;");
    SafeExecuteSql("ALTER TABLE users ADD COLUMN refresh_token_expiry_time datetime(6);");
    
    SafeExecuteSql("ALTER TABLE exercises ADD COLUMN is_draft tinyint(1) NOT NULL DEFAULT 0;");
    
    SafeExecuteSql("ALTER TABLE schedules ADD COLUMN order_code bigint NULL;");
    SafeExecuteSql("ALTER TABLE schedules ADD COLUMN price decimal(18,2) NULL;");
    SafeExecuteSql("ALTER TABLE schedules ADD COLUMN description longtext NULL;");
    
    SafeExecuteSql("ALTER TABLE pt_profiles ADD COLUMN coaching_philosophy varchar(1000) NULL;");
    SafeExecuteSql("ALTER TABLE pt_profiles ADD COLUMN session_rate decimal(18,2) NULL;");
}
catch { }

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
