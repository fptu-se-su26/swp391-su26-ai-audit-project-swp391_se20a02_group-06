using FitnessTrainingSystem.Application.DTOs.Membership;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class MembershipService : IMembershipService
{
    private readonly ApplicationDbContext _context;

    public MembershipService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<MembershipDto?> GetCurrentSubscriptionAsync(int userId)
    {
        var now = DateTime.UtcNow;
        var sub = await _context.MembershipSubscriptions
            .Include(s => s.Package)
            .Include(s => s.User)
            .Where(s => s.UserId == userId && s.Status == "ACTIVE" && s.EndDate >= now)
            .OrderByDescending(s => s.StartDate)
            .FirstOrDefaultAsync();

        if (sub == null) return null;

        return new MembershipDto
        {
            Id = sub.Id,
            UserId = sub.UserId,
            UserName = sub.User?.Fullname,
            UserEmail = sub.User?.Email,
            PackageId = sub.PackageId,
            PackageName = sub.Package?.Name,
            OrderId = sub.OrderId,
            StartDate = sub.StartDate,
            EndDate = sub.EndDate,
            Status = sub.EndDate > now ? sub.Status : "EXPIRED"
        };
    }

    public async Task<IEnumerable<MembershipDto>> GetAllSubscriptionsAsync()
    {
        var now = DateTime.UtcNow;
        return await _context.MembershipSubscriptions
            .Include(s => s.Package)
            .Include(s => s.User)
            .OrderByDescending(s => s.StartDate)
            .Select(s => new MembershipDto
            {
                Id = s.Id,
                UserId = s.UserId,
                UserName = s.User != null ? s.User.Fullname : null,
                UserEmail = s.User != null ? s.User.Email : null,
                PackageId = s.PackageId,
                PackageName = s.Package != null ? s.Package.Name : null,
                OrderId = s.OrderId,
                StartDate = s.StartDate,
                EndDate = s.EndDate,
                Status = s.Status == "ACTIVE" && s.EndDate > now ? "ACTIVE" : "EXPIRED"
            })
            .ToListAsync();
    }
}
