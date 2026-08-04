using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Text.Json;
using System.Threading.Tasks;
using MediatR;
using FitnessTrainingSystem.Application.DTOs.Workouts;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Application.Common.Interfaces;

using Microsoft.Extensions.Configuration;

namespace FitnessTrainingSystem.Application.Features.AiRecommendations.Commands.GenerateWorkoutPlan;

public class GenerateWorkoutPlanCommandHandler : IRequestHandler<GenerateWorkoutPlanCommand, AiWorkoutPlanResponseDto>
{
    private readonly IGroqAiService _groqAiService;
    private readonly IExerciseService _exerciseService;

    public GenerateWorkoutPlanCommandHandler(IGroqAiService groqAiService, IExerciseService exerciseService)
    {
        _groqAiService = groqAiService;
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
                    MuscleGroupId = e.MuscleGroupId,
                    MuscleGroupName = e.MuscleGroup,
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

        // Nếu vẫn trống rỗng (không có bài tập nào cho nhóm cơ này), quăng lỗi
        if (!availableExercises.Any())
        {
            throw new Exception($"Không có bài tập nào khả dụng trong hệ thống cho nhóm cơ '{request.MuscleGroup}'. Vui lòng chọn nhóm cơ khác hoặc thêm bài tập vào hệ thống trước.");
        }

        var availableExercisesJson = JsonSerializer.Serialize(availableExercises);

        // 3. Bắn request sang service C# Gemini
        var aiResult = await _groqAiService.GenerateWorkoutPlanAsync(request.UserId, request.MuscleGroup, request.TargetCalories, request.DurationMinutes, availableExercisesJson, request.InjuredMuscleGroups);

        if (aiResult == null || !aiResult.Success)
        {
            throw new Exception("Xử lý tạo lịch tập từ Gemini AI thất bại hoặc dữ liệu trả về bị rỗng.");
        }

        // 5. Trả kết quả DTO sạch sẽ về cho WebApi Controller để hiển thị lên Swagger/Frontend
        return aiResult;
    }
}
