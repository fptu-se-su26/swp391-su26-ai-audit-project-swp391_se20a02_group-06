using FitnessTrainingSystem.Application.DTOs.Payments;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PaymentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var payments = await _context.Payments
            .Where(p => p.PaymentMethod == "PayOs")
            .Join(_context.Orders,
                p => p.OrderId,
                o => o.Id,
                (p, o) => new { p, o })
            .Join(_context.Users,
                joined => joined.o.UserId,
                u => u.Id,
                (joined, u) => new { joined.p, joined.o, u })
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
            .ToListAsync();

        return Ok(payments);
    }
}
