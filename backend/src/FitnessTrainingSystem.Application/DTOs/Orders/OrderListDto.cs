using FitnessTrainingSystem.Domain.Enums;

namespace FitnessTrainingSystem.Application.DTOs.Orders;

public class OrderListDto
{
    public int Id { get; set; }
    public long OrderCode { get; set; }
    public int? UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
    public int? PackageId { get; set; }
    public string? PackageName { get; set; }
    public decimal PricePaid { get; set; }
    public string? PaymentStatus { get; set; }
    public DateTime PurchasedAt { get; set; }
}
