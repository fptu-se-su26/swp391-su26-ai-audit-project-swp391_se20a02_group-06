using System.Text;
using FitnessTrainingSystem.Infrastructure;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using FitnessTrainingSystem.Infrastructure.Hubs;
// Load environment variables from .env file in the backend root directory
var envPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", ".env");
if (File.Exists(envPath))
{
    DotNetEnv.Env.Load(envPath);
}
else
{
    // Fallback if running from backend root directly
    var fallbackPath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
    if (File.Exists(fallbackPath))
    {
        DotNetEnv.Env.Load(fallbackPath);
    }
}

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

// Add services to the container.
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddAutoMapper(cfg => cfg.AddMaps(typeof(FitnessTrainingSystem.Application.Common.Mappings.ProductPackageProfile).Assembly));

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());
});

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false; // Giữ nguyên tên claim 'sub' từ JWT, không map sang URI dài
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


    
    });
builder.Services.AddSignalR();
builder.Services.AddSingleton<Microsoft.AspNetCore.SignalR.IUserIdProvider, FitnessTrainingSystem.Infrastructure.Hubs.SubClaimUserIdProvider>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173", "https://fptu-se-su26.github.io")
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
    app.MapScalarApiReference(options =>
    {
        options.WithTitle("Fitness API");
    });
}

// app.UseHttpsRedirection(); // Disabled: HTTPS port not configured
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<NotificationHub>("/r/notifications");
// (Bạn có thể giữ hoặc xóa đoạn code WeatherForecast mặc định này tùy ý)
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};
app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
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

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}