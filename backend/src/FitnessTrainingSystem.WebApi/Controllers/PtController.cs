using FitnessTrainingSystem.Application.DTOs.PTs;
using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PtController : ControllerBase
{
    private readonly IPtService _ptService;

    public PtController(IPtService ptService)
    {
        _ptService = ptService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPTs()
    {
        var pts = await _ptService.GetAllAsync();
        return Ok(pts);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreatePt([FromBody] CreatePtRequestDto dto)
    {
        try
        {
            var pt = await _ptService.CreateAsync(dto);
            return Ok(pt);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/activate")]
    public async Task<IActionResult> ActivatePt(int id)
    {
        var result = await _ptService.ActivateAsync(id);
        if (!result) return NotFound();
        return Ok(new { message = "PT activated successfully" });
    }

    [HttpPut("{id}/deactivate")]
    public async Task<IActionResult> DeactivatePt(int id)
    {
        var result = await _ptService.DeactivateAsync(id);
        if (!result) return NotFound();
        return Ok(new { message = "PT deactivated successfully" });
    }
}
