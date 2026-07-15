using System.Threading.Tasks;
using FitnessTrainingSystem.Application.DTOs.Dashboard;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync(int userId);
}
