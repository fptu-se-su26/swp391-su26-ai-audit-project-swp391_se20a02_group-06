namespace FitnessTrainingSystem.Application.Features.WebsiteReviews.DTOs;

public class ReviewEligibilityDto
{
    public bool CanReview { get; set; }
    public bool HasReviewed { get; set; }
    public int CompletedWorkoutCount { get; set; }
    public WebsiteReviewDto? ExistingReview { get; set; }
}
