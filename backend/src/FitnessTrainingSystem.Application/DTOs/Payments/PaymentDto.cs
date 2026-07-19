namespace FitnessTrainingSystem.Application.DTOs.Payments;

public class PaymentDto
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public long OrderCode { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string? TransactionCode { get; set; }
    public decimal Amount { get; set; }
    public string? Status { get; set; }
    public DateTime? PaidAt { get; set; }
    public int? UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
    public string? PackageName { get; set; }
}
