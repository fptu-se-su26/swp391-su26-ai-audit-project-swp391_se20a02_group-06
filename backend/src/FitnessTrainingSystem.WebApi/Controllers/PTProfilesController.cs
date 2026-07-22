using System.Security.Claims;
using FitnessTrainingSystem.Application.DTOs.PTs;
using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/pt/profile")]
[Authorize(Roles = "PT")]
public class PTProfilesController : ControllerBase
{
    private readonly IPTProfileService _ptProfileService;

    public PTProfilesController(IPTProfileService ptProfileService)
    {
        _ptProfileService = ptProfileService;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var profile = await _ptProfileService.GetProfileAsync(userId);
        if (profile == null)
            return NotFound(new { message = "PT Profile not found." });

        return Ok(profile);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdatePTProfileDto dto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        // If password change requested
        if (!string.IsNullOrWhiteSpace(dto.NewPassword))
        {
            if (string.IsNullOrWhiteSpace(dto.CurrentPassword))
                return BadRequest(new { message = "Current password is required to set a new password." });

            var passwordChanged = await _ptProfileService.ChangePasswordAsync(userId, dto.CurrentPassword, dto.NewPassword);
            if (!passwordChanged)
                return BadRequest(new { message = "Incorrect current password." });
        }

        var result = await _ptProfileService.UpdateProfileAsync(userId, dto);
        if (!result)
            return NotFound(new { message = "PT Profile not found." });

        return Ok(new { message = "Profile updated successfully." });
    }
}
