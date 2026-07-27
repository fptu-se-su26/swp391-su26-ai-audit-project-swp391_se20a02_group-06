using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Domain.Entities;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FitnessTrainingSystem.Infrastructure.BackgroundServices;

public class WaterReminderBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<WaterReminderBackgroundService> _logger;

    public WaterReminderBackgroundService(IServiceProvider serviceProvider, ILogger<WaterReminderBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Water Reminder Background Service started.");

        try
        {
            // Initial delay so it doesn't fire immediately upon startup
            await Task.Delay(TimeSpan.FromMinutes(2), stoppingToken);
        }
        catch (OperationCanceledException)
        {
            return;
        }

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await SendWaterRemindersAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while sending water reminders.");
            }

            try
            {
                // Scan every 30 minutes
                await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
            }
            catch (OperationCanceledException)
            {
                // Ignore, application is shutting down
            }
        }
    }

    private async Task SendWaterRemindersAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

        // Find all active members (roleId = 3)
        var members = await context.Users
            .Where(u => u.RoleId == 3 && u.Status == "Active")
            .ToListAsync();

        var today = DateTime.Today;

        foreach (var member in members)
        {
            // If they haven't configured their waking hours yet (null), skip this user
            if (string.IsNullOrEmpty(member.Status))
            {
                continue;
            }

            if (!TimeSpan.TryParse("08:00", out var startTime) ||
                !TimeSpan.TryParse("22:00", out var endTime))
            {
                // Fallback if formatting is corrupted
                continue;
            }

            var localNow = DateTime.Now;
            var timeOfDay = localNow.TimeOfDay;

            // Check if current time is within wake-sleep window
            if (timeOfDay < startTime || timeOfDay >= endTime)
            {
                continue; // User is asleep, do not remind
            }

            // Get user's daily summary log for today
            var log = await context.Set<DailyNutritionLog>()
                .FirstOrDefaultAsync(l => l.UserId == member.Id && l.LogDate == today);

            if (log == null)
            {
                continue; // Daily log is not created yet (user hasn't opened app today)
            }

            int target = log.WaterTargetGlasses;
            int consumed = log.WaterConsumedGlasses;

            // If user has already reached or exceeded target, skip!
            if (consumed >= target)
            {
                continue;
            }

            int remaining = target - consumed;

            // Calculate hours left until EndTime
            var timeRemaining = endTime - timeOfDay;
            var hoursLeft = timeRemaining.TotalHours;

            if (hoursLeft <= 0)
            {
                continue;
            }

            // Dynamic Interval in hours: hours left / remaining cups
            double intervalInHours = hoursLeft / remaining;

            // Cap interval at a reasonable minimum/maximum (e.g. at least 30 minutes, max 4 hours)
            if (intervalInHours < 0.5) intervalInHours = 0.5;

            // Check the last WATER_REMINDER notification sent today
            var lastReminder = await context.Notifications
                .Where(n => n.UserId == member.Id && n.Type == "WATER_REMINDER" && n.CreatedAt >= today.ToUniversalTime())
                .OrderByDescending(n => n.CreatedAt)
                .FirstOrDefaultAsync();

            bool shouldSend = false;
            if (lastReminder == null)
            {
                // Never notified today. Send if they have been awake for at least one interval
                var timeSinceStart = timeOfDay - startTime;
                if (timeSinceStart.TotalHours >= intervalInHours)
                {
                    shouldSend = true;
                }
            }
            else
            {
                // Check time elapsed since last reminder (calculated in UTC to be timezone safe)
                var timeSinceLast = DateTime.UtcNow - (lastReminder.CreatedAt ?? DateTime.UtcNow);
                if (timeSinceLast.TotalHours >= intervalInHours)
                {
                    shouldSend = true;
                }
            }

            if (shouldSend)
            {
                _logger.LogInformation($"Sending smart water reminder to User {member.Id}. Remaining: {remaining} glasses, Hours left: {hoursLeft:F1}, Interval: {intervalInHours:F1}h.");

                await notificationService.SendNotificationAsync(
                    member.Id,
                    "Time to Drink Water! 🥛",
                    $"Bạn còn {remaining} cốc nước cần uống trước 22:00. Hãy bổ sung ngay một cốc nước nhé!",
                    "WATER_REMINDER"
                );
            }
        }
    }
}
