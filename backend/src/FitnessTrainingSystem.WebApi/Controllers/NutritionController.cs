using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FitnessTrainingSystem.Application.Features.Nutrition;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class NutritionController : ControllerBase
{
    private readonly IMediator _mediator;

    public NutritionController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("generate-diet-plan")]
    public async Task<IActionResult> GenerateDietPlan([FromBody] CreateDietPlanCommand command)
    {
        
        var userId = 1; 

        // Khởi tạo lại command với UserId cố định vừa gán
        var authenticatedCommand = command with { UserId = userId }; //
        var result = await _mediator.Send(authenticatedCommand); //
        return Ok(result); //
    }
}