using FitnessTrainingSystem.Application.DTOs.Exercises;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Domain.Entities;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class ExerciseService : IExerciseService
{
    private readonly ApplicationDbContext _context;

    public ExerciseService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ExerciseDto>> GetAllAsync(int? userId = null)
    {
        var query = _context.Exercises
            .Include(e => e.Creator)
            .Include(e => e.MuscleGroup)
            .Include(e => e.Package)
            .AsQueryable();

        // If user is logged in, check their subscription to determine which exercises they can see
        if (userId.HasValue)
        {
            var activeSub = await _context.MembershipSubscriptions
                .Include(s => s.Package)
                .Where(s => s.UserId == userId.Value && s.Status == "ACTIVE" && s.EndDate > DateTime.UtcNow)
                .OrderByDescending(s => s.StartDate)
                .FirstOrDefaultAsync();

            if (activeSub != null)
            {
                var userTier = activeSub.Package?.Tier ?? 0;
                // User can see: free exercises (package_id = NULL) + exercises with tier <= userTier
                query = query.Where(e => e.Package == null || e.Package.Tier <= userTier);
            }
            else
            {
                // Free user: only see exercises with no package
                query = query.Where(e => e.Package == null);
            }
        }
        else
        {
            // Anonymous: only free exercises
            query = query.Where(e => e.Package == null);
        }

        return await query
            .Select(e => new ExerciseDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                VideoUrl = e.VideoUrl,
                MuscleGroup = e.MuscleGroup != null ? e.MuscleGroup.Name : null,
                MuscleGroupId = e.MuscleGroupId,
                Difficulty = e.Difficulty,
                Duration = e.DurationMinutes,
                CreatedBy = e.CreatedBy,
                CreatorName = e.Creator != null ? e.Creator.Fullname : null,
                PackageId = e.PackageId
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<ExerciseDto>> GetMyExercisesAsync(int creatorId)
    {
        return await _context.Exercises
            .Include(e => e.Creator)
            .Include(e => e.MuscleGroup)
            .Include(e => e.Package)
            .Where(e => e.CreatedBy == creatorId)
            .Select(e => new ExerciseDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                VideoUrl = e.VideoUrl,
                MuscleGroup = e.MuscleGroup != null ? e.MuscleGroup.Name : null,
                MuscleGroupId = e.MuscleGroupId,
                Difficulty = e.Difficulty,
                Duration = e.DurationMinutes,
                CreatedBy = e.CreatedBy,
                CreatorName = e.Creator != null ? e.Creator.Fullname : null,
                PackageId = e.PackageId
            })
            .ToListAsync();
    }

    public async Task<ExerciseDto?> GetByIdAsync(int id)
    {
        var exercise = await _context.Exercises
            .Include(e => e.Creator)
            .Include(e => e.MuscleGroup)
            .Include(e => e.Package)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (exercise == null) return null;

        return new ExerciseDto
        {
            Id = exercise.Id,
            Title = exercise.Title,
            Description = exercise.Description,
            VideoUrl = exercise.VideoUrl,
            MuscleGroup = exercise.MuscleGroup?.Name,
            MuscleGroupId = exercise.MuscleGroupId,
            Difficulty = exercise.Difficulty,
            Duration = exercise.DurationMinutes,
            CreatedBy = exercise.CreatedBy,
            CreatorName = exercise.Creator?.Fullname,
            PackageId = exercise.PackageId
        };
    }

    public async Task<ExerciseDto> CreateAsync(CreateExerciseDto dto, int createdByUserId)
    {
        int? muscleGroupId = null;
        if (!string.IsNullOrEmpty(dto.MuscleGroup))
        {
            var mg = await _context.MuscleGroups.FirstOrDefaultAsync(m => m.Name == dto.MuscleGroup);
            muscleGroupId = mg?.Id;
        }

        var exercise = new Exercise
        {
            Title = dto.Title,
            Description = dto.Description,
            VideoUrl = dto.VideoUrl,
            MuscleGroupId = muscleGroupId,
            Difficulty = dto.Difficulty,
            DurationMinutes = dto.Duration,
            CreatedBy = createdByUserId,
            PackageId = dto.PackageId
        };

        _context.Exercises.Add(exercise);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(exercise.Id) ?? throw new Exception("Failed to retrieve created exercise.");
    }

    public async Task<bool> UpdateAsync(int id, UpdateExerciseDto dto)
    {
        var exercise = await _context.Exercises.FindAsync(id);
        if (exercise == null) return false;

        int? muscleGroupId = null;
        if (!string.IsNullOrEmpty(dto.MuscleGroup))
        {
            var mg = await _context.MuscleGroups.FirstOrDefaultAsync(m => m.Name == dto.MuscleGroup);
            muscleGroupId = mg?.Id;
        }

        exercise.Title = dto.Title;
        exercise.Description = dto.Description;
        exercise.VideoUrl = dto.VideoUrl;
        exercise.MuscleGroupId = muscleGroupId;
        exercise.Difficulty = dto.Difficulty;
        exercise.DurationMinutes = dto.Duration;
        exercise.PackageId = dto.PackageId;

        _context.Exercises.Update(exercise);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var exercise = await _context.Exercises.FindAsync(id);
        if (exercise == null) return false;

        _context.Exercises.Remove(exercise);
        await _context.SaveChangesAsync();

        return true;
    }
}
