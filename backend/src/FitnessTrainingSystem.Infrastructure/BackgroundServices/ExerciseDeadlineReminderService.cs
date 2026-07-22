using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FitnessTrainingSystem.Infrastructure.BackgroundServices;

public class ExerciseDeadlineReminderService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ExerciseDeadlineReminderService> _logger;

    public ExerciseDeadlineReminderService(IServiceProvider serviceProvider, ILogger<ExerciseDeadlineReminderService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Exercise Deadline Reminder Background Service started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await CheckDeadlinesAndSendRemindersAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while checking exercise deadlines.");
            }

            // Check every 1 hour
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }

    private async Task CheckDeadlinesAndSendRemindersAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

        var tomorrow = DateTime.UtcNow.AddDays(1);
        var now = DateTime.UtcNow;

        // Get requests whose deadline is within 24 hours and not yet completed
        var approachingRequests = await context.PtUploadRequests
            .Where(r => (r.Status == "PENDING" || r.Status == "REJECTED") &&
                        r.Deadline != null &&
                        r.Deadline <= tomorrow &&
                        r.Deadline > now)
            .ToListAsync();

        foreach (var req in approachingRequests)
        {
            // Avoid duplicate notifications by checking if one exists in the last 24h
            var matchContent = $"Request ID: {req.Id}";
            var alreadyNotified = await context.Notifications
                .AnyAsync(n => n.UserId == req.PtId &&
                               n.Type == "DEADLINE_APPROACHING" &&
                               n.Content.Contains(matchContent));

            if (!alreadyNotified)
            {
                _logger.LogInformation($"Sending deadline warning to PT {req.PtId} for Request ID {req.Id}.");

                await notificationService.SendNotificationAsync(
                    req.PtId,
                    "Exercise Deadline Approaching!",
                    $"The deadline for creating the exercise for group '{req.MuscleGroup ?? "General"}' is approaching. (Request ID: {req.Id})",
                    "DEADLINE_APPROACHING"
                );
            }
        }
    }
}
