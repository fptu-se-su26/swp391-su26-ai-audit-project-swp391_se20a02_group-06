using FitnessTrainingSystem.Application.DTOs.Dashboard;
using FitnessTrainingSystem.Application.DTOs.Payments;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "Admin")]
public class AdminDashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminDashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        var now = DateTime.UtcNow;
        var firstOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var twelveMonthsAgo = firstOfMonth.AddMonths(-11);

        var totalUsers = await _context.Users.CountAsync();

        var newUsersThisMonth = await _context.Users
            .CountAsync(u => u.CreatedAt >= firstOfMonth);

        var activeSubs = await _context.MembershipSubscriptions
            .CountAsync(s => s.Status == "ACTIVE" && s.EndDate >= now);

        var expiredSubs = await _context.MembershipSubscriptions
            .CountAsync(s => s.Status == "CANCELLED" || (s.Status == "ACTIVE" && s.EndDate < now));

        var subRate = totalUsers > 0 ? Math.Round((double)activeSubs / totalUsers * 100, 1) : 0;

        var totalRevenue = await _context.Payments
            .Where(p => p.Status == "SUCCESS" && p.PaymentMethod == "PayOs")
            .SumAsync(p => p.Amount);

        var revenueThisMonth = await _context.Payments
            .Where(p => p.Status == "SUCCESS" && p.PaymentMethod == "PayOs" && p.PaidAt >= firstOfMonth)
            .SumAsync(p => p.Amount);

        var monthlyRevenueRaw = await _context.Payments
            .Where(p => p.Status == "SUCCESS" && p.PaymentMethod == "PayOs" && p.PaidAt >= twelveMonthsAgo)
            .GroupBy(p => new { Year = p.PaidAt!.Value.Year, Month = p.PaidAt.Value.Month })
            .Select(g => new { g.Key.Year, g.Key.Month, Amount = g.Sum(p => p.Amount) })
            .OrderBy(m => m.Year).ThenBy(m => m.Month)
            .ToListAsync();

        var fullMonthlyRevenue = new List<MonthlyValueDto>();
        for (int i = 0; i < 12; i++)
        {
            var dt = twelveMonthsAgo.AddMonths(i);
            var matched = monthlyRevenueRaw.FirstOrDefault(r => r.Year == dt.Year && r.Month == dt.Month);
            fullMonthlyRevenue.Add(new MonthlyValueDto
            {
                Month = dt.Year + "-" + dt.Month.ToString("D2"),
                Amount = matched?.Amount ?? 0
            });
        }

        var monthlyUsersRaw = await _context.Users
            .Where(u => u.CreatedAt >= twelveMonthsAgo)
            .GroupBy(u => new { Year = u.CreatedAt.Year, Month = u.CreatedAt.Month })
            .Select(g => new { g.Key.Year, g.Key.Month, Count = g.Count() })
            .OrderBy(m => m.Year).ThenBy(m => m.Month)
            .ToListAsync();

        var fullMonthlyUsers = new List<MonthlyCountDto>();
        for (int i = 0; i < 12; i++)
        {
            var dt = twelveMonthsAgo.AddMonths(i);
            var matched = monthlyUsersRaw.FirstOrDefault(r => r.Year == dt.Year && r.Month == dt.Month);
            fullMonthlyUsers.Add(new MonthlyCountDto
            {
                Month = dt.Year + "-" + dt.Month.ToString("D2"),
                Count = matched?.Count ?? 0
            });
        }

        var topPackages = await _context.Payments
            .Where(p => p.Status == "SUCCESS" && p.PaymentMethod == "PayOs")
            .Join(_context.Orders, p => p.OrderId, o => o.Id, (p, o) => new { p, o })
            .Join(_context.ProductPackages,
                joined => joined.o.PackageId,
                pp => pp.Id,
                (joined, pp) => new { joined.p, pp })
            .GroupBy(x => new { x.pp.Id, x.pp.Name })
            .Select(g => new PackageStatDto
            {
                PackageName = g.Key.Name,
                Count = g.Count(),
                Revenue = g.Sum(x => x.p.Amount)
            })
            .OrderByDescending(p => p.Count)
            .Take(5)
            .ToListAsync();

        var recentPayments = await _context.Payments
            .Where(p => p.PaymentMethod == "PayOs")
            .Join(_context.Orders, p => p.OrderId, o => o.Id, (p, o) => new { p, o })
            .Join(_context.Users, joined => joined.o.UserId, u => u.Id, (joined, u) => new { joined.p, joined.o, u })
            .Join(_context.ProductPackages,
                joined => joined.o.PackageId,
                pp => pp.Id,
                (joined, pp) => new PaymentDto
                {
                    Id = joined.p.Id,
                    OrderId = joined.p.OrderId,
                    OrderCode = joined.o.OrderCode,
                    PaymentMethod = joined.p.PaymentMethod,
                    TransactionCode = joined.p.TransactionCode,
                    Amount = joined.p.Amount,
                    Status = joined.p.Status,
                    PaidAt = joined.p.PaidAt,
                    UserId = joined.o.UserId,
                    UserName = joined.u.Fullname,
                    UserEmail = joined.u.Email,
                    PackageName = pp.Name
                })
            .OrderByDescending(p => p.PaidAt)
            .Take(10)
            .ToListAsync();

        var dto = new AdminDashboardDto
        {
            TotalUsers = totalUsers,
            NewUsersThisMonth = newUsersThisMonth,
            ActiveSubscriptions = activeSubs,
            ExpiredSubscriptions = expiredSubs,
            SubscriptionRate = subRate,
            TotalRevenue = totalRevenue,
            RevenueThisMonth = revenueThisMonth,
            MonthlyRevenue = fullMonthlyRevenue,
            MonthlyNewUsers = fullMonthlyUsers,
            TopPackages = topPackages,
            RecentPayments = recentPayments
        };

        return Ok(dto);
    }
}
