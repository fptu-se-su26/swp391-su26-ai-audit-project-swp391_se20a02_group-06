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
    private readonly IGroqWorkoutAiService _groqAiService;
    private readonly IExerciseService _exerciseService;
    private readonly IProductPackageService _packageService;

    public GenerateWeeklyWorkoutPlanCommandHandler(IGroqWorkoutAiService groqAiService, IExerciseService exerciseService, IProductPackageService packageService)
    {
        _groqAiService = groqAiService;
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
            var allExercises = await _exerciseService.GetAllAsync();
            availableExercises = allExercises.Select(e => new AvailableExerciseDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = "", // Omit description to reduce token usage
                MuscleGroupId = e.MuscleGroupId,
                MuscleGroupName = e.MuscleGroup,
                Equipment = "None",
                DurationMinutes = e.Duration ?? 10,
                CaloriesBurnPerMin = 5.0,
                Difficulty = e.Difficulty.ToString()
            }).ToList();
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

        // Limit exercises to reduce token count (Groq free tier: 12k TPM)
        var trimmedExercises = availableExercises
            .Take(30)
            .Select(e => new { e.Id, e.Title, e.MuscleGroupName, e.DurationMinutes, e.CaloriesBurnPerMin, e.Difficulty })
            .ToList();
        var availableExercisesJson = JsonSerializer.Serialize(trimmedExercises);

        var aiResult = await _groqAiService.GenerateWeeklyWorkoutPlanAsync(request.UserId, request.MuscleGroup, request.TargetCaloriesPerDay, request.DurationMinutesPerDay, request.Frequency, availableExercisesJson, request.InjuredMuscleGroups);

        if (aiResult == null || !aiResult.Success)
        {
            throw new Exception("Xử lý tạo lịch tập tuần từ Gemini AI thất bại hoặc dữ liệu trả về bị rỗng.");
        }

        return aiResult;
    }
}
