using AutoMapper;
using FitnessTrainingSystem.Application.DTOs.Orders;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Domain.Entities;
using FitnessTrainingSystem.Domain.Enums;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public OrderService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<OrderDto> PurchasePackageAsync(int userId, PurchasePackageDto dto)
    {
        var package = await _context.ProductPackages.FindAsync(dto.PackageId);
        
        if (package == null)
        {
            throw new Exception("Product package not found.");
        }

        var order = new Order
        {
            UserId = userId,
            PackageId = package.Id,
            PricePaid = package.Price,
            PaymentStatus = PaymentStatus.Paid, // Mocking successful payment
            PurchasedAt = DateTime.UtcNow,
            ExpiredAt = DateTime.UtcNow.AddDays(package.DurationDays)
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return _mapper.Map<OrderDto>(order);
    }
}
