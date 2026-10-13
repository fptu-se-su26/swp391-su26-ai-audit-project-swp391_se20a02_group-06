namespace FitnessTrainingSystem.Application.Features.WebsiteReviews.DTOs;

public class WebsiteReviewDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Fullname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public bool IsHidden { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
