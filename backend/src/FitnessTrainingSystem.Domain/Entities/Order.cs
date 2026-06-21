using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int PackageId { get; set; }

    public decimal PricePaid { get; set; }

    public string? PaymentStatus { get; set; }

    public DateTime? PurchasedAt { get; set; }

    public virtual ICollection<MembershipSubscription> MembershipSubscriptions { get; set; } = new List<MembershipSubscription>();

    public virtual ProductPackage Package { get; set; } = null!;

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual User User { get; set; } = null!;
}
