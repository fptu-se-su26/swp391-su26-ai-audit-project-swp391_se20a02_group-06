using FitnessTrainingSystem.Application.DTOs.Nutrition;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface INutritionService
{
    /// <summary>
    /// Get daily nutrition summary for a user on a specific date.
    /// Auto-creates a DailyNutritionLog if one doesn't exist for that date.
    /// </summary>
    Task<DailyNutritionSummaryDto> GetDailySummaryAsync(int userId, DateTime date);

    /// <summary>
    /// Log water intake for a user on a specific date.
    /// </summary>
    Task<DailyNutritionSummaryDto> LogWaterAsync(int userId, DateTime date, LogWaterDto dto);

    /// <summary>
    /// Update water reminder start and end times for a user.
    /// </summary>
    Task<bool> UpdateReminderSettingsAsync(int userId, UpdateReminderSettingsDto dto);
}
