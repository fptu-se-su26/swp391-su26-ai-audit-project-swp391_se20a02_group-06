using FitnessTrainingSystem.Application.DTOs.Exercises;

namespace FitnessTrainingSystem.Application.Interfaces
{
    public interface IMuscleGroupService
    {
        Task<IEnumerable<MuscleGroupDto>> GetAllMuscleGroupsAsync();
    }
}
