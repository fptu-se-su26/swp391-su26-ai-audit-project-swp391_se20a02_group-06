using FitnessTrainingSystem.Domain.Common;

namespace FitnessTrainingSystem.Domain.Entities;

public class WebsiteReview : BaseEntity
{
    public int UserId { get; set; }
    public int Rating { get; set; } // 1 - 5 stars
    public string? Comment { get; set; }
    public bool IsHidden { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation property
    public virtual User User { get; set; } = null!;
}
