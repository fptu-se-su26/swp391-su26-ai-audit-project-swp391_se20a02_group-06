using System.Threading.Tasks;
using FitnessTrainingSystem.Application.DTOs.Nutrition;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IGeminiAiService
{
    Task<DietPlanResponse> GenerateDietPlanAsync(string userInfo, string foodListJson);
    Task<string> ChatAsync(string conversation, string userInfo);
    Task<string> GenerateContentAsync(string prompt);
}
