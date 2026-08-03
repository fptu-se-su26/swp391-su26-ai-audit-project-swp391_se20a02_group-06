using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Domain.Entities;
using FitnessTrainingSystem.Domain.Enums;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/schedules")]
public class SchedulesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IPayOSService _payOsService;

    public SchedulesController(ApplicationDbContext context, IPayOSService payOsService)
    {
        _context = context;
        _payOsService = payOsService;
    }

    [HttpGet("pt/{ptId}")]
    public async Task<IActionResult> GetPtSchedules(int ptId)
    {
        // Return schedules that are Pending or Confirmed to block time slots
        var schedules = await _context.Schedules
            .Where(s => s.PtId == ptId && (s.Status == ScheduleStatus.Pending || s.Status == ScheduleStatus.Confirmed || s.Status == ScheduleStatus.Available))
            .Select(s => new
            {
                s.Id,
                s.StartTime,
                s.EndTime,
                Status = s.Status.ToString(),
                Description = s.Description,
                s.MemberId
            })
            .ToListAsync();

        return Ok(schedules);
    }

    [HttpPost("checkout")]
    [Authorize]
    public async Task<IActionResult> Checkout([FromBody] CheckoutScheduleRequest request)
    {
        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
        {
            return Unauthorized(new { message = "Invalid token or user ID not found." });
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound(new { message = "User not found." });

        var ptProfile = await _context.PtProfiles.Include(p => p.User).FirstOrDefaultAsync(p => p.UserId == request.PtId);
        if (ptProfile == null) return NotFound(new { message = "PT not found." });

        // Find if there is an Available slot that covers this requested time exactly
        var schedule = await _context.Schedules.FirstOrDefaultAsync(s => 
            s.PtId == request.PtId && 
            s.Status == ScheduleStatus.Available &&
            s.StartTime == request.StartTime && s.EndTime == request.EndTime);

        if (schedule == null)
        {
            // Maybe it's already booked?
            var conflict = await _context.Schedules.AnyAsync(s => 
                s.PtId == request.PtId && 
                (s.Status == ScheduleStatus.Pending || s.Status == ScheduleStatus.Confirmed) &&
                s.StartTime < request.EndTime && s.EndTime > request.StartTime);

            if (conflict)
                return BadRequest(new { message = "This time slot is already booked." });
            else
                return BadRequest(new { message = "This time slot is not available for booking." });
        }

        var orderCode = long.Parse(DateTime.Now.ToString("yyMMddHHmmssfff"));
        var price = ptProfile.SessionRate ?? 500000m;

        // Claim the slot
        schedule.MemberId = userId;
        schedule.Status = ScheduleStatus.Pending;
        schedule.OrderCode = orderCode;
        schedule.Price = price;

        await _context.SaveChangesAsync();

        var description = "PT Booking";
        var buyerName = user.Fullname ?? user.Email ?? "Client";
        var amountVnd = (int)price;

        try
        {
            var (checkoutUrl, qrCode) = await _payOsService.CreatePaymentLinkAsync(orderCode, amountVnd, description, buyerName);
            return Ok(new { checkoutUrl, scheduleId = schedule.Id, orderCode = orderCode });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Failed to create PayOS link: {ex.Message}" });
        }
    }

    [HttpPost("availability")]
    [Authorize(Roles = "PT")]
    public async Task<IActionResult> CreateAvailability([FromBody] CreateAvailabilityRequest request)
    {
        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var ptId))
        {
            return Unauthorized(new { message = "Invalid token or user ID not found." });
        }

        var conflict = await _context.Schedules.AnyAsync(s => 
            s.PtId == ptId && 
            s.Status != ScheduleStatus.Cancelled &&
            s.StartTime < request.EndTime && s.EndTime > request.StartTime);

        if (conflict)
        {
            return BadRequest(new { message = "You already have a schedule or availability during this time." });
        }

        var schedule = new Schedule
        {
            PtId = ptId,
            MemberId = null,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Status = ScheduleStatus.Available,
            Description = request.Description
        };

        _context.Schedules.Add(schedule);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Availability created.", scheduleId = schedule.Id });
    }

    [HttpPost("bulk-availability")]
    [Authorize(Roles = "PT")]
    public async Task<IActionResult> CreateBulkAvailability([FromBody] CreateBulkAvailabilityRequest request)
    {
        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var ptId))
        {
            return Unauthorized(new { message = "Invalid token or user ID not found." });
        }

        if (request.StartDate > request.EndDate || (request.EndDate - request.StartDate).TotalDays > 60)
        {
            return BadRequest(new { message = "Invalid date range. Maximum 60 days." });
        }

        var newSchedules = new List<Schedule>();

        for (var date = request.StartDate.Date; date <= request.EndDate.Date; date = date.AddDays(1))
        {
            if (request.DaysOfWeek.Contains((int)date.DayOfWeek))
            {
                foreach (var timeSlot in request.TimeSlots)
                {
                    // TimeSpan parsing from string in UI
                    if (!TimeSpan.TryParse(timeSlot.StartTime, out var startSpan) ||
                        !TimeSpan.TryParse(timeSlot.EndTime, out var endSpan))
                    {
                        continue;
                    }

                    var startDateTime = date.Add(startSpan);
                    var endDateTime = date.Add(endSpan);

                    if (startDateTime < DateTime.Now) continue;

                    var conflict = await _context.Schedules.AnyAsync(s => 
                        s.PtId == ptId && 
                        s.Status != ScheduleStatus.Cancelled &&
                        s.StartTime < endDateTime && s.EndTime > startDateTime);

                    if (!conflict)
                    {
                        newSchedules.Add(new Schedule
                        {
                            PtId = ptId,
                            MemberId = null,
                            StartTime = startDateTime,
                            EndTime = endDateTime,
                            Status = ScheduleStatus.Available,
                            Description = "Bulk Available Slot"
                        });
                    }
                }
            }
        }

        if (newSchedules.Any())
        {
            _context.Schedules.AddRange(newSchedules);
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = $"Successfully created {newSchedules.Count} available slots." });
    }

    [HttpDelete("availability/{id}")]
    [Authorize(Roles = "PT")]
    public async Task<IActionResult> DeleteAvailability(int id)
    {
        var userIdString = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var ptId))
        {
            return Unauthorized(new { message = "Invalid token or user ID not found." });
        }

        var schedule = await _context.Schedules.FirstOrDefaultAsync(s => s.Id == id && s.PtId == ptId);
        if (schedule == null) return NotFound(new { message = "Schedule not found." });

        if (schedule.Status != ScheduleStatus.Available)
        {
            return BadRequest(new { message = "Can only delete available slots, not booked sessions." });
        }

        _context.Schedules.Remove(schedule);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Availability removed." });
    }
}

public class CreateAvailabilityRequest
{
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class CheckoutScheduleRequest
{
    public int PtId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}

public class CreateBulkAvailabilityRequest
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<int> DaysOfWeek { get; set; } = new(); // 0 = Sunday, 1 = Monday, etc.
    public List<TimeSlotDto> TimeSlots { get; set; } = new();
}

public class TimeSlotDto
{
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
}
