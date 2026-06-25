using FitnessTrainingSystem.Application.DTOs.Foods;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IFoodService
{
    Task<IEnumerable<FoodDto>> GetAllAsync();
    Task<FoodDto?> GetByIdAsync(int id);
}
