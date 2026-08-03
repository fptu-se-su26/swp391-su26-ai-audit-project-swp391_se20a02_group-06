using System.Text;
using FitnessTrainingSystem.Infrastructure;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
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

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new FitnessTrainingSystem.WebApi.Converters.DoubleRoundingJsonConverter());
        options.JsonSerializerOptions.Converters.Add(new FitnessTrainingSystem.WebApi.Converters.NullableDoubleRoundingJsonConverter());
        options.JsonSerializerOptions.Converters.Add(new FitnessTrainingSystem.WebApi.Converters.DecimalRoundingJsonConverter());
        options.JsonSerializerOptions.Converters.Add(new FitnessTrainingSystem.WebApi.Converters.NullableDecimalRoundingJsonConverter());
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

        CREATE TABLE IF NOT EXISTS `ai_chat_sessions` (
            `id` INT NOT NULL AUTO_INCREMENT,
            `user_id` INT NOT NULL,
            `title` VARCHAR(255) NOT NULL DEFAULT 'Nutrition AI Chat',
            `status` VARCHAR(50) NOT NULL DEFAULT 'active',
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            INDEX `IX_ai_chat_sessions_user_id` (`user_id`),
            CONSTRAINT `FK_ai_chat_sessions_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS `ai_chat_messages` (
            `id` INT NOT NULL AUTO_INCREMENT,
            `session_id` INT NOT NULL,
            `sender` VARCHAR(50) NOT NULL,
            `message` LONGTEXT NOT NULL,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            INDEX `IX_ai_chat_messages_session_id` (`session_id`),
            CONSTRAINT `FK_ai_chat_messages_sessions_session_id` FOREIGN KEY (`session_id`) REFERENCES `ai_chat_sessions` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS `ai_diet_histories` (
            `id` INT NOT NULL AUTO_INCREMENT,
            `user_id` INT NOT NULL,
            `session_id` INT NULL,
            `diet_title` VARCHAR(255) NOT NULL,
            `total_calories` INT NOT NULL,
            `protein` INT NOT NULL,
            `carbs` INT NOT NULL,
            `fat` INT NOT NULL,
            `raw_json` LONGTEXT NOT NULL,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            INDEX `IX_ai_diet_histories_user_id` (`user_id`),
            INDEX `IX_ai_diet_histories_session_id` (`session_id`),
            CONSTRAINT `FK_ai_diet_histories_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
            CONSTRAINT `FK_ai_diet_histories_sessions_session_id` FOREIGN KEY (`session_id`) REFERENCES `ai_chat_sessions` (`id`) ON DELETE SET NULL
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

try
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<FitnessTrainingSystem.Infrastructure.Persistence.ApplicationDbContext>();
    dbContext.Database.ExecuteSqlRaw("ALTER TABLE users ADD COLUMN refresh_token longtext;");
    dbContext.Database.ExecuteSqlRaw("ALTER TABLE users ADD COLUMN refresh_token_expiry_time datetime(6);");
}
catch { }

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}