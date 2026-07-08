using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTrainingSystem.WebApi.Controllers
{
    [Route("api/muscle-groups")]
    [ApiController]
    public class MuscleGroupsController : ControllerBase
    {
        private readonly IMuscleGroupService _muscleGroupService;

        public MuscleGroupsController(IMuscleGroupService muscleGroupService)
        {
            _muscleGroupService = muscleGroupService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMuscleGroups()
        {
            var muscleGroups = await _muscleGroupService.GetAllMuscleGroupsAsync();
            return Ok(muscleGroups);
        }
    }
}
