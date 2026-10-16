using System.Security.Claims;
using FitnessTrainingSystem.Application.Features.WebsiteReviews.DTOs;
using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/website-reviews")]
[Authorize]
public class WebsiteReviewsController : ControllerBase
{
    private readonly IWebsiteReviewService _reviewService;

    public WebsiteReviewsController(IWebsiteReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    private int GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                    ?? User.FindFirst("id")?.Value 
                    ?? User.FindFirst("sub")?.Value;

        if (int.TryParse(claim, out var userId))
            return userId;

        throw new UnauthorizedAccessException("Người dùng chưa được xác thực.");
    }

    [HttpGet("public")]
    [AllowAnonymous]
    public async Task<ActionResult<List<WebsiteReviewDto>>> GetPublicReviews()
    {
        try
        {
            var reviews = await _reviewService.GetPublicReviewsAsync();
            return Ok(reviews);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi khi lấy danh sách đánh giá công khai.", error = ex.Message });
        }
    }

    [HttpGet("status")]
    public async Task<ActionResult<ReviewEligibilityDto>> GetReviewStatus()
    {
        try
        {
            var userId = GetCurrentUserId();
            var eligibility = await _reviewService.GetEligibilityAsync(userId);
            return Ok(eligibility);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<WebsiteReviewDto>> SubmitReview([FromBody] CreateWebsiteReviewDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var review = await _reviewService.SubmitReviewAsync(userId, dto);
            return Ok(review);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi hệ thống khi gửi đánh giá.", error = ex.Message });
        }
    }
}
