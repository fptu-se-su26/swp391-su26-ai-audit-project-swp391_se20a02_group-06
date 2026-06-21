using System.Threading.Tasks;
using FitnessTrainingSystem.Application.DTOs.Nutrition;

namespace FitnessTrainingSystem.Application.Common.Interfaces
{
    public interface IGeminiAiService
    {
        Task<DietPlanResponse> GenerateDietPlanAsync(string userInfo, string foodListJson);
    }
}