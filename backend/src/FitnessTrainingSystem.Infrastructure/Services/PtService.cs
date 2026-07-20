using FitnessTrainingSystem.Application.DTOs.PTs;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class PtService : IPtService
{
    private readonly ApplicationDbContext _context;

    public PtService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PtDto>> GetAllAsync()
    {
        var pts = await _context.Users
            .Include(u => u.PtProfile)
            .Include(u => u.Role)
            .Where(u => u.PtProfile != null || (u.Role != null && u.Role.RoleName == "PT"))
            .ToListAsync();

        return pts.Select(u => new PtDto
        {
            Id = u.Id,
            Name = u.Fullname,
            Email = u.Email,
            Rating = u.PtProfile?.Rating,
            Experience = u.PtProfile?.ExperienceYears != null ? $"{u.PtProfile.ExperienceYears} years" : "N/A",
            Status = u.Status ?? "Inactive",
            AvatarUrl = u.AvatarUrl
        });
    }

    public async Task<PtDto> CreateAsync(CreatePtRequestDto dto)
    {
        var existing = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (existing != null)
            throw new Exception("A user with this email already exists.");

        var user = new Domain.Entities.User
        {
            Fullname = dto.Fullname,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Phone = dto.Phone,
            RoleId = 2
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        if (dto.ExperienceYears.HasValue)
        {
            var profile = new Domain.Entities.PtProfile
            {
                UserId = user.Id,
                ExperienceYears = dto.ExperienceYears
            };
            _context.Set<Domain.Entities.PtProfile>().Add(profile);
            await _context.SaveChangesAsync();
        }

        return new PtDto
        {
            Id = user.Id,
            Name = user.Fullname,
            Email = user.Email,
            Rating = null,
            Experience = dto.ExperienceYears.HasValue ? $"{dto.ExperienceYears} years" : "N/A",
            Status = "ACTIVE",
            AvatarUrl = user.AvatarUrl
        };
    }

    public async Task<bool> ActivateAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        user.Status = "ACTIVE";
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeactivateAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        user.Status = "Inactive";
        await _context.SaveChangesAsync();
        return true;
    }
}
