using FitnessTrainingSystem.Application.DTOs.Nutrition;

namespace FitnessTrainingSystem.Application.Common.Interfaces
{
    public interface IGroqAiService
    {
        Task<DietPlanResponse> GenerateDietPlanAsync(string userInfo, string foodListJson);
        Task<string> ChatAsync(string conversation, string userInfo);
    }
}
