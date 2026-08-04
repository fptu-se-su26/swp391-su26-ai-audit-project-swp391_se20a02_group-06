using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/membership")]
[Authorize]
public class MembershipController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MembershipController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyMembership()
    {
        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var now = DateTime.UtcNow;
        var activeSub = await _context.MembershipSubscriptions
            .Include(m => m.Package)
            .Where(m => m.UserId == userId && m.Status == "ACTIVE" && m.EndDate >= now)
            .OrderByDescending(m => m.StartDate)
            .FirstOrDefaultAsync();

        if (activeSub == null)
        {
            return Ok(new
            {
                packageName = "Free",
                isActive = false,
                packageId = (int?)null,
                startDate = (DateTime?)null,
                endDate = (DateTime?)null
            });
        }

        return Ok(new
        {
            id = activeSub.Id,
            userId = activeSub.UserId,
            packageId = activeSub.PackageId,
            packageName = activeSub.Package?.Name ?? "Free",
            isActive = true,
            startDate = activeSub.StartDate,
            endDate = activeSub.EndDate
        });
    }
}
