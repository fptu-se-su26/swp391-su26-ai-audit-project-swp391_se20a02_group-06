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

namespace FitnessTrainingSystem.Application.Features.AiRecommendations.Commands.GenerateWeeklyWorkoutPlan;

public class GenerateWeeklyWorkoutPlanCommandHandler : IRequestHandler<GenerateWeeklyWorkoutPlanCommand, AiWeeklyWorkoutPlanResponseDto>
{
    private readonly IGeminiAiService _geminiAiService;
    private readonly IExerciseService _exerciseService;
    private readonly IProductPackageService _packageService;

    public GenerateWeeklyWorkoutPlanCommandHandler(IGeminiAiService geminiAiService, IExerciseService exerciseService, IProductPackageService packageService)
    {
        _geminiAiService = geminiAiService;
        _exerciseService = exerciseService;
        _packageService = packageService;
    }

    public async Task<AiWeeklyWorkoutPlanResponseDto> Handle(GenerateWeeklyWorkoutPlanCommand request, CancellationToken cancellationToken)
    {
        var hasHighestTier = await _packageService.HasHighestTierPackageAsync(request.UserId);
        if (!hasHighestTier)
        {
            throw new UnauthorizedAccessException("Bạn cần đăng ký gói thành viên cao cấp nhất để sử dụng tính năng tư vấn bài tập nguyên tuần.");
        }

        List<AvailableExerciseDto> availableExercises;
        try
        {
            // Lấy danh sách bài tập cho nhóm cơ yêu cầu. Nếu là Split hoặc Full Body, có thể lấy nhiều nhóm cơ hơn.
            // Để đơn giản, ta sẽ lấy các bài tập thuộc nhóm cơ yêu cầu, hoặc tất cả bài tập nếu chọn "Full Body"
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

        // Fallback mock exercises if DB is completely empty or connection failed
        if (!availableExercises.Any())
        {
            availableExercises = new List<AvailableExerciseDto>
            {
                new() { Id = 1, Title = "Push Up", Description = "Standard Push Up", CaloriesBurnPerMin = 8.0, Difficulty = "BEGINNER" },
                new() { Id = 2, Title = "Dumbbell Chest Press", Description = "Chest press with dumbbells", CaloriesBurnPerMin = 6.5, Difficulty = "INTERMEDIATE" },
                new() { Id = 3, Title = "Chest Fly", Description = "Cable Chest Fly", CaloriesBurnPerMin = 5.5, Difficulty = "ADVANCED" },
                new() { Id = 4, Title = "Squat", Description = "Bodyweight Squat", CaloriesBurnPerMin = 7.0, Difficulty = "BEGINNER" },
                new() { Id = 5, Title = "Pull Up", Description = "Standard Pull Up", CaloriesBurnPerMin = 9.0, Difficulty = "INTERMEDIATE" }
            };
        }

        var availableExercisesJson = JsonSerializer.Serialize(availableExercises);

        var aiResult = await _geminiAiService.GenerateWeeklyWorkoutPlanAsync(request.UserId, request.MuscleGroup, request.TargetCaloriesPerDay, request.DurationMinutesPerDay, request.Frequency, availableExercisesJson, request.InjuredMuscleGroups);

        if (aiResult == null || !aiResult.Success)
        {
            throw new Exception("Xử lý tạo lịch tập tuần từ Gemini AI thất bại hoặc dữ liệu trả về bị rỗng.");
        }

        return aiResult;
    }
}
