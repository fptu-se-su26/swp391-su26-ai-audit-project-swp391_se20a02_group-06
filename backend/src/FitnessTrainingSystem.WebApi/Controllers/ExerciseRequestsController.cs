using System.Security.Claims;
using System.Threading.Tasks;
using FitnessTrainingSystem.Application.DTOs.Exercises;
using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/exercise-requests")]
public class ExerciseRequestsController : ControllerBase
{
    private readonly IExerciseRequestService _service;

    public ExerciseRequestsController(IExerciseRequestService service)
    {
        _service = service;
    }

    [HttpPost]
    [Authorize(Roles = "Admin,ADMIN")]
    public async Task<IActionResult> Create([FromBody] CreateExerciseRequestDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int adminId))
        {
            return Unauthorized(new { message = "Invalid user identifier." });
        }

        try
        {
            var result = await _service.CreateRequestAsync(dto, adminId);
            return Ok(result);
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    [Authorize(Roles = "Admin,ADMIN")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllRequestsAsync();
        return Ok(result);
    }

    [HttpGet("my")]
    [Authorize(Roles = "PT,PersonalTrainer,Admin,ADMIN")]
    public async Task<IActionResult> GetMyRequests()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int ptId))
        {
            return Unauthorized(new { message = "Invalid user identifier." });
        }

        var result = await _service.GetRequestsByPtAsync(ptId);
        return Ok(result);
    }

    [HttpPut("{id}/submit")]
    [Authorize(Roles = "PT,PersonalTrainer")]
    public async Task<IActionResult> Submit(int id, [FromBody] PtSubmitExerciseDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int ptId))
        {
            return Unauthorized(new { message = "Invalid user identifier." });
        }

        try
        {
            var result = await _service.SubmitExerciseAsync(id, dto, ptId);
            return Ok(result);
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/review")]
    [Authorize(Roles = "Admin,ADMIN")]
    public async Task<IActionResult> Review(int id, [FromBody] ReviewExerciseRequestDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int adminId))
        {
            return Unauthorized(new { message = "Invalid user identifier." });
        }

        try
        {
            var result = await _service.ReviewRequestAsync(id, dto, adminId);
            return Ok(result);
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
