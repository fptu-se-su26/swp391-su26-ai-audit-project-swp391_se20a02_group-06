using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FitnessTrainingSystem.Application.DTOs.BodyMetric;
using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BodyMetricsController : ControllerBase
{
    private readonly IBodyMetricService _bodyMetricService;

    public BodyMetricsController(IBodyMetricService bodyMetricService)
    {
        _bodyMetricService = bodyMetricService;
    }

    [HttpGet("latest")]
    public async Task<IActionResult> GetLatestMetric()
    {
        var userIdString = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
        {
            return Unauthorized();
        }

        var metric = await _bodyMetricService.GetLatestMetricByUserIdAsync(userId);
        if (metric == null)
        {
            return NotFound(new { message = "No body metrics found for this user." });
        }

        return Ok(metric);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllMetrics()
    {
        var userIdString = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
        {
            return Unauthorized();
        }

        var metrics = await _bodyMetricService.GetMetricsByUserIdAsync(userId);
        return Ok(metrics);
    }

    [HttpPost]
    public async Task<IActionResult> AddMetric([FromBody] CreateBodyMetricDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userIdString = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
        {
            return Unauthorized();
        }

        try
        {
            var result = await _bodyMetricService.AddMetricAsync(userId, dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
