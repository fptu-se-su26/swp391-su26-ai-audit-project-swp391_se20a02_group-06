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

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage(
        [FromBody] AIChatRequest request)
    {
        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out var userId))
            return Unauthorized(new { message = "Invalid user identifier." });

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