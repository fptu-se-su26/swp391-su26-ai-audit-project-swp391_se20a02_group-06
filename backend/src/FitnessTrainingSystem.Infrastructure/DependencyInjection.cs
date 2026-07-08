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
                builder => 
                {
                    builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
                    builder.EnableRetryOnFailure();
                }
            ).UseSnakeCaseNamingConvention());
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IProductPackageService, ProductPackageService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IExerciseService, ExerciseService>();
        services.AddScoped<IPtService, PtService>();
        services.AddScoped<IFoodService, FoodService>();
        services.AddScoped<IBodyMetricService, BodyMetricService>();
        services.AddScoped<IEmailOTPRepository, FitnessTrainingSystem.Infrastructure.Repositories.EmailOTPRepository>();
        services.AddScoped<FitnessTrainingSystem.Application.Interfaces.IEmailService, FitnessTrainingSystem.Infrastructure.Services.EmailService>();
        services.AddScoped<FitnessTrainingSystem.Application.Interfaces.IOTPService, FitnessTrainingSystem.Infrastructure.Services.OTPService>();
        services.AddScoped<IMuscleGroupService, MuscleGroupService>();
        services.AddScoped<IWorkoutService, WorkoutService>();
        services.AddScoped<INutritionService, NutritionService>();
        services.AddScoped<IExerciseRequestService, ExerciseRequestService>();
        services.AddScoped<INotificationService, NotificationService>();

        // Register background hosted services
        services.AddHostedService<FitnessTrainingSystem.Infrastructure.BackgroundServices.ExerciseDeadlineReminderService>();
        services.AddHostedService<FitnessTrainingSystem.Infrastructure.BackgroundServices.WaterReminderBackgroundService>();

        // ☁️ Cloudinary Video Upload
        services.AddScoped<ICloudinaryService, CloudinaryService>();

        // 🚀 ĐĂNG KÝ HỆ THỐNG TRUY CẬP AI DƯỚI ĐÂY
        services.AddHttpClient<IGeminiAiService, GeminiAiService>();

        return services;
    }
}