using FitnessTrainingSystem.Application.DTOs.PTs;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class PTProfileService : IPTProfileService
{
    private readonly ApplicationDbContext _context;

    public PTProfileService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PTProfileDto?> GetProfileAsync(int userId)
    {
        var user = await _context.Users
            .Include(u => u.PtProfile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return null;

        return new PTProfileDto
        {
            Id = user.Id,
            FullName = user.Fullname,
            Email = user.Email ?? string.Empty,
            AvatarUrl = user.AvatarUrl,
            Bio = user.PtProfile?.Bio,
            ExperienceYears = user.PtProfile?.ExperienceYears,
            SessionRate = user.PtProfile?.SessionRate,
            CoachingPhilosophy = user.PtProfile?.CoachingPhilosophy,
            Rating = user.PtProfile?.Rating
        };
    }

    public async Task<bool> UpdateProfileAsync(int userId, UpdatePTProfileDto dto)
    {
        var user = await _context.Users
            .Include(u => u.PtProfile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return false;

        // Update user-level fields
        if (!string.IsNullOrWhiteSpace(dto.FullName))
            user.Fullname = dto.FullName;

        if (dto.AvatarUrl != null)
            user.AvatarUrl = dto.AvatarUrl;

        // Ensure PtProfile exists
        if (user.PtProfile == null)
        {
            user.PtProfile = new Domain.Entities.PtProfile { UserId = user.Id };
        }

        if (dto.Bio != null)
            user.PtProfile.Bio = dto.Bio;

        if (dto.ExperienceYears.HasValue)
            user.PtProfile.ExperienceYears = dto.ExperienceYears;
            
        if (dto.SessionRate.HasValue)
        {
            if (dto.SessionRate.Value < 2000m)
                throw new Exception("Session rate cannot be less than 2,000 VND.");
            user.PtProfile.SessionRate = dto.SessionRate.Value;
        }

        if (dto.CoachingPhilosophy != null)
            user.PtProfile.CoachingPhilosophy = dto.CoachingPhilosophy;

        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return false;

        if (string.IsNullOrEmpty(user.PasswordHash) ||
            !BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
        {
            return false;
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        user.PasswordChangedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }
}
