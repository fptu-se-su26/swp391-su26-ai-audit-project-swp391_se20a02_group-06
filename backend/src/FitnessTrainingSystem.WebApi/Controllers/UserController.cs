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
            .Where(u => u.RoleId == 3) // Only get Members (RoleId = 3)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Fullname,
                Email = u.Email,
                Plan = "-", // Or map from User plans if applicable
                JoinDate = u.CreatedAt.ToString("MMM dd, yyyy"),
                Status = "Active" // Default to Active as there is no Status field yet
            })
            .ToListAsync();

        return Ok(users);
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var user = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.WorkoutSessions)
            .Include(u => u.MemberSchedules)
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

        var profile = new UserProfileDto
        {
            Name = user.Fullname,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
            Tier = user.Role?.RoleName ?? "Member",
            JoinDate = user.CreatedAt.ToString("MMM dd, yyyy"),
            PasswordChangedAt = user.PasswordChangedAt?.ToString("o"),
            WorkoutsCompleted = workoutsCompleted,
            CurrentStreak = currentStreak,
            ActivePlan = "-" // Update later if plan entity is added
        };

        return Ok(profile);
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto request)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
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
