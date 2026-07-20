namespace FitnessTrainingSystem.Application.DTOs.Membership;

public class MembershipDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
    public int PackageId { get; set; }
    public string? PackageName { get; set; }
    public int? OrderId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? Status { get; set; }
    public bool IsActive => Status == "ACTIVE" && EndDate > DateTime.UtcNow;
}
