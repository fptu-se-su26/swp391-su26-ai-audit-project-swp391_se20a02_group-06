using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FitnessTrainingSystem.Domain.Enums;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/pt-clients")]
[Authorize(Roles = "PT")]
public class PTClientsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PTClientsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyClients()
    {
        var ptIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(ptIdString) || !int.TryParse(ptIdString, out var ptId))
        {
            return Unauthorized(new { message = "Invalid token or user ID not found." });
        }

        // Find distinct members who have a Confirmed or Completed schedule with this PT
        var clients = await _context.Schedules
            .Where(s => s.PtId == ptId && (s.Status == ScheduleStatus.Confirmed || s.Status == ScheduleStatus.Completed))
            .Include(s => s.Member)
            .ThenInclude(m => m.MembershipSubscriptions)
            .Select(s => s.Member)
            .Distinct()
            .Select(u => new
            {
                u.Id,
                Name = u.Fullname,
                u.Email,
                Plan = u.MembershipSubscriptions.FirstOrDefault(sub => sub.Status == "ACTIVE") != null 
                    ? u.MembershipSubscriptions.FirstOrDefault(sub => sub.Status == "ACTIVE").Package.Name 
                    : "Free",
                PlanStartDate = u.MembershipSubscriptions.FirstOrDefault(sub => sub.Status == "ACTIVE") != null 
                    ? u.MembershipSubscriptions.FirstOrDefault(sub => sub.Status == "ACTIVE").StartDate.ToString("yyyy-MM-dd") 
                    : null,
                PlanEndDate = u.MembershipSubscriptions.FirstOrDefault(sub => sub.Status == "ACTIVE") != null 
                    ? u.MembershipSubscriptions.FirstOrDefault(sub => sub.Status == "ACTIVE").EndDate.ToString("yyyy-MM-dd") 
                    : null,
                JoinDate = u.CreatedAt.ToString("yyyy-MM-dd")
            })
            .ToListAsync();

        return Ok(clients);
    }
}
