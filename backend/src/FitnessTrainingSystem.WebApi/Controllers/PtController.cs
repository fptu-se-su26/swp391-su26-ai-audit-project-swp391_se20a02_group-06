using FitnessTrainingSystem.Application.DTOs.User;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PtController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PtController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetPTs()
    {
        // RoleId = 2 is PT
        var pts = await _context.Users
            .Where(u => u.RoleId == 2)
            .Include(u => u.PtProfile)
            .Select(u => new PtDto
            {
                Id = u.Id,
                Name = u.Fullname,
                Email = u.Email,
                Rating = u.PtProfile != null ? u.PtProfile.Rating : null,
                Experience = u.PtProfile != null && u.PtProfile.ExperienceYears.HasValue ? $"{u.PtProfile.ExperienceYears.Value} Years" : "-",
                Status = "Active" // Default to Active as there is no Status field yet
            })
            .ToListAsync();

        return Ok(pts);
    }
}
