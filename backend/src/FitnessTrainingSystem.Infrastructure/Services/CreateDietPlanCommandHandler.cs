using System.Text.Json;
using FitnessTrainingSystem.Application.Common.Interfaces;
using FitnessTrainingSystem.Application.DTOs.Nutrition;
using FitnessTrainingSystem.Infrastructure.Persistence; // Để gọi ApplicationDbContext của bạn
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
        // 1. Lấy thông tin chỉ số cơ thể mới nhất của User từ bảng BodyMetrics của bạn để gửi AI phân tích
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

        // 2. Lấy danh sách 30 món ăn từ bảng Foods bạn vừa khai báo trong DB Context chuyển thành JSON
        var foodsInDb = await _context.Foods.ToListAsync(cancellationToken);
        string foodListJson = JsonSerializer.Serialize(foodsInDb);

        // 3. Gọi sang file PythonGeminiAiService.cs (đang bọc HttpClient gọi sang Python port 8000)
        DietPlanResponse aiPlan = await _aiService.GenerateDietPlanAsync(userInfo, foodListJson);

        // 4. (Tùy chọn) Lưu vết kết quả trả về vào bảng AiRecommendations của bạn
        var recommendation = new FitnessTrainingSystem.Domain.Entities.AiRecommendation
        {
            UserId = request.UserId,
            Type = "NUTRITION",
            UserRequest = request.UserRequest,
            AiResponse = JsonSerializer.Serialize(aiPlan),
            CreatedAt = DateTime.UtcNow
        };
        _context.AiRecommendations.Add(recommendation);
        await _context.SaveChangesAsync(cancellationToken);

        // 5. Trả kết quả object thực đơn về cho Controller
        return aiPlan;
    }
}