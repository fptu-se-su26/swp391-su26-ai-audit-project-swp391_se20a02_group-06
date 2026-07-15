using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/upload")]
public class UploadController : ControllerBase
{
    private readonly ICloudinaryService _cloudinaryService;

    public UploadController(ICloudinaryService cloudinaryService)
    {
        _cloudinaryService = cloudinaryService;
    }

    /// <summary>
    /// Uploads a video file to Cloudinary and returns the hosted URL.
    /// </summary>
    [HttpPost("video")]
    [Authorize(Roles = "Admin,ADMIN,PT,PersonalTrainer")]
    [RequestSizeLimit(200_000_000)] // 200 MB limit
    public async Task<IActionResult> UploadVideo(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Please provide a video file." });

        var allowedContentTypes = new[] { "video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo", "video/webm" };
        if (!allowedContentTypes.Contains(file.ContentType.ToLower()))
            return BadRequest(new { message = "Only video files are allowed (mp4, mpeg, mov, avi, webm)." });

        try
        {
            using var stream = file.OpenReadStream();
            var url = await _cloudinaryService.UploadVideoAsync(stream, file.FileName);
            return Ok(new { url });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Video upload failed.", detail = ex.Message });
        }
    }

    /// <summary>
    /// Uploads an image file to Cloudinary and returns the hosted URL.
    /// </summary>
    [HttpPost("image")]
    [Authorize]
    [RequestSizeLimit(10_000_000)] // 10 MB limit
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Please provide an image file." });

        var allowedContentTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
        if (!allowedContentTypes.Contains(file.ContentType.ToLower()))
            return BadRequest(new { message = "Only image files are allowed (jpg, png, gif, webp)." });

        try
        {
            using var stream = file.OpenReadStream();
            var url = await _cloudinaryService.UploadImageAsync(stream, file.FileName);
            return Ok(new { url });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Image upload failed.", detail = ex.Message });
        }
    }
}
