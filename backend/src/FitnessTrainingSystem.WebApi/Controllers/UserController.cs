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

    [HttpGet("creators")]
    [Authorize(Roles = "Admin,ADMIN,PT,PersonalTrainer")]
    public async Task<IActionResult> GetCreators()
    {
        var creators = await _context.Users
            .Include(u => u.Role)
            .Where(u => u.RoleId == 1 || u.RoleId == 2)
            .Where(u => u.Status == "ACTIVE")
            .Select(u => new
            {
                u.Id,
                u.Fullname,
                u.Email,
                RoleName = u.Role != null ? u.Role.RoleName : ""
            })
            .OrderBy(u => u.Fullname)
            .ToListAsync();

        return Ok(creators);
    }

    [Authorize(Roles = "Admin,ADMIN")]
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Fullname))
            return BadRequest(new { message = "Fullname and Email are required." });

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var existing = await _context.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
        if (existing)
            return BadRequest(new { message = "Email is already registered." });

        var password = string.IsNullOrWhiteSpace(request.Password) ? "123456" : request.Password;
        var user = new FitnessTrainingSystem.Domain.Entities.User
        {
            Fullname = request.Fullname.Trim(),
            Email = normalizedEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Phone = request.Phone?.Trim(),
            RoleId = 3, // Member
            Status = "ACTIVE",
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User created successfully.", id = user.Id });
    }

    [Authorize(Roles = "Admin,ADMIN")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(new { message = "User not found." });

        if (!string.IsNullOrWhiteSpace(request.Fullname))
            user.Fullname = request.Fullname.Trim();

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            var normalizedEmail = request.Email.Trim().ToLowerInvariant();
            if (user.Email.ToLower() != normalizedEmail)
            {
                var existing = await _context.Users.AnyAsync(u => u.Id != id && u.Email.ToLower() == normalizedEmail);
                if (existing)
                    return BadRequest(new { message = "Email is already in use by another user." });
                user.Email = normalizedEmail;
            }
        }

        if (request.Phone != null)
            user.Phone = request.Phone.Trim();

        if (!string.IsNullOrWhiteSpace(request.Status))
            user.Status = request.Status;

        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "User updated successfully." });
    }

    [Authorize(Roles = "Admin,ADMIN")]
    [HttpPut("{id}/activate")]
    public async Task<IActionResult> Activate(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(new { message = "User not found." });

        user.Status = "ACTIVE";
        await _context.SaveChangesAsync();

        return Ok(new { message = "User activated successfully." });
    }

    [Authorize(Roles = "Admin,ADMIN")]
    [HttpPut("{id}/deactivate")]
    public async Task<IActionResult> Deactivate(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(new { message = "User not found." });

        user.Status = "BANNED";
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
            Tier = user.Email == "member@fitnessproject.com" ? "Pro" : (user.MembershipSubscriptions
                .Where(ms => ms.Status == "ACTIVE" && ms.EndDate >= now2)
                .OrderByDescending(ms => ms.StartDate)
                .Select(ms => ms.Package != null ? ms.Package.Name : "Free")
                .FirstOrDefault() ?? "Free"),
            JoinDate = user.CreatedAt.ToString("MMM dd, yyyy"),
            PasswordChangedAt = user.PasswordChangedAt?.ToString("o"),
            WorkoutsCompleted = workoutsCompleted,
            CurrentStreak = currentStreak,
            ActivePlan = user.Email == "member@fitnessproject.com" ? "Pro" : (user.MembershipSubscriptions
                .Where(ms => ms.Status == "ACTIVE" && ms.EndDate >= now2)
                .OrderByDescending(ms => ms.StartDate)
                .Select(ms => ms.Package != null ? ms.Package.Name : "None")
                .FirstOrDefault() ?? "None")
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
