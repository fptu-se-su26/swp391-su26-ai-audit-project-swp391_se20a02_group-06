using FitnessTrainingSystem.Application.DTOs.Nutrition;
using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]

public class AIChatController : ControllerBase
{
    private readonly IAIChatService _chatService;

    public AIChatController(IAIChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage(
        [FromBody] AIChatRequest request)
    {
        var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized(new { message = "Invalid token: user ID not found." });

        var result = await _chatService.SendMessageAsync(
            userId,
            request);

        return Ok(result);
    }
    [HttpGet("{sessionId}")]
public async Task<IActionResult> GetMessages(int sessionId)
{
    var result = await _chatService.GetMessagesAsync(sessionId);
    return Ok(result);
}
}