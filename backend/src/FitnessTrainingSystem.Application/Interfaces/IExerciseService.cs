using FitnessTrainingSystem.Application.DTOs.Exercises;
using FitnessTrainingSystem.Application.DTOs.Workouts;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IExerciseService
{
    Task<IEnumerable<ExerciseDto>> GetAllAsync(int? userId = null, bool? isAdmin = false);
    Task<IEnumerable<ExerciseCatalogDto>> GetCatalogAsync(int? userId = null);
    Task<IEnumerable<ExerciseDto>> GetMyExercisesAsync(int creatorId);
    Task<ExerciseDto?> GetByIdAsync(int id);
    Task<bool> HasAccessAsync(int id, int? userId);
    Task<ExerciseDto> CreateAsync(CreateExerciseDto dto, int createdByUserId);
    Task<bool> UpdateAsync(int id, UpdateExerciseDto dto);
    Task<bool> DeleteAsync(int id);
    Task<List<AvailableExerciseDto>> GetAvailableExercisesByMuscleGroupAsync(string muscleGroup, CancellationToken cancellationToken = default);
}
