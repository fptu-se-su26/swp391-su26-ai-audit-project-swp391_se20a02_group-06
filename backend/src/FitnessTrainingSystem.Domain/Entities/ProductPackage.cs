using FitnessTrainingSystem.Domain.Common;
using FitnessTrainingSystem.Domain.Enums;

namespace FitnessTrainingSystem.Domain.Entities;

public class ProductPackage : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public PackageType Type { get; set; }
    public decimal Price { get; set; }
    public int DurationDays { get; set; }
    public string? Description { get; set; }

    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
