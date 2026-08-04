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

        var exerciseItems = new List<ExerciseItemOutput>();
        int order = 1;
        decimal totalCalories = 0;
        int totalDuration = 0;

        foreach (var ex in availableExercises.Take(5))
        {
            var sets = 3;
            var reps = 12;
            var durationSecs = 60; // 1 min
            var restSecs = 30; // 30 sec
            
            var totalExDurationMins = (durationSecs + restSecs) * sets / 60;
            var calsBurned = (decimal)(totalExDurationMins * ex.CaloriesBurnPerMin);

            exerciseItems.Add(new ExerciseItemOutput
            {
                ExerciseId = ex.Id,
                ExerciseTitle = ex.Title,
                Sets = sets,
                Reps = reps,
                DurationSeconds = durationSecs,
                RestSeconds = restSecs,
                ExerciseOrder = order++,
                CaloriesBurned = calsBurned
            });
            
            totalCalories += calsBurned;
            totalDuration += totalExDurationMins;
        }

        var planOutput = new WorkoutPlanOutput
        {
            Title = $"Buổi tập {request.MuscleGroup}",
            Goal = $"Tập trung phát triển cơ {request.MuscleGroup}",
            TargetCalories = totalCalories,
            TargetDurationMinutes = totalDuration,
            Exercises = exerciseItems
        };

        return new AiWorkoutPlanResponseDto
        {
            Success = true,
            UserId = request.UserId,
            Model = "Manual (No AI)",
            Recommendation = planOutput
        };
    }
}
