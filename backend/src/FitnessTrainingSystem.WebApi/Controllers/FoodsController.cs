using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FoodsController : ControllerBase
{
    private readonly IFoodService _foodService;

    public FoodsController(IFoodService foodService)
    {
        _foodService = foodService;
    }

    /// <summary>
    /// Get all foods available for meal planning.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetFoods()
    {
        var foods = await _foodService.GetAllAsync();
        return Ok(foods);
    }

    /// <summary>
    /// Get a single food item by ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetFood(int id)
    {
        var food = await _foodService.GetByIdAsync(id);
        if (food == null) return NotFound();
        return Ok(food);
    }
}
