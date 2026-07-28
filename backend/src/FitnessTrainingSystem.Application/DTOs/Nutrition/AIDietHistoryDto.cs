using System;
using System.Text.Json.Serialization;

namespace FitnessTrainingSystem.Application.DTOs.Nutrition;

public class AIDietHistoryDto
{
    public int Id { get; set; }
    public int? SessionId { get; set; }
    public string DietTitle { get; set; } = string.Empty;
    public int TotalCalories { get; set; }
    public int Protein { get; set; }
    public int Carbs { get; set; }
    public int Fat { get; set; }
    
    [JsonIgnore] 
    public string DietJson { get; set; } = string.Empty;
    
    public DietPlanResponse? DietPlan { get; set; }
    
    public DateTime CreatedAt { get; set; }
}
