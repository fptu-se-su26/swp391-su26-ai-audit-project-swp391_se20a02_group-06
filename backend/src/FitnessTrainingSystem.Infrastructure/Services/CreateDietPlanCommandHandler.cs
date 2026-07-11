using System.Text.Json;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FitnessTrainingSystem.Application.Common.Interfaces;
using FitnessTrainingSystem.Application.DTOs.Nutrition;
using FitnessTrainingSystem.Infrastructure.Persistence; 
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.Application.Features.Nutrition;

public class CreateDietPlanCommandHandler : IRequestHandler<CreateDietPlanCommand, DietPlanResponse>
{
    private readonly ApplicationDbContext _context;
    private readonly IGeminiAiService _aiService;

    public CreateDietPlanCommandHandler(ApplicationDbContext context, IGeminiAiService aiService)
    {
        _context = context;
        _aiService = aiService;
    }

    public async Task<DietPlanResponse> Handle(CreateDietPlanCommand request, CancellationToken cancellationToken)
    {
        // 1. Lấy thông tin chỉ số cơ thể mới nhất của User từ bảng BodyMetrics gửi sang AI phân tích
        var latestMetric = await _context.BodyMetrics
           .Where(b => b.UserId == request.UserId)
           .OrderByDescending(b => b.RecordedAt) 
           .FirstOrDefaultAsync(cancellationToken);

        string userInfo = "";
        if (latestMetric != null)
        {
            userInfo = $"Hội viên cân nặng {latestMetric.Weight}kg, cao {latestMetric.Height}cm. Yêu cầu mong muốn: {request.UserRequest}";
        }
        else
        {
            userInfo = $"Hội viên yêu cầu thực đơn với mong muốn: {request.UserRequest}";
        }

        // 2. Lấy danh sách món ăn từ bảng Foods trong DB Context chuyển thành chuỗi JSON
        var foodsInDb = await _context.Foods.ToListAsync(cancellationToken);
        string foodListJson = JsonSerializer.Serialize(foodsInDb);

        // 3. Gọi sang Python Service (Đã được cấu hình snake_case chuẩn xác) để lấy JSON từ Gemini AI
        DietPlanResponse aiPlan = await _aiService.GenerateDietPlanAsync(userInfo, foodListJson);

        // 4. Lưu vết kết quả AI trả về vào bảng AiRecommendations công khai của hệ thống
        var recommendation = new FitnessTrainingSystem.Domain.Entities.AiRecommendation
        {
            UserId = request.UserId,
            Type = FitnessTrainingSystem.Domain.Enums.RecommendationType.NutritionDiet,
            UserRequest = request.UserRequest,
            AiResponse = JsonSerializer.Serialize(aiPlan),
            CreatedAt = DateTime.UtcNow
        };
        
        _context.AiRecommendations.Add(recommendation);
        await _context.SaveChangesAsync(cancellationToken);

        // 5. Trả kết quả object thực đơn chuẩn về cho Controller nhả cho Frontend vẽ giao diện
        return aiPlan;
    }
}