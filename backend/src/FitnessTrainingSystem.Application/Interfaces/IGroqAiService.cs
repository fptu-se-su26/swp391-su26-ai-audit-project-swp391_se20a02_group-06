using FitnessTrainingSystem.Application.DTOs.Nutrition;
using FitnessTrainingSystem.Application.DTOs.Workouts;

namespace FitnessTrainingSystem.Application.Common.Interfaces
{
    public interface IGroqAiService
    {
        Task<DietPlanResponse> GenerateDietPlanAsync(string userInfo, string foodListJson);
        Task<string> ChatAsync(string conversation, string userInfo);
        Task<AiWorkoutPlanResponseDto> GenerateWorkoutPlanAsync(int userId, string muscleGroup, int targetCalories, int durationMinutes, string availableExercisesJson, string? injuredMuscleGroups = null);
        Task<AiWeeklyWorkoutPlanResponseDto> GenerateWeeklyWorkoutPlanAsync(int userId, string muscleGroup, int targetCaloriesPerDay, int durationMinutesPerDay, int frequency, string availableExercisesJson, string? injuredMuscleGroups = null);
    }

    public interface IGroqNutritionAiService : IGroqAiService {}
    public interface IGroqWorkoutAiService : IGroqAiService {}
}
