using FitnessTrainingSystem.Domain.Common;
using FitnessTrainingSystem.Domain.Enums;

namespace FitnessTrainingSystem.Domain.Entities;

public class Order : BaseEntity
{
    public int? UserId { get; set; }
    public int? PackageId { get; set; }
    public decimal PricePaid { get; set; }
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    public DateTime PurchasedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiredAt { get; set; }

    public User? User { get; set; }
    public ProductPackage? Package { get; set; }
}
