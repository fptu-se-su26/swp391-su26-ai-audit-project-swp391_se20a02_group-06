using FitnessTrainingSystem.Application.Features.WebsiteReviews.DTOs;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Domain.Entities;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class WebsiteReviewService : IWebsiteReviewService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<WebsiteReviewService> _logger;

    public WebsiteReviewService(ApplicationDbContext context, ILogger<WebsiteReviewService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<ReviewEligibilityDto> GetEligibilityAsync(int userId)
    {
        var existingReview = await _context.WebsiteReviews
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.UserId == userId);

        var completedWorkoutCount = await _context.WorkoutSessions
            .CountAsync(w => w.UserId == userId && (w.Status == "Completed" || w.CompletedAt != null));

        var hasReviewed = existingReview != null;
        var canReview = completedWorkoutCount >= 1 && !hasReviewed;

        return new ReviewEligibilityDto
        {
            CanReview = canReview,
            HasReviewed = hasReviewed,
            CompletedWorkoutCount = completedWorkoutCount,
            ExistingReview = existingReview != null ? MapToDto(existingReview) : null
        };
    }

    public async Task<WebsiteReviewDto> SubmitReviewAsync(int userId, CreateWebsiteReviewDto dto)
    {
        if (dto.Rating < 1 || dto.Rating > 5)
        {
            throw new ArgumentException("Số sao đánh giá phải từ 1 đến 5.");
        }

        var existingReview = await _context.WebsiteReviews
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (existingReview != null)
        {
            throw new InvalidOperationException("Bạn đã gửi đánh giá rồi. Mỗi tài khoản chỉ được đánh giá 1 lần duy nhất.");
        }

        var completedWorkoutCount = await _context.WorkoutSessions
            .CountAsync(w => w.UserId == userId && (w.Status == "Completed" || w.CompletedAt != null));

        if (completedWorkoutCount < 1)
        {
            throw new InvalidOperationException("Bạn cần hoàn thành ít nhất 1 buổi tập để có thể đánh giá trải nghiệm.");
        }

        var user = await _context.Users.FindAsync(userId) 
            ?? throw new KeyNotFoundException("Không tìm thấy thông tin người dùng.");

        var review = new WebsiteReview
        {
            UserId = userId,
            Rating = dto.Rating,
            Comment = dto.Comment?.Trim(),
            IsHidden = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.WebsiteReviews.Add(review);
        await _context.SaveChangesAsync();

        _logger.LogInformation("User {UserId} submitted a {Rating}-star website review.", userId, dto.Rating);

        review.User = user;
        return MapToDto(review);
    }

    public async Task<AdminReviewStatsDto> GetAdminReviewsAsync(int? ratingFilter = null, string? search = null)
    {
        var allReviews = await _context.WebsiteReviews
            .Include(r => r.User)
            .ToListAsync();

        var totalCount = allReviews.Count;
        var avgRating = totalCount > 0 ? Math.Round(allReviews.Average(r => r.Rating), 1) : 5.0;

        var fiveCount = allReviews.Count(r => r.Rating == 5);
        var fourCount = allReviews.Count(r => r.Rating == 4);
        var threeCount = allReviews.Count(r => r.Rating == 3);
        var twoCount = allReviews.Count(r => r.Rating == 2);
        var oneCount = allReviews.Count(r => r.Rating == 1);

        var query = allReviews.AsEnumerable();

        if (ratingFilter.HasValue && ratingFilter.Value >= 1 && ratingFilter.Value <= 5)
        {
            query = query.Where(r => r.Rating == ratingFilter.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(r => 
                (r.User != null && (r.User.Fullname.ToLower().Contains(term) || r.User.Email.ToLower().Contains(term))) ||
                (!string.IsNullOrEmpty(r.Comment) && r.Comment.ToLower().Contains(term))
            );
        }

        var filteredList = query
            .OrderByDescending(r => r.CreatedAt)
            .Select(MapToDto)
            .ToList();

        return new AdminReviewStatsDto
        {
            TotalReviews = totalCount,
            AverageRating = avgRating,
            FiveStarCount = fiveCount,
            FourStarCount = fourCount,
            ThreeStarCount = threeCount,
            TwoStarCount = twoCount,
            OneStarCount = oneCount,
            Reviews = filteredList
        };
    }

    public async Task<bool> ToggleHideReviewAsync(int reviewId)
    {
        var review = await _context.WebsiteReviews.FindAsync(reviewId);
        if (review == null) return false;

        review.IsHidden = !review.IsHidden;
        review.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        _logger.LogInformation("Review {ReviewId} visibility toggled to IsHidden={IsHidden}.", reviewId, review.IsHidden);
        return true;
    }

    public async Task<bool> DeleteReviewAsync(int reviewId)
    {
        var review = await _context.WebsiteReviews.FindAsync(reviewId);
        if (review == null) return false;

        _context.WebsiteReviews.Remove(review);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Review {ReviewId} was deleted by Admin.", reviewId);
        return true;
    }

    public async Task<List<WebsiteReviewDto>> GetPublicReviewsAsync()
    {
        var publicReviews = await _context.WebsiteReviews
            .Include(r => r.User)
            .Where(r => !r.IsHidden && r.Rating >= 4)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return publicReviews.Select(MapToDto).ToList();
    }

    private static WebsiteReviewDto MapToDto(WebsiteReview r)
    {
        return new WebsiteReviewDto
        {
            Id = r.Id,
            UserId = r.UserId,
            Fullname = r.User?.Fullname ?? "Ẩn danh",
            Email = r.User?.Email ?? string.Empty,
            AvatarUrl = r.User?.AvatarUrl,
            Rating = r.Rating,
            Comment = r.Comment,
            IsHidden = r.IsHidden,
            CreatedAt = r.CreatedAt,
            UpdatedAt = r.UpdatedAt
        };
    }
}
