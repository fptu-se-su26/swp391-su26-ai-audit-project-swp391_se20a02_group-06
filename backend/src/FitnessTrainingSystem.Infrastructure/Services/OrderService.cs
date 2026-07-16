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
    private readonly IPayOSService _payOsService;

    public OrderService(ApplicationDbContext context, IMapper mapper, IPayOSService payOsService)
    {
        _context = context;
        _mapper = mapper;
        _payOsService = payOsService;
    }

    public async Task<OrderDto> PurchasePackageAsync(int userId, PurchasePackageDto dto)
    {
        var package = await _context.ProductPackages.FindAsync(dto.PackageId);
        
        if (package == null)
        {
            throw new Exception("Product package not found.");
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new Exception("User not found.");
        }

        var orderCode = long.Parse(DateTime.Now.ToString("yyMMddHHmmssfff"));

        var order = new Order
        {
            OrderCode = orderCode,
            UserId = userId,
            PackageId = package.Id,
            PricePaid = package.Price,
            PaymentStatus = PaymentStatus.Pending,
            PurchasedAt = DateTime.UtcNow
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        var orderDto = _mapper.Map<OrderDto>(order);

        // If package is free or zero cost, just complete the order immediately
        if (package.Price <= 0)
        {
            order.PaymentStatus = PaymentStatus.Paid;
            await _context.SaveChangesAsync();
            orderDto.PaymentStatus = PaymentStatus.Paid;
            return orderDto;
        }

        // Call PayOS for payment link and QR code
        var amountVnd = (int)Math.Round(package.Price);
        var description = $"Order {orderCode}";
        var buyerName = user.Fullname ?? user.Email ?? "Customer";

        try
        {
            var (checkoutUrl, qrCode) = await _payOsService.CreatePaymentLinkAsync(orderCode, amountVnd, description, buyerName);
            orderDto.CheckoutUrl = checkoutUrl;
            orderDto.QrCode = qrCode;
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to connect to PayOS: {ex.Message}");
        }

        return orderDto;
    }
}
