using FitnessTrainingSystem.Application.DTOs.Nutrition;
using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FitnessTrainingSystem.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class NutritionController : ControllerBase
{
    private readonly INutritionService _nutritionService;

    public NutritionController(INutritionService nutritionService)
    {
        _nutritionService = nutritionService;
    }

    private int GetCurrentUserId()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdString, out var userId))
            return userId;
        throw new UnauthorizedAccessException("User not authenticated.");
    }

    [HttpGet("daily")]
    public async Task<ActionResult<DailyNutritionSummaryDto>> GetDailySummary([FromQuery] DateTime date)
    {
        try
        {
            var userId = GetCurrentUserId();
            var summary = await _nutritionService.GetDailySummaryAsync(userId, date);
            return Ok(summary);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("water")]
    public async Task<ActionResult<DailyNutritionSummaryDto>> LogWater([FromQuery] DateTime date, [FromBody] LogWaterDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();
            var summary = await _nutritionService.LogWaterAsync(userId, date, dto);
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
            var userId = GetCurrentUserId();
            var result = await _nutritionService.UpdateReminderSettingsAsync(userId, dto);
            if (!result) return BadRequest(new { message = "Failed to update reminder settings." });
            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
