using FitnessTrainingSystem.Application.DTOs.User;
using FitnessTrainingSystem.Infrastructure.Persistence;
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
                JoinDate = u.CreatedAt.HasValue ? u.CreatedAt.Value.ToString("MMM dd, yyyy") : "-",
                Status = "Active" // Default to Active as there is no Status field yet
            })
            .ToListAsync();

        return Ok(users);
    }
}
