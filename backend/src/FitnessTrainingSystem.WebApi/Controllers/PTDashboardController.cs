using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitnessTrainingSystem.Domain.Enums;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/pt/dashboard")]
[Authorize(Roles = "PT")]
public class PTDashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PTDashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var ptId))
        {
            return Unauthorized(new { message = "Invalid token or user ID not found." });
        }

        // Get current week boundaries (Monday to Sunday)
        var today = DateTime.UtcNow.Date;
        var diff = today.DayOfWeek == DayOfWeek.Sunday ? 6 : (int)today.DayOfWeek - 1;
        var startOfWeek = today.AddDays(-diff);
        var endOfWeek = startOfWeek.AddDays(7).AddTicks(-1);

        // Sessions this week (Confirmed schedules in current week)
        var sessionsThisWeek = await _context.Schedules
            .CountAsync(s => s.PtId == ptId && s.Status == ScheduleStatus.Confirmed && s.StartTime >= startOfWeek && s.StartTime <= endOfWeek);

        // Active clients (Count of distinct MemberId from all Confirmed schedules for this PT)
        var activeClients = await _context.Schedules
            .Where(s => s.PtId == ptId && s.Status == ScheduleStatus.Confirmed && s.MemberId != null)
            .Select(s => s.MemberId)
            .Distinct()
            .CountAsync();

        return Ok(new
        {
            sessionsThisWeek,
            activeClients
        });
    }
}
