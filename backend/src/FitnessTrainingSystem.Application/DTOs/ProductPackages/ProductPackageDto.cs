using FitnessTrainingSystem.Domain.Enums;

namespace FitnessTrainingSystem.Application.DTOs.ProductPackages;

public class ProductPackageDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public PackageType Type { get; set; }
    public decimal Price { get; set; }
    public int DurationDays { get; set; }
    public string? Description { get; set; }
}
