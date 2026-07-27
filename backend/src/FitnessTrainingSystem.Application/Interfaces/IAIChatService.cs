using FitnessTrainingSystem.Application.DTOs.Nutrition;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IAIChatService
{
    Task<AIChatResponse> SendMessageAsync(
        int userId,
        AIChatRequest request);


    Task<List<AIChatResponse>> GetMessagesAsync(
        int sessionId);


    Task<DietPlanResponse?> GenerateDietPlanAsync(
        int sessionId);
        
   
    Task SaveDietPlanHistoryAsync(
        int userId,
        int sessionId,
        DietPlanResponse response);

    Task<List<AIDietHistoryDto>> GetDietHistoriesAsync(int userId);
    
}