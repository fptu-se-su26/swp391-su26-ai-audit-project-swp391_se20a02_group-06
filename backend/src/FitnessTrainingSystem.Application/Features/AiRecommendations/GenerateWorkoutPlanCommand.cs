using MediatR;
using FitnessTrainingSystem.Application.DTOs.Workouts;

namespace FitnessTrainingSystem.Application.Features.AiRecommendations.Commands.GenerateWorkoutPlan;

public class GenerateWorkoutPlanCommand : IRequest<AiWorkoutPlanResponseDto>
{
    public int UserId { get; set; }
    public string MuscleGroup { get; set; } = null!;
    public string? InjuredMuscleGroups { get; set; }
    public int TargetCalories { get; set; }
    public int DurationMinutes { get; set; }
    
    // Thêm trường này để nhận dữ liệu từ Controller đưa vào
    public List<AvailableExerciseDto> AvailableExercises { get; set; } = new();
}