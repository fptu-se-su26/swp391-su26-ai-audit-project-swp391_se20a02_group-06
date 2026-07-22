using System.IdentityModel.Tokens.Jwt;
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

    private int GetUserId()
    {
        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                        ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
                        ?? User.FindFirst("sub")?.Value
                        ?? User.FindFirst("id")?.Value;

        if (!int.TryParse(userIdString, out var userId))
            throw new UnauthorizedAccessException("Invalid user identifier.");

        return userId;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage(
        [FromBody] AIChatRequest request)
    {
        int userId;
        try
        {
            userId = GetUserId();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }

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

    [HttpGet("diet-history")]
    public async Task<IActionResult> GetDietHistory()
    {
        int userId;
        try
        {
            userId = GetUserId();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }

        var result = await _chatService.GetDietHistoriesAsync(userId);
        return Ok(result);
    }
}