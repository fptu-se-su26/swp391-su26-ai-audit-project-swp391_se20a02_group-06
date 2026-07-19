namespace FitnessTrainingSystem.Domain.Entities;

public class AIChatSession
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public string Title { get; set; } = "Nutrition AI Chat";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<AIChatMessage> Messages { get; set; }
        = new List<AIChatMessage>();
}