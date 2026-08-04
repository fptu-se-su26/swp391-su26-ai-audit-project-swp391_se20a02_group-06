using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FitnessTrainingSystem.Application.DTOs.Exercises;
using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/exercises")]
public class ExercisesController : ControllerBase
{
    private readonly IExerciseService _exerciseService;

    public ExercisesController(IExerciseService exerciseService)
    {
        _exerciseService = exerciseService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        int? userId = null;
        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(userIdString) && int.TryParse(userIdString, out var uid))
        {
            userId = uid;
        }
        var isAdmin = User.IsInRole("Admin") || User.IsInRole("ADMIN");
        var exercises = await _exerciseService.GetAllAsync(userId, isAdmin);
        return Ok(exercises);
    }

    [HttpGet("my")]
    [Authorize(Roles = "Admin,ADMIN,PT,PersonalTrainer")]
    public async Task<IActionResult> GetMyExercises()
    {
        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId))
        {
            return Unauthorized(new { message = "Invalid user identifier." });
        }

        var exercises = await _exerciseService.GetMyExercisesAsync(userId);
        return Ok(exercises);
    }

    [HttpGet("catalog")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCatalog()
    {
        int? userId = null;
        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(userIdString) && int.TryParse(userIdString, out var uid))
        {
            userId = uid;
        }
        var catalog = await _exerciseService.GetCatalogAsync(userId);
        return Ok(catalog);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        int? userId = null;
        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(userIdString) && int.TryParse(userIdString, out var uid))
        {
            userId = uid;
        }

        var hasAccess = await _exerciseService.HasAccessAsync(id, userId);
        if (!hasAccess)
            return StatusCode(403, new { message = "This exercise requires a higher plan. Please upgrade to access it." });

        var exercise = await _exerciseService.GetByIdAsync(id);
        if (exercise == null) return NotFound(new { message = "Exercise not found." });

        return Ok(exercise);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,ADMIN,PT,PersonalTrainer")]
    public async Task<IActionResult> Create([FromBody] CreateExerciseDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId))
        {
            return Unauthorized(new { message = "Invalid user identifier." });
        }

        // Drafts are PT-exclusive: admins always publish immediately
        var isAdmin = User.IsInRole("Admin") || User.IsInRole("ADMIN");
        if (isAdmin) dto.IsDraft = false;

        var createdExercise = await _exerciseService.CreateAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = createdExercise.Id }, createdExercise);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,ADMIN,PT,PersonalTrainer")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateExerciseDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _exerciseService.UpdateAsync(id, dto);
        if (!result) return NotFound(new { message = "Exercise not found." });

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,ADMIN,PT,PersonalTrainer")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _exerciseService.DeleteAsync(id);
        if (!result) return NotFound(new { message = "Exercise not found." });

        return NoContent();
    }
}
