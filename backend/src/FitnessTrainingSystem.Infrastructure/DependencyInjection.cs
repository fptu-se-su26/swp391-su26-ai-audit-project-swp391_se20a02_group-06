using FitnessTrainingSystem.Application.Common.Interfaces; 
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Infrastructure.Authentication;
using FitnessTrainingSystem.Infrastructure.Persistence;
using FitnessTrainingSystem.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FitnessTrainingSystem.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        // We use a fixed MySqlServerVersion to avoid requiring a running database server during design-time migrations.
        // Adjust the version (e.g. Version(8, 0, 36)) to match your production/local MySQL server version.
        var serverVersion = new MySqlServerVersion(new Version(8, 0, 36));

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseMySql(
                connectionString,
                serverVersion,
                builder => builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)
            ));

        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IAuthService, AuthService>();

        // 🚀 ĐĂNG KÝ HỆ THỐNG TRUY CẬP AI DƯỚI ĐÂY
        services.AddHttpClient<IGeminiAiService, GeminiAiService>();

        return services;
    }
}