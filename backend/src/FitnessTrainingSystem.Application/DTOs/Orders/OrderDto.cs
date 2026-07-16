using FitnessTrainingSystem.Domain.Enums;

namespace FitnessTrainingSystem.Application.DTOs.Orders;

public class OrderDto
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public int? PackageId { get; set; }
    public decimal PricePaid { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public DateTime PurchasedAt { get; set; }
    public string? CheckoutUrl { get; set; }
    public string? QrCode { get; set; }
}
