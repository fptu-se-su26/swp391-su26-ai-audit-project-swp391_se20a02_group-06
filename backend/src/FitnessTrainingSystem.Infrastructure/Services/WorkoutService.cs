using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FitnessTrainingSystem.Application.DTOs.Workouts;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Domain.Entities;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class WorkoutService : IWorkoutService
{
    private readonly ApplicationDbContext _context;

    public WorkoutService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<WorkoutPlanDto> CreateWorkoutPlanAsync(int userId, CreateWorkoutPlanDto dto)
    {
        var exerciseIds = dto.Exercises.Select(e => e.ExerciseId).ToList();
        await ValidateExerciseAccessAsync(userId, exerciseIds);

        var plan = new WorkoutPlan
        {
            UserId = userId,
            Title = dto.Title,
            Goal = dto.Goal,
            TargetCalories = dto.TargetCalories,
            TargetDurationMinutes = dto.TargetDurationMinutes,
            CreatedAt = DateTime.UtcNow,
            CreatedByAi = true
        };

        foreach (var exDto in dto.Exercises)
        {
            plan.WorkoutPlanExercises.Add(new WorkoutPlanExercise
            {
                ExerciseId = exDto.ExerciseId,
                Sets = exDto.Sets,
                Reps = exDto.Reps,
                DurationSeconds = exDto.DurationSeconds,
                RestSeconds = exDto.RestSeconds,
                ExerciseOrder = exDto.ExerciseOrder
            });
        }

        _context.WorkoutPlans.Add(plan);
        await _context.SaveChangesAsync();

        return new WorkoutPlanDto
        {
            Id = plan.Id,
            UserId = plan.UserId,
            Title = plan.Title,
            Goal = plan.Goal,
            TargetCalories = plan.TargetCalories,
            TargetDurationMinutes = plan.TargetDurationMinutes,
            CreatedAt = plan.CreatedAt
        };
    }

    public async Task<WorkoutSessionDto> StartSessionAsync(int userId, CreateWorkoutSessionDto dto)
    {
        var session = new WorkoutSession
        {
            UserId = userId,
            WorkoutPlanId = dto.WorkoutPlanId,
            Status = "IN_PROGRESS",
            StartedAt = DateTime.UtcNow
        };

        _context.WorkoutSessions.Add(session);
        await _context.SaveChangesAsync();

        return MapToSessionDto(session);
    }

    public async Task<WorkoutSessionDto> CompleteSessionAsync(int userId, int sessionId, CompleteWorkoutSessionDto dto)
    {
        var session = await _context.WorkoutSessions
            .Include(s => s.WorkoutSessionDetails)
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

        if (session == null)
            throw new Exception("Session not found or does not belong to user");

        var exerciseIds = dto.Details.Select(d => d.ExerciseId).ToList();
        await ValidateExerciseAccessAsync(userId, exerciseIds);

        session.Status = "COMPLETED";
        session.CompletedAt = DateTime.UtcNow;
        session.TotalDurationMinutes = dto.TotalDurationMinutes;
        session.TotalCaloriesBurned = dto.TotalCaloriesBurned;

        foreach (var detailDto in dto.Details)
        {
            session.WorkoutSessionDetails.Add(new WorkoutSessionDetail
            {
                ExerciseId = detailDto.ExerciseId,
                SetsDone = detailDto.SetsDone,
                RepsDone = detailDto.RepsDone,
                DurationSeconds = detailDto.DurationSeconds,
                CaloriesBurned = detailDto.CaloriesBurned
            });
        }

        await _context.SaveChangesAsync();

        // Re-fetch to include Exercise names
        session = await _context.WorkoutSessions
            .Include(s => s.WorkoutSessionDetails)
            .ThenInclude(d => d.Exercise)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        return MapToSessionDto(session!);
    }

    public async Task<IEnumerable<WorkoutSessionDto>> GetUserWorkoutHistoryAsync(int userId, string filter = "all")
    {
        var query = _context.WorkoutSessions
            .Include(s => s.WorkoutSessionDetails)
            .ThenInclude(d => d.Exercise)
            .Where(s => s.UserId == userId && s.Status == "COMPLETED")
            .AsQueryable();

        if (filter == "day")
        {
            var today = DateTime.UtcNow.Date;
            query = query.Where(s => s.StartedAt >= today);
        }
        else if (filter == "week")
        {
            var lastWeek = DateTime.UtcNow.AddDays(-7);
            query = query.Where(s => s.StartedAt >= lastWeek);
        }
        else if (filter == "month")
        {
            var lastMonth = DateTime.UtcNow.AddDays(-30);
            query = query.Where(s => s.StartedAt >= lastMonth);
        }

        var sessions = await query
            .OrderByDescending(s => s.StartedAt)
            .ToListAsync();

        return sessions.Select(MapToSessionDto);
    }

    private WorkoutSessionDto MapToSessionDto(WorkoutSession session)
    {
        return new WorkoutSessionDto
        {
            Id = session.Id,
            UserId = session.UserId,
            WorkoutPlanId = session.WorkoutPlanId,
            TotalDurationMinutes = session.TotalDurationMinutes,
            TotalCaloriesBurned = session.TotalCaloriesBurned,
            Status = session.Status,
            StartedAt = session.StartedAt,
            CompletedAt = session.CompletedAt,
            Details = session.WorkoutSessionDetails.Select(d => new WorkoutSessionDetailDto
            {
                ExerciseId = d.ExerciseId,
                ExerciseName = d.Exercise?.Title,
                SetsDone = d.SetsDone,
                RepsDone = d.RepsDone,
                DurationSeconds = d.DurationSeconds,
                CaloriesBurned = d.CaloriesBurned
            }).ToList()
        };
    }

    private async Task ValidateExerciseAccessAsync(int userId, List<int> exerciseIds)
    {
        if (exerciseIds.Count == 0) return;

        var activeSub = await _context.MembershipSubscriptions
            .Include(s => s.Package)
            .Where(s => s.UserId == userId && s.Status == "ACTIVE" && s.EndDate > DateTime.UtcNow)
            .OrderByDescending(s => s.StartDate)
            .FirstOrDefaultAsync();

        var userTier = activeSub?.Package?.Tier;

        var inaccessibleExercises = await _context.Exercises
            .Include(e => e.Package)
            .Where(e => e.Package != null)
            .ToListAsync();

        inaccessibleExercises = inaccessibleExercises
            .Where(e => exerciseIds.Contains(e.Id))
            .Where(e => userTier == null || e.Package!.Tier > userTier)
            .ToList();

        if (inaccessibleExercises.Count > 0)
        {
            var names = string.Join(", ", inaccessibleExercises.Select(e => $"'{e.Title}' (requires {e.Package!.Name})"));
            throw new UnauthorizedAccessException($"Access denied to exercises: {names}. Please upgrade your plan.");
        }
    }
}
