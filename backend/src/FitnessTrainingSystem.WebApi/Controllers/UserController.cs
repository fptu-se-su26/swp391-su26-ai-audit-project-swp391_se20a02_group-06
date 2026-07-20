using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FitnessTrainingSystem.Application.DTOs.Auth;
using FitnessTrainingSystem.Application.DTOs.User;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Where(u => u.RoleId == 3)
            .Include(u => u.MembershipSubscriptions)
                .ThenInclude(ms => ms.Package)
            .ToListAsync();

        var now = DateTime.UtcNow;
        var dtos = users.Select(u =>
        {
            var activeSub = u.MembershipSubscriptions
                .Where(ms => ms.Status == "ACTIVE" && ms.EndDate >= now)
                .OrderByDescending(ms => ms.StartDate)
                .FirstOrDefault();

            return new UserDto
            {
                Id = u.Id,
                Name = u.Fullname,
                Email = u.Email,
                Plan = activeSub?.Package?.Name ?? "Free",
                PlanStartDate = activeSub?.StartDate.ToString("yyyy-MM-dd"),
                PlanEndDate = activeSub?.EndDate.ToString("yyyy-MM-dd"),
                JoinDate = u.CreatedAt.ToString("MMM dd, yyyy"),
                Status = u.Status ?? "ACTIVE",
                AvatarUrl = u.AvatarUrl
            };
        }).ToList();

        return Ok(dtos);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/activate")]
    public async Task<IActionResult> Activate(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(new { message = "User not found." });

        user.Status = "ACTIVE";
        await _context.SaveChangesAsync();

        return Ok(new { message = "User activated successfully." });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/deactivate")]
    public async Task<IActionResult> Deactivate(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(new { message = "User not found." });

        user.Status = "Inactive";
        await _context.SaveChangesAsync();

        return Ok(new { message = "User deactivated successfully." });
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var user = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.WorkoutSessions)
            .Include(u => u.MemberSchedules)
            .Include(u => u.MembershipSubscriptions)
                .ThenInclude(ms => ms.Package)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return NotFound(new { message = "User not found." });

        var workoutsCompleted = user.WorkoutSessions.Count(w => w.Status == "COMPLETED");
        
        // Calculate current streak (simplified: checking recent consecutive days of completed workouts)
        var completedWorkouts = user.WorkoutSessions
            .Where(w => w.Status == "COMPLETED" && w.CompletedAt.HasValue)
            .OrderByDescending(w => w.CompletedAt)
            .Select(w => w.CompletedAt!.Value.Date)
            .Distinct()
            .ToList();

        int currentStreak = 0;
        var today = DateTime.UtcNow.Date;
        
        if (completedWorkouts.Contains(today) || completedWorkouts.Contains(today.AddDays(-1)))
        {
            var checkDate = completedWorkouts.Contains(today) ? today : today.AddDays(-1);
            foreach (var date in completedWorkouts)
            {
                if (date == checkDate)
                {
                    currentStreak++;
                    checkDate = checkDate.AddDays(-1);
                }
                else
                {
                    break;
                }
            }
        }

        var now2 = DateTime.UtcNow;
        var profile = new UserProfileDto
        {
            Name = user.Fullname,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
            Tier = user.MembershipSubscriptions
                .Where(ms => ms.Status == "ACTIVE" && ms.EndDate >= now2)
                .OrderByDescending(ms => ms.StartDate)
                .Select(ms => ms.Package != null ? ms.Package.Name : "Free")
                .FirstOrDefault() ?? "Free",
            JoinDate = user.CreatedAt.ToString("MMM dd, yyyy"),
            PasswordChangedAt = user.PasswordChangedAt?.ToString("o"),
            WorkoutsCompleted = workoutsCompleted,
            CurrentStreak = currentStreak,
            ActivePlan = user.MembershipSubscriptions
                .Where(ms => ms.Status == "ACTIVE" && ms.EndDate >= now2)
                .OrderByDescending(ms => ms.StartDate)
                .Select(ms => ms.Package != null ? ms.Package.Name : "None")
                .FirstOrDefault() ?? "None"
        };

        return Ok(profile);
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto request)
    {
        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return NotFound(new { message = "User not found." });

        // Verify current password
        if (string.IsNullOrEmpty(user.PasswordHash) || !BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
        {
            return BadRequest(new { message = "Incorrect current password." });
        }

        // Update password
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.PasswordChangedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();

        return Ok(new { message = "Password updated successfully." });
    }
}
