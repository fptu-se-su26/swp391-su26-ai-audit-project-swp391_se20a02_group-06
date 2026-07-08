using FitnessTrainingSystem.Application.DTOs.Nutrition;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Domain.Entities;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class NutritionService : INutritionService
{
    private readonly ApplicationDbContext _context;

    public NutritionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DailyNutritionSummaryDto> GetDailySummaryAsync(int userId, DateTime date)
    {
        var targetDate = date.Date;

        var user = await _context.Users
            .Include(u => u.BodyMetrics)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) throw new Exception("User not found");

        var latestMetric = user.BodyMetrics.OrderByDescending(m => m.RecordedAt).FirstOrDefault();
        bool hasMetrics = latestMetric != null && latestMetric.Weight > 0;

        var fitnessGoal = user.FitnessGoal ?? "MAINTAIN";

        // Calculate targets
        int caloriesTarget = 2000; // default
        decimal proteinTarget = 150;
        decimal carbsTarget = 200;
        decimal fatTarget = 65;
        int waterTarget = 8;

        if (hasMetrics)
        {
            // BMR calculation (Mifflin-St Jeor)
            // Need age, fallback to 25 if unknown
            int age = 25;
            if (user.DateOfBirth.HasValue)
            {
                var today = DateTime.Today;
                age = today.Year - user.DateOfBirth.Value.Year;
                if (user.DateOfBirth.Value.Date > today.AddYears(-age)) age--;
            }

            decimal height = latestMetric!.Height ?? 170; // fallback height
            decimal weight = latestMetric.Weight;

            // BMR
            decimal bmr;
            if (user.Gender == "Female" || user.Gender == "F")
            {
                bmr = (10 * weight) + (6.25m * height) - (5 * age) - 161;
            }
            else // Male or undefined
            {
                bmr = (10 * weight) + (6.25m * height) - (5 * age) + 5;
            }

            // TDEE - Assuming moderate activity level 1.55
            decimal tdee = bmr * 1.55m;

            // Adjust by goal
            if (fitnessGoal == "LOSE_WEIGHT") tdee -= 400;
            if (fitnessGoal == "GAIN_MUSCLE") tdee += 400;

            caloriesTarget = (int)Math.Round(tdee);

            // Macros
            if (fitnessGoal == "LOSE_WEIGHT")
            {
                proteinTarget = weight * 2.2m; // High protein to preserve muscle
                fatTarget = (tdee * 0.3m) / 9m;
                carbsTarget = (tdee - (proteinTarget * 4) - (fatTarget * 9)) / 4m;
            }
            else if (fitnessGoal == "GAIN_MUSCLE")
            {
                proteinTarget = weight * 2.0m;
                fatTarget = (tdee * 0.25m) / 9m;
                carbsTarget = (tdee - (proteinTarget * 4) - (fatTarget * 9)) / 4m;
            }
            else // MAINTAIN
            {
                proteinTarget = weight * 2.0m;
                fatTarget = (tdee * 0.25m) / 9m;
                carbsTarget = (tdee - (proteinTarget * 4) - (fatTarget * 9)) / 4m;
            }

            // Water: ~35ml per kg
            decimal waterMl = weight * 35;
            waterTarget = (int)Math.Round(waterMl / 250m);
        }

        // Get or Create DailyLog
        var log = await _context.DailyNutritionLogs
            .FirstOrDefaultAsync(l => l.UserId == userId && l.LogDate == targetDate);

        // Get Calories Burned for the day
        var workouts = await _context.WorkoutSessions
            .Where(w => w.UserId == userId && w.StartedAt >= targetDate && w.StartedAt < targetDate.AddDays(1))
            .ToListAsync();
            
        decimal caloriesBurned = workouts.Sum(w => w.TotalCaloriesBurned ?? 0);

        if (log == null)
        {
            log = new DailyNutritionLog
            {
                UserId = userId,
                LogDate = targetDate,
                CaloriesTarget = caloriesTarget,
                ProteinTargetGrams = proteinTarget,
                CarbsTargetGrams = carbsTarget,
                FatTargetGrams = fatTarget,
                WaterTargetGlasses = waterTarget,
                CaloriesConsumed = 0,
                ProteinConsumedGrams = 0,
                CarbsConsumedGrams = 0,
                FatConsumedGrams = 0,
                WaterConsumedGlasses = 0,
                CaloriesBurned = caloriesBurned
            };
            _context.DailyNutritionLogs.Add(log);
            await _context.SaveChangesAsync();
        }
        else
        {
            // Update targets in case body metrics changed
            log.CaloriesTarget = caloriesTarget;
            log.ProteinTargetGrams = proteinTarget;
            log.CarbsTargetGrams = carbsTarget;
            log.FatTargetGrams = fatTarget;
            log.WaterTargetGlasses = waterTarget;
            log.CaloriesBurned = caloriesBurned;
            await _context.SaveChangesAsync();
        }

        return MapToSummaryDto(log, hasMetrics, fitnessGoal, user);
    }

    public async Task<DailyNutritionSummaryDto> LogWaterAsync(int userId, DateTime date, LogWaterDto dto)
    {
        var targetDate = date.Date;

        var log = await _context.DailyNutritionLogs
            .FirstOrDefaultAsync(l => l.UserId == userId && l.LogDate == targetDate);

        if (log == null)
        {
            // If log doesn't exist, we must generate it first
            var summary = await GetDailySummaryAsync(userId, date);
            
            // Re-fetch log
            log = await _context.DailyNutritionLogs
                .FirstOrDefaultAsync(l => l.UserId == userId && l.LogDate == targetDate);
        }

        if (log != null)
        {
            log.WaterConsumedGlasses += dto.Glasses;
            // Prevent negative water
            if (log.WaterConsumedGlasses < 0) log.WaterConsumedGlasses = 0;
            await _context.SaveChangesAsync();
        }

        var user = await _context.Users.Include(u => u.BodyMetrics).FirstOrDefaultAsync(u => u.Id == userId);
        bool hasMetrics = user?.BodyMetrics.Any() ?? false;
        string goal = user?.FitnessGoal ?? "MAINTAIN";

        return MapToSummaryDto(log!, hasMetrics, goal, user);
    }

    public async Task<bool> UpdateReminderSettingsAsync(int userId, UpdateReminderSettingsDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return false;

        user.WaterReminderStartTime = dto.StartTime;
        user.WaterReminderEndTime = dto.EndTime;

        await _context.SaveChangesAsync();
        return true;
    }

    private DailyNutritionSummaryDto MapToSummaryDto(DailyNutritionLog log, bool hasMetrics, string fitnessGoal, User? user)
    {
        int calRemaining = log.CaloriesTarget - log.CaloriesConsumed;
        if (calRemaining < 0) calRemaining = 0;

        int netCalories = log.CaloriesConsumed - (int)log.CaloriesBurned;

        int GetPercent(decimal current, decimal target)
        {
            if (target <= 0) return 0;
            int pct = (int)Math.Round((current / target) * 100);
            return pct > 100 ? 100 : pct;
        }

        return new DailyNutritionSummaryDto
        {
            Date = log.LogDate,
            CaloriesTarget = log.CaloriesTarget,
            CaloriesConsumed = log.CaloriesConsumed,
            CaloriesBurned = log.CaloriesBurned,
            CaloriesRemaining = calRemaining,
            NetCalories = netCalories,

            Protein = new MacroSummaryDto
            {
                CurrentGrams = Math.Round(log.ProteinConsumedGrams, 1),
                TargetGrams = Math.Round(log.ProteinTargetGrams, 1),
                Percentage = GetPercent(log.ProteinConsumedGrams, log.ProteinTargetGrams)
            },
            Carbs = new MacroSummaryDto
            {
                CurrentGrams = Math.Round(log.CarbsConsumedGrams, 1),
                TargetGrams = Math.Round(log.CarbsTargetGrams, 1),
                Percentage = GetPercent(log.CarbsConsumedGrams, log.CarbsTargetGrams)
            },
            Fat = new MacroSummaryDto
            {
                CurrentGrams = Math.Round(log.FatConsumedGrams, 1),
                TargetGrams = Math.Round(log.FatTargetGrams, 1),
                Percentage = GetPercent(log.FatConsumedGrams, log.FatTargetGrams)
            },

            WaterTargetGlasses = log.WaterTargetGlasses,
            WaterConsumedGlasses = log.WaterConsumedGlasses,

            HasBodyMetrics = hasMetrics,
            FitnessGoal = fitnessGoal,

            WaterReminderStartTime = user?.WaterReminderStartTime,
            WaterReminderEndTime = user?.WaterReminderEndTime
        };
    }
}
