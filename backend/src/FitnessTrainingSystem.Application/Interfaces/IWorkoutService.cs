using System.Collections.Generic;
using System.Threading.Tasks;
using FitnessTrainingSystem.Application.DTOs.Workouts;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IWorkoutService
{
    Task<WorkoutPlanDto> CreateWorkoutPlanAsync(int userId, CreateWorkoutPlanDto dto);
    Task<WorkoutSessionDto> StartSessionAsync(int userId, CreateWorkoutSessionDto dto);
    Task<WorkoutSessionDto> CompleteSessionAsync(int userId, int sessionId, CompleteWorkoutSessionDto dto);
    Task<IEnumerable<WorkoutSessionDto>> GetUserWorkoutHistoryAsync(int userId, string filter = "all");
}
