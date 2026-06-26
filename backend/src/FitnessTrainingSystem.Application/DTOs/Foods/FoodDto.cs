namespace FitnessTrainingSystem.Application.DTOs.Foods;

public class FoodDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ServingSize { get; set; }
    public string? Unit { get; set; }
    public int Calories { get; set; }
    public decimal Protein { get; set; }
    public decimal Carbs { get; set; }
    public decimal Fat { get; set; }
    public string? ImageUrl { get; set; }
}
