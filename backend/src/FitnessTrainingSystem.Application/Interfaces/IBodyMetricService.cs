using FitnessTrainingSystem.Application.DTOs.BodyMetric;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IBodyMetricService
{
    Task<BodyMetricDto?> GetLatestMetricByUserIdAsync(int userId);
    Task<IEnumerable<BodyMetricDto>> GetMetricsByUserIdAsync(int userId);
    Task<BodyMetricDto> AddMetricAsync(int userId, CreateBodyMetricDto dto);
}
