using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitnessTrainingSystem.Domain.Enums;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/pt/dashboard")]
[Authorize(Roles = "PT")]
public class PTDashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PTDashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ── GET /api/pt/dashboard/stats ──────────────────────────────────────────
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var ptId = GetPtId();
        if (ptId == null) return Unauthorized();

        var today = DateTime.UtcNow.Date;
        var diff = today.DayOfWeek == DayOfWeek.Sunday ? 6 : (int)today.DayOfWeek - 1;
        var startOfWeek = today.AddDays(-diff);
        var endOfWeek   = startOfWeek.AddDays(7).AddTicks(-1);

        var sessionsThisWeek = await _context.Schedules
            .CountAsync(s => s.PtId == ptId && s.Status == ScheduleStatus.Confirmed
                          && s.StartTime >= startOfWeek && s.StartTime <= endOfWeek);

        var activeClients = await _context.Schedules
            .Where(s => s.PtId == ptId && s.Status == ScheduleStatus.Confirmed && s.MemberId != null)
            .Select(s => s.MemberId)
            .Distinct()
            .CountAsync();

        // Earnings: sum of Price for all Confirmed schedules this calendar month
        var startOfMonth = new DateTime(today.Year, today.Month, 1);
        var endOfMonth   = startOfMonth.AddMonths(1).AddTicks(-1);
        var monthlyEarnings = (await _context.Schedules
            .Where(s => s.PtId == ptId && s.Status == ScheduleStatus.Confirmed
                     && s.Price != null
                     && s.StartTime >= startOfMonth && s.StartTime <= endOfMonth)
            .SumAsync(s => s.Price)) ?? 0m;

        var monthName = today.ToString("MMM").ToUpper();

        return Ok(new
        {
            sessionsThisWeek,
            activeClients,
            monthlyEarnings,
            monthName
        });
    }

    // ── GET /api/pt/dashboard/today-schedule ────────────────────────────────
    [HttpGet("today-schedule")]
    public async Task<IActionResult> GetTodaySchedule()
    {
        var ptId = GetPtId();
        if (ptId == null) return Unauthorized();

        // Convert "today in VN time (UTC+7)" to UTC boundaries for the DB filter.
        // EF Core / MySQL cannot translate .AddHours() on an entity property inside a WHERE.
        var nowUtc = DateTime.UtcNow;
        var nowVn  = nowUtc.AddHours(7);
        var todayVnMidnight   = nowVn.Date;                    // e.g. 2026-08-05 00:00 VN
        var tomorrowVnMidnight = todayVnMidnight.AddDays(1);  // e.g. 2026-08-06 00:00 VN
        var startUtc = todayVnMidnight.AddHours(-7);           // back to UTC for comparison
        var endUtc   = tomorrowVnMidnight.AddHours(-7);

        var schedules = await _context.Schedules
            .Include(s => s.Member)
            .Where(s => s.PtId == ptId
                     && (s.Status == ScheduleStatus.Available
                      || s.Status == ScheduleStatus.Pending
                      || s.Status == ScheduleStatus.Confirmed)
                     && s.StartTime >= startUtc
                     && s.StartTime < endUtc)
            .OrderBy(s => s.StartTime)
            .Select(s => new
            {
                s.Id,
                StartTime   = s.StartTime.AddHours(7),
                EndTime     = s.EndTime.AddHours(7),
                s.Description,
                s.MeetingUrl,
                Status      = s.Status.ToString(),
                MemberName  = s.Member != null ? s.Member.Fullname : null,
                MemberEmail = s.Member != null ? s.Member.Email    : null,
            })
            .ToListAsync();

        return Ok(schedules);
    }


    // ── GET /api/pt/dashboard/content-stats ─────────────────────────────────
    [HttpGet("content-stats")]
    public async Task<IActionResult> GetContentStats()
    {
        var ptId = GetPtId();
        if (ptId == null) return Unauthorized();

        // Published exercises (not draft, created by this PT)
        var published = await _context.Exercises
            .CountAsync(e => e.CreatedBy == ptId && e.IsDraft != true);

        // Pending upload requests
        var pending = await _context.PtUploadRequests
            .CountAsync(r => r.PtId == ptId && r.Status == "PENDING");

        // Rejected upload requests
        var rejected = await _context.PtUploadRequests
            .CountAsync(r => r.PtId == ptId && r.Status == "REJECTED");

        return Ok(new { published, pending, rejected });
    }

    // ── GET /api/pt/dashboard/recent-activity ───────────────────────────────
    [HttpGet("recent-activity")]
    public async Task<IActionResult> GetRecentActivity()
    {
        var ptId = GetPtId();
        if (ptId == null) return Unauthorized();

        // Recent bookings (Confirmed schedules for this PT, newest first)
        var recentBookings = await _context.Schedules
            .Include(s => s.Member)
            .Where(s => s.PtId == ptId && s.Status == ScheduleStatus.Confirmed && s.MemberId != null)
            .OrderByDescending(s => s.StartTime)
            .Take(5)
            .Select(s => new
            {
                Type        = "booking",
                MemberName  = s.Member != null ? s.Member.Fullname : "A client",
                StartTime   = s.StartTime.AddHours(7),
            })
            .ToListAsync();

        // Get distinct client IDs of this PT's confirmed sessions
        var clientIds = await _context.Schedules
            .Where(s => s.PtId == ptId && s.Status == ScheduleStatus.Confirmed && s.MemberId != null)
            .Select(s => s.MemberId!.Value)
            .Distinct()
            .ToListAsync();

        // Recent workout sessions logged by those clients
        var recentWorkouts = await _context.WorkoutSessions
            .Include(w => w.User)
            .Include(w => w.WorkoutPlan)
            .Where(w => clientIds.Contains(w.UserId) && w.CompletedAt != null)
            .OrderByDescending(w => w.CompletedAt)
            .Take(5)
            .Select(w => new
            {
                Type         = "workout",
                MemberName   = w.User != null ? w.User.Fullname : "A client",
                WorkoutTitle = w.WorkoutPlan != null ? w.WorkoutPlan.Title : "a workout",
                CompletedAt  = w.CompletedAt,
            })
            .ToListAsync();

        return Ok(new { bookings = recentBookings, workouts = recentWorkouts });
    }

    // ── helpers ──────────────────────────────────────────────────────────────
    private int? GetPtId()
    {
        var str = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
               ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(str, out var id) ? id : null;
    }
}
