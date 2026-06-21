using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class MembershipSubscription
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int PackageId { get; set; }

    public int? OrderId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public string? Status { get; set; }

    public virtual Order? Order { get; set; }

    public virtual ProductPackage Package { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
