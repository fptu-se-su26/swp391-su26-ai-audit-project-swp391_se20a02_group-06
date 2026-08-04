using System.ComponentModel.DataAnnotations;

namespace FitnessTrainingSystem.Application.DTOs.Orders;

public class PurchasePackageDto
{
    [Required]
    public int PackageId { get; set; }
    public string? ReturnUrl { get; set; }
    public string? CancelUrl { get; set; }
}
