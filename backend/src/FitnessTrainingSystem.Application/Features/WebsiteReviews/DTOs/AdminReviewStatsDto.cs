namespace FitnessTrainingSystem.Application.Features.WebsiteReviews.DTOs;

public class AdminReviewStatsDto
{
    public int TotalReviews { get; set; }
    public double AverageRating { get; set; }
    public int FiveStarCount { get; set; }
    public int FourStarCount { get; set; }
    public int ThreeStarCount { get; set; }
    public int TwoStarCount { get; set; }
    public int OneStarCount { get; set; }
    public List<WebsiteReviewDto> Reviews { get; set; } = new();
}
