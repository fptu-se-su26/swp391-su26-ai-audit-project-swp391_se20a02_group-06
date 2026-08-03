using System.Security.Claims;
using System.Threading.Tasks;
using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _service;

    public NotificationsController(INotificationService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyNotifications()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId))
        {
            return Unauthorized(new { message = "Invalid user identifier." });
        }

        var result = await _service.GetUserNotificationsAsync(userId);
        return Ok(result);
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId))
        {
            return Unauthorized(new { message = "Invalid user identifier." });
        }

        var success = await _service.MarkAsReadAsync(id, userId);
        if (!success) return BadRequest(new { message = "Failed to mark notification as read." });

        return Ok(new { success = true });
    }

    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId))
        {
            return Unauthorized(new { message = "Invalid user identifier." });
        }

        var success = await _service.MarkAllAsReadAsync(userId);
        return Ok(new { success = true });
    }

    [HttpPost("test-water-reminder")]
    [Authorize(Roles = "Member,MEMBER")]
    public async Task<IActionResult> TriggerTestWaterReminder()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId))
        {
            return Unauthorized(new { message = "Invalid user identifier." });
        }

        var result = await _service.SendNotificationAsync(
            userId,
            "Time to Drink Water! 🥛",
            "Keep your body hydrated! Drink a glass of water now. Click here to log it instantly.",
            "WATER_REMINDER"
        );

        return Ok(result);
    }
}
