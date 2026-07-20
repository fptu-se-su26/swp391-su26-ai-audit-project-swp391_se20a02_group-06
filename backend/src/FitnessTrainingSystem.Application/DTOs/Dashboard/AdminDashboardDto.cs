using FitnessTrainingSystem.Application.DTOs.Payments;

namespace FitnessTrainingSystem.Application.DTOs.Dashboard;

public class AdminDashboardDto
{
    public int TotalUsers { get; set; }
    public int NewUsersThisMonth { get; set; }
    public int ActiveSubscriptions { get; set; }
    public int ExpiredSubscriptions { get; set; }
    public double SubscriptionRate { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal RevenueThisMonth { get; set; }
    public List<MonthlyValueDto> MonthlyRevenue { get; set; } = new();
    public List<MonthlyCountDto> MonthlyNewUsers { get; set; } = new();
    public List<PackageStatDto> TopPackages { get; set; } = new();
    public List<PaymentDto> RecentPayments { get; set; } = new();
}
