using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class ProductPackage
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Type { get; set; } = null!;

    public decimal Price { get; set; }

    public int DurationDays { get; set; }

    public string? Description { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<MembershipSubscription> MembershipSubscriptions { get; set; } = new List<MembershipSubscription>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
