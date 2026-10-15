using System;
using System.Linq;
using System.Threading.Tasks;
using FitnessTrainingSystem.Application.DTOs.Payments;
using FitnessTrainingSystem.Domain.Entities;
using FitnessTrainingSystem.Domain.Enums;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize(Roles = "Admin,ADMIN")]
public class PaymentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PaymentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // 1. Auto-sync any existing Orders that do not have a Payment record yet
        var existingOrderIds = await _context.Payments.Select(p => p.OrderId).Distinct().ToListAsync();
        var missingOrders = await _context.Orders
            .Where(o => !existingOrderIds.Contains(o.Id))
            .ToListAsync();

        if (missingOrders.Any())
        {
            foreach (var o in missingOrders)
            {
                _context.Payments.Add(new Payment
                {
                    OrderId = o.Id,
                    PaymentMethod = "PayOs",
                    TransactionCode = o.OrderCode.ToString(),
                    Amount = o.PricePaid,
                    Status = o.PaymentStatus == PaymentStatus.Paid ? "SUCCESS"
                           : o.PaymentStatus == PaymentStatus.Cancelled ? "FAILED"
                           : "PENDING",
                    PaidAt = o.PaymentStatus == PaymentStatus.Paid ? o.PurchasedAt : null
                });
            }
            await _context.SaveChangesAsync();
        }

        // 2. Fetch all payments with Order, User, Package
        var payments = await _context.Payments
            .Include(p => p.Order)
                .ThenInclude(o => o.User)
            .Include(p => p.Order)
                .ThenInclude(o => o.Package)
            .OrderByDescending(p => p.PaidAt ?? (p.Order != null ? p.Order.PurchasedAt : DateTime.MinValue))
            .ToListAsync();

        var result = payments.Select(p =>
        {
            var rawStatus = (p.Status ?? "").ToUpperInvariant();
            var normalizedStatus = (rawStatus == "SUCCESS" || rawStatus == "PAID") ? "SUCCESS"
                                 : (rawStatus == "FAILED" || rawStatus == "CANCELLED") ? "FAILED"
                                 : "PENDING";

            return new PaymentDto
            {
                Id = p.Id,
                OrderId = p.OrderId,
                OrderCode = p.Order != null ? p.Order.OrderCode : p.OrderId,
                PaymentMethod = string.IsNullOrWhiteSpace(p.PaymentMethod) ? "PayOs" : p.PaymentMethod,
                TransactionCode = p.TransactionCode ?? (p.Order != null ? p.Order.OrderCode.ToString() : p.Id.ToString()),
                Amount = p.Amount,
                Status = normalizedStatus,
                PaidAt = p.PaidAt ?? (normalizedStatus == "SUCCESS" ? p.Order?.PurchasedAt : null),
                UserId = p.Order?.UserId,
                UserName = p.Order?.User?.Fullname ?? p.Order?.User?.Email ?? "N/A",
                UserEmail = p.Order?.User?.Email ?? "N/A",
                PackageName = p.Order?.Package?.Name ?? "Membership Package"
            };
        }).ToList();

        return Ok(result);
    }
}
