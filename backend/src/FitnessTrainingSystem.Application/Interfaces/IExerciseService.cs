using FitnessTrainingSystem.Application.DTOs.Exercises;
using FitnessTrainingSystem.Application.DTOs.Workouts;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IExerciseService
{
    Task<IEnumerable<ExerciseDto>> GetAllAsync();
    Task<ExerciseDto?> GetByIdAsync(int id);
    Task<ExerciseDto> CreateAsync(CreateExerciseDto dto, int createdByUserId);
    Task<bool> UpdateAsync(int id, UpdateExerciseDto dto);
    Task<bool> DeleteAsync(int id);
    Task<List<AvailableExerciseDto>> GetAvailableExercisesByMuscleGroupAsync(string muscleGroup, CancellationToken cancellationToken = default);
}
