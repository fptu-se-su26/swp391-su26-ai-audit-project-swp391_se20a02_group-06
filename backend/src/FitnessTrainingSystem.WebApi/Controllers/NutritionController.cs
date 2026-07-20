using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FitnessTrainingSystem.Application.Features.Nutrition;
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

    public NutritionController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("generate-diet-plan")]
    public async Task<IActionResult> GenerateDietPlan([FromBody] GenerateDietPlanRequest request)
    {
        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId))
            return Unauthorized(new { message = "Invalid user identifier." });

        var command = new CreateDietPlanCommand(userId, request.UserRequest);
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}