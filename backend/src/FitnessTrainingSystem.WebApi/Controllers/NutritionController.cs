using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FitnessTrainingSystem.Application.DTOs.Nutrition;
using FitnessTrainingSystem.Application.Features.Nutrition;
using FitnessTrainingSystem.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTrainingSystem.WebApi.Controllers;

public record GenerateDietPlanRequest(string UserRequest);

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NutritionController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly INutritionService _nutritionService;

    public NutritionController(IMediator mediator, INutritionService nutritionService)
    {
        _mediator = mediator;
        _nutritionService = nutritionService;
    }

    private int GetUserId()
    {
        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId))
            throw new UnauthorizedAccessException("Invalid user identifier.");
        return userId;
    }

    [HttpGet("daily")]
    public async Task<IActionResult> GetDailySummary([FromQuery] string date)
    {
        try
        {
            var userId = GetUserId();
            var parsedDate = DateTime.Parse(date);
            var summary = await _nutritionService.GetDailySummaryAsync(userId, parsedDate);
            return Ok(summary);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("water")]
    public async Task<IActionResult> LogWater([FromQuery] string date, [FromBody] LogWaterDto dto)
    {
        try
        {
            var userId = GetUserId();
            var parsedDate = DateTime.Parse(date);
            var summary = await _nutritionService.LogWaterAsync(userId, parsedDate, dto);
            return Ok(summary);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("reminder-settings")]
    public async Task<IActionResult> UpdateReminderSettings([FromBody] UpdateReminderSettingsDto dto)
    {
        try
        {
            var userId = GetUserId();
            var result = await _nutritionService.UpdateReminderSettingsAsync(userId, dto);
            return Ok(new { success = result });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("generate-diet-plan")]
    public async Task<IActionResult> GenerateDietPlan([FromBody] GenerateDietPlanRequest request)
    {
        try
        {
            var userId = GetUserId();
            var command = new CreateDietPlanCommand(userId, request.UserRequest);
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(502, new { detail = "AI service temporarily unavailable: " + ex.Message });
        }
    }
}