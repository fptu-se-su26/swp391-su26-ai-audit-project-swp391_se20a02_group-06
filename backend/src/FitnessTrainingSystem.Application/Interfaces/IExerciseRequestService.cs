using System.Collections.Generic;
using System.Threading.Tasks;
using FitnessTrainingSystem.Application.DTOs.Exercises;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IExerciseRequestService
{
    Task<ExerciseRequestDto> CreateRequestAsync(CreateExerciseRequestDto dto, int adminId);
    Task<IEnumerable<ExerciseRequestDto>> GetAllRequestsAsync();
    Task<IEnumerable<ExerciseRequestDto>> GetRequestsByPtAsync(int ptId);
    Task<ExerciseRequestDto> SubmitExerciseAsync(int requestId, PtSubmitExerciseDto dto, int ptId);
    Task<ExerciseRequestDto> ReviewRequestAsync(int requestId, ReviewExerciseRequestDto dto, int adminId);
}
