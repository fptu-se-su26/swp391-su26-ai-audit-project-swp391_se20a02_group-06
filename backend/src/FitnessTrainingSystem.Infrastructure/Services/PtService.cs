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
            Status = u.Status ?? "Inactive"
        });
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
