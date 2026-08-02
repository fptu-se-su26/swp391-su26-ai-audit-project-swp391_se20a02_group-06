namespace FitnessTrainingSystem.Application.DTOs.Nutrition;

public class AIChatRequest
{
    public int? SessionId { get; set; }
    public string Message { get; set; } = string.Empty;
}
