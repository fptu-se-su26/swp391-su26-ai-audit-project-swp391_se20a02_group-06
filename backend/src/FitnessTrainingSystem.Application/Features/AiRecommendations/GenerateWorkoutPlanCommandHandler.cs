using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using FitnessTrainingSystem.Application.DTOs.Workouts;
using FitnessTrainingSystem.Application.Interfaces;

using Microsoft.Extensions.Configuration;

namespace FitnessTrainingSystem.Application.Features.AiRecommendations.Commands.GenerateWorkoutPlan;

public class GenerateWorkoutPlanCommandHandler : IRequestHandler<GenerateWorkoutPlanCommand, AiWorkoutPlanResponseDto>
{
    private readonly HttpClient _httpClient;
    private readonly IExerciseService _exerciseService;

    public GenerateWorkoutPlanCommandHandler(IHttpClientFactory httpClientFactory, IExerciseService exerciseService, IConfiguration configuration)
    {
        _httpClient = httpClientFactory.CreateClient();
        var baseUrl = configuration["AiServiceSettings:BaseUrl"] ?? "http://localhost:5007";
        _httpClient.BaseAddress = new Uri(baseUrl);
        _exerciseService = exerciseService;
    }

    // ... Các đoạn code xử lý Handle bên dưới giữ nguyên vẹn ...

    public async Task<AiWorkoutPlanResponseDto> Handle(GenerateWorkoutPlanCommand request, CancellationToken cancellationToken)
    {
        List<AvailableExerciseDto> availableExercises;
        try
        {
            if (request.MuscleGroup.Equals("Full Body", StringComparison.OrdinalIgnoreCase) || request.MuscleGroup.Equals("Split", StringComparison.OrdinalIgnoreCase))
            {
                var allExercises = await _exerciseService.GetAllAsync();
                availableExercises = allExercises.Select(e => new AvailableExerciseDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    Description = e.Description,
                    MuscleGroupId = 0,
                    Equipment = "None",
                    DurationMinutes = e.Duration ?? 10,
                    CaloriesBurnPerMin = 5.0,
                    Difficulty = e.Difficulty.ToString()
                }).ToList();
            }
            else
            {
                availableExercises = await _exerciseService.GetAvailableExercisesByMuscleGroupAsync(request.MuscleGroup, cancellationToken);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Database connection failed: {ex.Message}. Using mock exercises for testing...");
            availableExercises = new List<AvailableExerciseDto>();
        }

        // Nếu trong DB trống rỗng cho nhóm cơ yêu cầu, cố gắng lấy bất kỳ bài tập nào từ DB để tránh lỗi FK Constraint khi lưu
        if (!availableExercises.Any())
        {
            try
            {
                var allExercises = await _exerciseService.GetAllAsync();
                if (allExercises.Any())
                {
                    availableExercises = allExercises.Select(e => new AvailableExerciseDto
                    {
                        Id = e.Id,
                        Title = e.Title,
                        Description = e.Description,
                        MuscleGroupId = 0,
                        Equipment = "None",
                        DurationMinutes = e.Duration ?? 10,
                        CaloriesBurnPerMin = 5.0,
                        Difficulty = e.Difficulty.ToString()
                    }).ToList();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Database fallback failed: {ex.Message}");
            }
        }

        // Nếu vẫn trống rỗng (DB rỗng hoàn toàn hoặc lỗi kết nối), tự động sử dụng danh sách bài tập giả lập để phục vụ kiểm thử AI
        if (!availableExercises.Any())
        {
            availableExercises = new List<AvailableExerciseDto>
            {
                new() { Id = 1, Title = "Push Up", Description = "Standard Push Up", CaloriesBurnPerMin = 8.0, Difficulty = "BEGINNER" },
                new() { Id = 2, Title = "Dumbbell Chest Press", Description = "Chest press with dumbbells", CaloriesBurnPerMin = 6.5, Difficulty = "INTERMEDIATE" },
                new() { Id = 3, Title = "Chest Fly", Description = "Cable Chest Fly", CaloriesBurnPerMin = 5.5, Difficulty = "ADVANCED" }
            };
        }

        // 2. Đóng gói dữ liệu đầu vào (Payload) khớp hoàn toàn với cấu trúc WorkoutAiRequest bên Python
        var pythonRequestPayload = new
        {
            user_id = request.UserId,
            muscle_group = request.MuscleGroup,
            target_calories = request.TargetCalories,
            duration_minutes = request.DurationMinutes,
            available_exercises = availableExercises
        };

        // 3. Bắn HTTP POST Request sang bên bến FastAPI Python
        var response = await _httpClient.PostAsJsonAsync("/api/ai/generate-workout", pythonRequestPayload, cancellationToken);

        // Nếu bến Python trả về lỗi (Ví dụ lỗi sập mạng, lỗi Gemini hết hạn key...), bắt lỗi và ném ra Exception
        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new Exception($"Lỗi xử lý từ AI Microservice (Python): {errorContent}");
        }

        // 4. Nhận cục JSON kết quả trả về từ Python và tự động map vào DTO lớp C# thông qua JsonPropertyName
        var aiResult = await response.Content.ReadFromJsonAsync<AiWorkoutPlanResponseDto>(cancellationToken);

        if (aiResult == null || !aiResult.Success)
        {
            throw new Exception("Xử lý tạo lịch tập từ Gemini AI thất bại hoặc dữ liệu trả về bị rỗng.");
        }

        // 5. Trả kết quả DTO sạch sẽ về cho WebApi Controller để hiển thị lên Swagger/Frontend
        return aiResult;
    }
}