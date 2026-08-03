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
    private readonly IGeminiAiService _geminiAiService;
    private readonly IExerciseService _exerciseService;

    public GenerateWorkoutPlanCommandHandler(IGeminiAiService geminiAiService, IExerciseService exerciseService)
    {
        _geminiAiService = geminiAiService;
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
                        MuscleGroupId = e.MuscleGroupId,
                        MuscleGroupName = e.MuscleGroup,
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

        var availableExercisesJson = JsonSerializer.Serialize(availableExercises);

        // 3. Bắn request sang service C# Gemini
        var aiResult = await _geminiAiService.GenerateWorkoutPlanAsync(request.UserId, request.MuscleGroup, request.TargetCalories, request.DurationMinutes, availableExercisesJson, request.InjuredMuscleGroups);

        if (aiResult == null || !aiResult.Success)
        {
            throw new Exception("Xử lý tạo lịch tập từ Gemini AI thất bại hoặc dữ liệu trả về bị rỗng.");
        }

        // 5. Trả kết quả DTO sạch sẽ về cho WebApi Controller để hiển thị lên Swagger/Frontend
        return aiResult;
    }
}