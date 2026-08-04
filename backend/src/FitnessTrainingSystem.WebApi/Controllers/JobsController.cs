using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/jobs")]
public class JobsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;

    public JobsController(ApplicationDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    [HttpPost("notify-expirations")]
    public async Task<IActionResult> NotifyExpirations()
    {
        // Find subscriptions expiring in exactly 7 days
        var targetDateStart = DateTime.UtcNow.Date.AddDays(7);
        var targetDateEnd = targetDateStart.AddDays(1);

        var expiringSubs = await _context.MembershipSubscriptions
            .Include(s => s.User)
            .Include(s => s.Package)
            .Where(s => s.Status == "ACTIVE" 
                        && s.EndDate >= targetDateStart 
                        && s.EndDate < targetDateEnd)
            .ToListAsync();

        int count = 0;
        foreach (var sub in expiringSubs)
        {
            if (sub.User != null && !string.IsNullOrEmpty(sub.User.Email) && sub.Package != null)
            {
                var subject = $"Your {sub.Package.Name} package is expiring soon!";
                var body = $@"
                <html>
                <body>
                    <h2>Hello {sub.User.Fullname},</h2>
                    <p>This is a reminder that your active subscription to <strong>{sub.Package.Name}</strong> will expire in 7 days on <strong>{sub.EndDate:yyyy-MM-dd}</strong>.</p>
                    <p>To ensure uninterrupted access to your professional features, please log in to your dashboard and renew your package.</p>
                    <br>
                    <p>Regards,<br>AISTHEA Team</p>
                </body>
                </html>";

                try
                {
                    await _emailService.SendEmailAsync(sub.User.Email, subject, body);
                    count++;
                }
                catch
                {
                    // Ignore email failures for individual users in a job
                }
            }
        }

        return Ok(new { message = $"Sent expiration notification to {count} users." });
    }

    [HttpPost("simulate-payment")]
    [Authorize]
    public async Task<IActionResult> SimulatePayment([FromQuery] long orderCode)
    {
        try
        {
            var order = await _context.Orders.Include(o => o.Package).FirstOrDefaultAsync(o => o.OrderCode == orderCode);
            if (order == null || order.PaymentStatus == FitnessTrainingSystem.Domain.Enums.PaymentStatus.Paid)
                return BadRequest(new { message = "Order not found or already paid." });

            if (order.UserId == null || order.PackageId == null)
                return BadRequest(new { message = "Order is missing user or package information." });

            order.PaymentStatus = FitnessTrainingSystem.Domain.Enums.PaymentStatus.Paid;

            var payment = await _context.Payments.FirstOrDefaultAsync(p => p.OrderId == order.Id);
            if (payment == null)
            {
                payment = new FitnessTrainingSystem.Domain.Entities.Payment
                {
                    OrderId = order.Id,
                    PaymentMethod = "PayOs",
                    TransactionCode = orderCode.ToString(),
                    Amount = order.PricePaid,
                    Status = "SUCCESS",
                    PaidAt = DateTime.UtcNow
                };
                _context.Payments.Add(payment);
            }
            else
            {
                payment.Status = "SUCCESS";
                payment.PaidAt = DateTime.UtcNow;
            }

            var activeSub = await _context.MembershipSubscriptions.FirstOrDefaultAsync(s => s.UserId == order.UserId && s.Status == "ACTIVE");
            if (activeSub != null) activeSub.Status = "CANCELLED";

            var sub = new FitnessTrainingSystem.Domain.Entities.MembershipSubscription
            {
                UserId = order.UserId.Value,
                PackageId = order.PackageId.Value,
                OrderId = order.Id,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(order.Package?.DurationDays ?? 0),
                Status = "ACTIVE"
            };
            _context.MembershipSubscriptions.Add(sub);

            var user = await _context.Users.FindAsync(order.UserId);
            if (user != null && !string.IsNullOrEmpty(user.Email))
            {
                var subject = $"Invoice for your purchase: {order.Package?.Name}";
                var body = $"<html><body><h2>Thank you for your purchase!</h2><p><strong>Order Code:</strong> {orderCode}</p><p><strong>Amount Paid:</strong> {order.PricePaid} VND</p></body></html>";
                try { await _emailService.SendEmailAsync(user.Email, subject, body); } catch { }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Payment confirmed and subscription activated.", orderId = order.Id });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Failed to confirm payment: {ex.InnerException?.Message ?? ex.Message}" });
        }
    }

    [HttpPost("simulate-schedule-payment")]
    [Authorize]
    public async Task<IActionResult> SimulateSchedulePayment([FromQuery] long orderCode)
    {
        try
        {
            var schedule = await _context.Schedules.Include(s => s.Pt).Include(s => s.Member).FirstOrDefaultAsync(s => s.OrderCode == orderCode);
            if (schedule == null || schedule.Status == FitnessTrainingSystem.Domain.Enums.ScheduleStatus.Confirmed)
                return BadRequest(new { message = "Schedule not found or already confirmed." });

            schedule.Status = FitnessTrainingSystem.Domain.Enums.ScheduleStatus.Confirmed;
            
            // Auto generate a mock meeting URL
            var meetingId = Guid.NewGuid().ToString("N").Substring(0, 10);
            schedule.MeetingUrl = $"https://meet.google.com/{meetingId.Substring(0, 3)}-{meetingId.Substring(3, 4)}-{meetingId.Substring(7, 3)}";

            if (schedule.Pt != null && !string.IsNullOrEmpty(schedule.Pt.Email))
            {
                var subject = $"New Session Booked with {schedule.Member?.Fullname ?? "a client"}!";
                var body = $"<html><body><h2>You have a new PT session booked!</h2><p><strong>Time:</strong> {schedule.StartTime.AddHours(7).ToString("yyyy-MM-dd HH:mm")} (VN Time)</p><p><strong>Meeting Link:</strong> <a href=\"{schedule.MeetingUrl}\">{schedule.MeetingUrl}</a></p></body></html>";
                try { await _emailService.SendEmailAsync(schedule.Pt.Email, subject, body); } catch { }

                var notification = new FitnessTrainingSystem.Domain.Entities.Notification
                {
                    UserId = schedule.PtId.Value,
                    Title = "New Session Booked",
                    Content = $"You have a new PT session booked with {schedule.Member?.Fullname ?? "a client"} at {schedule.StartTime.AddHours(7):yyyy-MM-dd HH:mm} (VN Time).",
                    Type = "SESSION_BOOKED",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Notifications.Add(notification);
            }

            if (schedule.Member != null && !string.IsNullOrEmpty(schedule.Member.Email))
            {
                var subject = $"Your PT Session with {schedule.Pt?.Fullname ?? "your PT"} is confirmed!";
                var body = $"<html><body><h2>Your booking is confirmed!</h2><p><strong>Time:</strong> {schedule.StartTime.AddHours(7).ToString("yyyy-MM-dd HH:mm")} (VN Time)</p><p><strong>Meeting Link:</strong> <a href=\"{schedule.MeetingUrl}\">{schedule.MeetingUrl}</a></p></body></html>";
                try { await _emailService.SendEmailAsync(schedule.Member.Email, subject, body); } catch { }
            }

            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Payment successful and schedule confirmed." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Error confirming payment: {ex.Message}" });
        }
    }

    [HttpPost("cancel-payment")]
    [Authorize]
    public async Task<IActionResult> CancelPayment([FromQuery] long orderCode)
    {
        try
        {
            // Check if it's a schedule payment
            var schedule = await _context.Schedules.FirstOrDefaultAsync(s => s.OrderCode == orderCode);
            if (schedule != null)
            {
                if (schedule.Status == FitnessTrainingSystem.Domain.Enums.ScheduleStatus.Pending)
                {
                    schedule.Status = FitnessTrainingSystem.Domain.Enums.ScheduleStatus.Available;
                    schedule.MemberId = null;
                    schedule.OrderCode = null;
                    schedule.Price = null;
                    await _context.SaveChangesAsync();
                    return Ok(new { type = "PT_SESSION" });
                }
                return Ok(new { type = "PT_SESSION", message = "Schedule was not pending." });
            }

            // Check if it's a subscription payment
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderCode == orderCode);
            if (order != null)
            {
                if (order.PaymentStatus == FitnessTrainingSystem.Domain.Enums.PaymentStatus.Pending)
                {
                    order.PaymentStatus = FitnessTrainingSystem.Domain.Enums.PaymentStatus.Cancelled;
                    await _context.SaveChangesAsync();
                    return Ok(new { type = "SUBSCRIPTION" });
                }
                return Ok(new { type = "SUBSCRIPTION", message = "Order was not pending." });
            }

            return NotFound(new { message = "Order code not found." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Error cancelling payment: {ex.Message}" });
        }
    }
}
