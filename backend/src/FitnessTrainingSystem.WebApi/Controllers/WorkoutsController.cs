using FitnessTrainingSystem.Application.DTOs.Workouts;
using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using MediatR;
using FitnessTrainingSystem.Application.Features.AiRecommendations.Commands.GenerateWorkoutPlan;
using FitnessTrainingSystem.Application.Features.AiRecommendations.Commands.GenerateWeeklyWorkoutPlan;

namespace FitnessTrainingSystem.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]


public class WorkoutsController : ControllerBase
{
    private readonly IWorkoutService _workoutService;
    private readonly IMediator _mediator;
    private readonly IProductPackageService _packageService;

    public WorkoutsController(IWorkoutService workoutService, IMediator mediator, IProductPackageService packageService)
    {
        _workoutService = workoutService;
        _mediator = mediator;
        _packageService = packageService;
    }

    private int GetCurrentUserId()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdString, out var userId))
            return userId;
        throw new UnauthorizedAccessException("User not authenticated.");
    }
    [HttpPost("ai-generate")]
    public async Task<ActionResult<AiWorkoutPlanResponseDto>> GenerateWorkoutPlan([FromBody] GenerateWorkoutPlanRequestDto dto)
    {
        try
        {
            int userId = GetCurrentUserId();

            var command = new GenerateWorkoutPlanCommand
            {
                UserId = userId,
                MuscleGroup = dto.MuscleGroup,
                InjuredMuscleGroups = dto.InjuredMuscleGroups,
                TargetCalories = dto.TargetCalories,
                DurationMinutes = dto.DurationMinutes
            };
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    [HttpGet("weekly-access")]
    public async Task<IActionResult> GetWeeklyAccess()
    {
        try
        {
            var userId = GetCurrentUserId();
            var (hasAccess, requiredPackageName) = await _packageService.GetWeeklyPlanAccessAsync(userId);
            return Ok(new { hasAccess, requiredPackageName });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("ai-generate-weekly")]
    public async Task<ActionResult<AiWeeklyWorkoutPlanResponseDto>> GenerateWeeklyWorkoutPlan([FromBody] GenerateWeeklyWorkoutPlanRequestDto dto)
    {
        try
        {
            int userId = GetCurrentUserId();

            var command = new GenerateWeeklyWorkoutPlanCommand
            {
                UserId = userId,
                MuscleGroup = dto.MuscleGroup,
                InjuredMuscleGroups = dto.InjuredMuscleGroups,
                TargetCaloriesPerDay = dto.TargetCaloriesPerDay,
                DurationMinutesPerDay = dto.DurationMinutesPerDay,
                Frequency = dto.Frequency
            };
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
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
    public async Task<ActionResult<IEnumerable<WorkoutSessionDto>>> GetHistory()
    {
        try
        {
            var userId = GetCurrentUserId();
            var history = await _workoutService.GetUserWorkoutHistoryAsync(userId);
            return Ok(history);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
