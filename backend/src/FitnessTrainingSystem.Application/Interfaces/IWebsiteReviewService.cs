using FitnessTrainingSystem.Application.Features.WebsiteReviews.DTOs;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IWebsiteReviewService
{
    Task<ReviewEligibilityDto> GetEligibilityAsync(int userId);
    Task<WebsiteReviewDto> SubmitReviewAsync(int userId, CreateWebsiteReviewDto dto);
    Task<AdminReviewStatsDto> GetAdminReviewsAsync(int? ratingFilter = null, string? search = null);
    Task<bool> ToggleHideReviewAsync(int reviewId);
    Task<bool> DeleteReviewAsync(int reviewId);
}
