using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/membership")]
public class MembershipController : ControllerBase
{
    private readonly IMembershipService _membershipService;

    public MembershipController(IMembershipService membershipService)
    {
        _membershipService = membershipService;
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMySubscription()
    {
        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var sub = await _membershipService.GetCurrentSubscriptionAsync(userId);
        if (sub == null)
            return Ok(new { message = "No active subscription.", packageName = "Free", isActive = false });

        return Ok(sub);
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var subs = await _membershipService.GetAllSubscriptionsAsync();
        return Ok(subs);
    }
}
