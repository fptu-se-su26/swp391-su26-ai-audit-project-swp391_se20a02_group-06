using FitnessTrainingSystem.Application.DTOs.Foods;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class FoodService : IFoodService
{
    private readonly ApplicationDbContext _context;

    public FoodService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<FoodDto>> GetAllAsync()
    {
        var foods = await _context.Foods.ToListAsync();

        return foods.Select(f => new FoodDto
        {
            Id = f.Id,
            Name = f.Name,
            ServingSize = f.ServingSize,
            Unit = f.Unit,
            Calories = f.Calories,
            Protein = f.Protein,
            Carbs = f.Carbs,
            Fat = f.Fat,
            ImageUrl = f.ImageUrl
        });
    }

    public async Task<FoodDto?> GetByIdAsync(int id)
    {
        var f = await _context.Foods.FindAsync(id);
        if (f == null) return null;

        return new FoodDto
        {
            Id = f.Id,
            Name = f.Name,
            ServingSize = f.ServingSize,
            Unit = f.Unit,
            Calories = f.Calories,
            Protein = f.Protein,
            Carbs = f.Carbs,
            Fat = f.Fat,
            ImageUrl = f.ImageUrl
        };
    }
}
