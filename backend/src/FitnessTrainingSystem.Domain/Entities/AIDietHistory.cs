namespace FitnessTrainingSystem.Domain.Entities;

public class AIDietHistory
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public int? SessionId { get; set; }

    public AIChatSession? Session { get; set; }

    public string DietTitle { get; set; } = string.Empty;

    public int TotalCalories { get; set; }

    public int Protein { get; set; }

    public int Carbs { get; set; }

    public int Fat { get; set; }

    /// <summary>
    /// Maps to "raw_json" column in DB. Stores the full diet plan JSON.
    /// </summary>
    public string DietJson { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}