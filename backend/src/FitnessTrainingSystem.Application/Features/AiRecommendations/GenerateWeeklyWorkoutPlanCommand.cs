using MediatR;
using FitnessTrainingSystem.Application.DTOs.Workouts;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Application.Features.AiRecommendations.Commands.GenerateWeeklyWorkoutPlan;

public class GenerateWeeklyWorkoutPlanCommand : IRequest<AiWeeklyWorkoutPlanResponseDto>
{
    public int UserId { get; set; }
    public string MuscleGroup { get; set; } = null!;
    public string? InjuredMuscleGroups { get; set; }
    public int TargetCaloriesPerDay { get; set; }
    public int DurationMinutesPerDay { get; set; }
    public int Frequency { get; set; }
    public List<AvailableExerciseDto> AvailableExercises { get; set; } = new();
}
