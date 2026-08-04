using System.Threading.Tasks;
using FitnessTrainingSystem.Application.DTOs.Nutrition;

namespace FitnessTrainingSystem.Application.Common.Interfaces
{
    public interface IGemmaAiService
    {
        Task<DietPlanResponse> GenerateDietPlanAsync(string userInfo, string foodListJson);
        Task<string> ChatAsync(string conversation,string userInfo);
    }
}