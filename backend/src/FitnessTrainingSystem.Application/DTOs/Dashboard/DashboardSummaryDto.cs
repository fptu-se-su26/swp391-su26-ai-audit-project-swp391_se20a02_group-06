using System.Collections.Generic;

namespace FitnessTrainingSystem.Application.DTOs.Dashboard;

public class DashboardSummaryDto
{
    public int CurrentStreak { get; set; }
    public List<int> ActiveDaysThisWeek { get; set; } = new List<int>(); // 0 for Mon, 6 for Sun
    
    public double ActiveCaloriesToday { get; set; }
    public List<double> ActiveCaloriesHistory { get; set; } = new List<double>(); // Last 7 days

    // Macros
    public double ProteinConsumed { get; set; }
    public double ProteinTarget { get; set; }
    public double CarbsConsumed { get; set; }
    public double CarbsTarget { get; set; }
    public double FatsConsumed { get; set; }
    public double FatsTarget { get; set; }
}
