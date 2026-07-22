using System.IdentityModel.Tokens.Jwt;
using FitnessTrainingSystem.Application.DTOs.Workouts;
using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FitnessTrainingSystem.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class WorkoutsController : ControllerBase
{
    private readonly IWorkoutService _workoutService;

    public WorkoutsController(IWorkoutService workoutService)
    {
        _workoutService = workoutService;
    }

    private int GetCurrentUserId()
    {
        var userIdString = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
            ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdString, out var userId))
            return userId;
        throw new UnauthorizedAccessException("User not authenticated.");
    }

    [HttpPost("plans")]
    public async Task<ActionResult<WorkoutPlanDto>> CreateWorkoutPlan([FromBody] CreateWorkoutPlanDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();
            var plan = await _workoutService.CreateWorkoutPlanAsync(userId, dto);
            return Ok(plan);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("sessions")]
    public async Task<ActionResult<WorkoutSessionDto>> StartSession([FromBody] CreateWorkoutSessionDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();
            var session = await _workoutService.StartSessionAsync(userId, dto);
            return Ok(session);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("sessions/{id}/complete")]
    public async Task<ActionResult<WorkoutSessionDto>> CompleteSession(int id, [FromBody] CompleteWorkoutSessionDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();
            var session = await _workoutService.CompleteSessionAsync(userId, id, dto);
            return Ok(session);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("history")]
    public async Task<ActionResult<IEnumerable<WorkoutSessionDto>>> GetHistory([FromQuery] string filter = "all")
    {
        try
        {
            var userId = GetCurrentUserId();
            var history = await _workoutService.GetUserWorkoutHistoryAsync(userId, filter);
            return Ok(history);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
