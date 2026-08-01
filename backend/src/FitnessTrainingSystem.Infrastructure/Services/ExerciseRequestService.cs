using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FitnessTrainingSystem.Application.DTOs.Exercises;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Domain.Entities;
using FitnessTrainingSystem.Domain.Enums;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class ExerciseRequestService : IExerciseRequestService
{
    private readonly ApplicationDbContext _context;
    private readonly INotificationService _notificationService;

    public ExerciseRequestService(ApplicationDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    public async Task<ExerciseRequestDto> CreateRequestAsync(CreateExerciseRequestDto dto, int adminId)
    {
        // 1. Verify PT exists
        var ptUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == dto.PtId);
        if (ptUser == null)
        {
            throw new Exception("Personal Trainer not found.");
        }

        // 2. Create PtUploadRequest
        var request = new PtUploadRequest
        {
            PtId = dto.PtId,
            Status = "PENDING",
            RequestedBy = adminId,
            MuscleGroup = dto.MuscleGroup,
            Difficulty = dto.Difficulty.ToString(),
            Instructions = dto.Instructions,
            Priority = dto.Priority,
            Deadline = dto.Deadline,
            SubmittedAt = null,
            ReviewedAt = null
        };

        _context.PtUploadRequests.Add(request);
        await _context.SaveChangesAsync();

        // 3. Create Realtime Notification for PT via NotificationService
        var adminUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == adminId);
        var adminName = adminUser?.Fullname ?? "Admin";

        await _notificationService.SendNotificationAsync(
            dto.PtId,
            "New Exercise Request",
            $"{adminName} requested a new exercise for group: {dto.MuscleGroup ?? "General"}.",
            "EXERCISE_REQUEST"
        );

        return MapToDto(request, ptUser.Fullname, adminUser?.Fullname, null, null);
    }

    public async Task<IEnumerable<ExerciseRequestDto>> GetAllRequestsAsync()
    {
        var requests = await _context.PtUploadRequests
            .Include(r => r.Pt)
            .Include(r => r.Admin)
            .Include(r => r.RequestedByUser)
            .Include(r => r.Exercise)
            .OrderByDescending(r => r.Id)
            .ToListAsync();

        return requests.Select(r => MapToDto(r, r.Pt.Fullname, r.Admin?.Fullname, r.RequestedByUser?.Fullname, r.Exercise?.Title));
    }

    public async Task<IEnumerable<ExerciseRequestDto>> GetRequestsByPtAsync(int ptId)
    {
        var requests = await _context.PtUploadRequests
            .Include(r => r.Pt)
            .Include(r => r.Admin)
            .Include(r => r.RequestedByUser)
            .Include(r => r.Exercise)
            .Where(r => r.PtId == ptId)
            .OrderByDescending(r => r.Id)
            .ToListAsync();

        return requests.Select(r => MapToDto(r, r.Pt.Fullname, r.Admin?.Fullname, r.RequestedByUser?.Fullname, r.Exercise?.Title));
    }

    public async Task<ExerciseRequestDto> SubmitExerciseAsync(int requestId, PtSubmitExerciseDto dto, int ptId)
    {
        var request = await _context.PtUploadRequests
            .Include(r => r.Pt)
            .Include(r => r.Admin)
            .Include(r => r.RequestedByUser)
            .Include(r => r.Exercise)
            .FirstOrDefaultAsync(r => r.Id == requestId);

        if (request == null)
        {
            throw new Exception("Exercise request not found.");
        }

        if (request.PtId != ptId)
        {
            throw new Exception("You are not authorized to submit for this request.");
        }

        // Update submission details
        request.Title = dto.Title;
        request.Description = dto.Description;
        request.VideoUrl = dto.VideoUrl;
        request.Duration = dto.Duration;
        request.Status = "SUBMITTED";
        request.SubmittedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Notify Requesting Admin
        var adminIdToNotify = request.RequestedBy ?? 1; // default to first admin
        await _notificationService.SendNotificationAsync(
            adminIdToNotify,
            "Exercise Submission Received",
            $"PT {request.Pt.Fullname} submitted exercise: {dto.Title}.",
            "EXERCISE_SUBMISSION"
        );

        return MapToDto(request, request.Pt.Fullname, request.Admin?.Fullname, request.RequestedByUser?.Fullname, request.Exercise?.Title);
    }

    public async Task<ExerciseRequestDto> ReviewRequestAsync(int requestId, ReviewExerciseRequestDto dto, int adminId)
    {
        var request = await _context.PtUploadRequests
            .Include(r => r.Pt)
            .Include(r => r.Admin)
            .Include(r => r.RequestedByUser)
            .Include(r => r.Exercise)
            .FirstOrDefaultAsync(r => r.Id == requestId);

        if (request == null)
        {
            throw new Exception("Exercise request not found.");
        }

        var adminUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == adminId);
        var adminName = adminUser?.Fullname ?? "Admin";

        if (dto.Status.ToUpper() == "APPROVED")
        {
            if (string.IsNullOrEmpty(request.Title))
            {
                throw new Exception("Cannot approve a request without a submitted exercise title.");
            }

            // Look up MuscleGroup by Name (since MuscleGroup in Exercise is an entity relationship)
            var muscleGroupEntity = await _context.MuscleGroups
                .FirstOrDefaultAsync(m => m.Name.Equals(request.MuscleGroup, StringComparison.OrdinalIgnoreCase));

            // Create new Exercise
            var exercise = new Exercise
            {
                Title = request.Title,
                Description = request.Description,
                VideoUrl = request.VideoUrl,
                MuscleGroupId = muscleGroupEntity?.Id,
                Difficulty = string.IsNullOrEmpty(request.Difficulty) ? ExerciseDifficulty.Intermediate : Enum.Parse<ExerciseDifficulty>(request.Difficulty, true),
                DurationMinutes = request.Duration,
                CreatedBy = request.PtId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();

            // Link exercise to request
            request.ExerciseId = exercise.Id;
            request.Status = "APPROVED";
            request.AdminId = adminId;
            request.ReviewedAt = DateTime.UtcNow;
            request.ReviewNote = dto.ReviewNote;

            await _context.SaveChangesAsync();

            // Notify PT of approval
            await _notificationService.SendNotificationAsync(
                request.PtId,
                "Exercise Approved",
                $"Your submission '{request.Title}' has been approved by {adminName}.",
                "EXERCISE_APPROVAL"
            );
        }
        else // REJECTED
        {
            request.Status = "REJECTED";
            request.AdminId = adminId;
            request.ReviewedAt = DateTime.UtcNow;
            request.ReviewNote = dto.ReviewNote;

            await _context.SaveChangesAsync();

            // Notify PT of rejection
            await _notificationService.SendNotificationAsync(
                request.PtId,
                "Exercise Rejected",
                $"Your submission for '{request.Title ?? "Requested Exercise"}' was rejected by {adminName}. Reason: {dto.ReviewNote ?? "No reason provided."}",
                "EXERCISE_REJECTION"
            );
        }

        return MapToDto(request, request.Pt.Fullname, adminUser?.Fullname, request.RequestedByUser?.Fullname, request.Exercise?.Title);
    }

    private ExerciseRequestDto MapToDto(PtUploadRequest request, string ptName, string? adminName, string? requestedByName, string? exerciseTitle)
    {
        return new ExerciseRequestDto
        {
            Id = request.Id,
            PtId = request.PtId,
            PtName = ptName,
            ExerciseId = request.ExerciseId,
            ExerciseTitle = exerciseTitle,
            Title = request.Title,
            Description = request.Description,
            VideoUrl = request.VideoUrl,
            Status = request.Status,
            AdminId = request.AdminId,
            AdminName = adminName,
            ReviewNote = request.ReviewNote,
            SubmittedAt = request.SubmittedAt,
            ReviewedAt = request.ReviewedAt,
            RequestedBy = request.RequestedBy,
            RequestedByName = requestedByName,
            MuscleGroup = request.MuscleGroup,
            Difficulty = string.IsNullOrEmpty(request.Difficulty) ? null : Enum.Parse<ExerciseDifficulty>(request.Difficulty, true),
            Instructions = request.Instructions,
            Priority = request.Priority,
            Deadline = request.Deadline,
            Duration = request.Duration
        };
    }
}
