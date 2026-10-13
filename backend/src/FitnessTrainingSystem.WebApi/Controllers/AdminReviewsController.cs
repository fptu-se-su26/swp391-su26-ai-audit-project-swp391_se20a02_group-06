using FitnessTrainingSystem.Application.Features.WebsiteReviews.DTOs;
using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/admin/website-reviews")]
[Authorize(Roles = "Admin,ADMIN")]
public class AdminReviewsController : ControllerBase
{
    private readonly IWebsiteReviewService _reviewService;

    public AdminReviewsController(IWebsiteReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet]
    public async Task<ActionResult<AdminReviewStatsDto>> GetReviews(
        [FromQuery] int? ratingFilter,
        [FromQuery] string? search)
    {
        try
        {
            var stats = await _reviewService.GetAdminReviewsAsync(ratingFilter, search);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi khi lấy danh sách đánh giá.", error = ex.Message });
        }
    }

    [HttpPut("{id}/toggle-hide")]
    public async Task<IActionResult> ToggleHideReview(int id)
    {
        try
        {
            var success = await _reviewService.ToggleHideReviewAsync(id);
            if (!success)
            {
                return NotFound(new { message = "Không tìm thấy đánh giá." });
            }
            return Ok(new { message = "Cập nhật trạng thái ẩn/hiện thành công." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi khi cập nhật trạng thái đánh giá.", error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        try
        {
            var success = await _reviewService.DeleteReviewAsync(id);
            if (!success)
            {
                return NotFound(new { message = "Không tìm thấy đánh giá." });
            }
            return Ok(new { message = "Đã xóa đánh giá thành công." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi khi xóa đánh giá.", error = ex.Message });
        }
    }
}
