using FitnessTrainingSystem.Application.Features.Nutrition;
using MediatR;
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
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}