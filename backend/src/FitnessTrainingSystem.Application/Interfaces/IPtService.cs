using FitnessTrainingSystem.Application.DTOs.PTs;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IPtService
{
    Task<IEnumerable<PtDto>> GetAllAsync();
    Task<bool> ActivateAsync(int id);
    Task<bool> DeactivateAsync(int id);
    Task<PtDto> CreateAsync(CreatePtRequestDto dto);
}
