using FitnessTrainingSystem.Application.Common.Interfaces;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Infrastructure.Authentication;
using FitnessTrainingSystem.Infrastructure.Persistence;
using FitnessTrainingSystem.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PayOS;

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
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IPTProfileService, PTProfileService>();
        services.AddScoped<IMembershipService, MembershipService>();

        services.AddHostedService<FitnessTrainingSystem.Infrastructure.BackgroundServices.ExerciseDeadlineReminderService>();
        services.AddHostedService<FitnessTrainingSystem.Infrastructure.BackgroundServices.WaterReminderBackgroundService>();

        services.AddScoped<ICloudinaryService, CloudinaryService>();

        services.AddHttpClient<IGeminiAiService, PythonAiService>(client =>
        {
            var baseUrl = configuration["AiService:BaseUrl"] ?? "http://localhost:8000";
            client.BaseAddress = new Uri(baseUrl);
            client.Timeout = TimeSpan.FromMinutes(5);
        });
        services.AddScoped<IAIChatService, AIChatService>();

        services.AddSingleton(new PayOSClient(new PayOSOptions
        {
            ClientId = configuration["PayOS:ClientId"] ?? "",
            ApiKey = configuration["PayOS:ApiKey"] ?? "",
            ChecksumKey = configuration["PayOS:ChecksumKey"] ?? ""
        }));
        services.AddScoped<IPayOSService, PayOSService>();

        return services;
    }
}
