using System.ComponentModel.DataAnnotations;
using FitnessTrainingSystem.Domain.Enums;

namespace FitnessTrainingSystem.Application.DTOs.ProductPackages;

public class CreateProductPackageDto
{
    public string Name { get; set; } = string.Empty;
    public PackageType Type { get; set; }
    public decimal Price { get; set; }
    public int DurationDays { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsPopular { get; set; } = false;

    [Range(0, 100, ErrorMessage = "Tier must be between 0 and 100")]
    public int Tier { get; set; }
}
