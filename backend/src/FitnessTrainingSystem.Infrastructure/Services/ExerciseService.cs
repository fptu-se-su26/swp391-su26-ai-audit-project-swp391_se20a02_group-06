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

    public async Task<IEnumerable<ExerciseDto>> GetAllAsync(int? userId = null, bool? isAdmin = false)
    {
        var query = _context.Exercises
            .Include(e => e.Creator)
            .Include(e => e.MuscleGroup)
            .Include(e => e.Package)
            .Where(e => !e.IsDraft)
            .AsQueryable();

        // Admin sees all exercises
        if (isAdmin == true)
        {
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

    public async Task<IEnumerable<ExerciseCatalogDto>> GetCatalogAsync(int? userId = null)
    {
        var query = _context.Exercises
            .Include(e => e.MuscleGroup)
            .Include(e => e.Package)
            .Where(e => !e.IsDraft)
            .AsQueryable();

        int? userTier = null;

        if (userId.HasValue)
        {
            var activeSub = await _context.MembershipSubscriptions
                .Include(s => s.Package)
                .Where(s => s.UserId == userId.Value && s.Status == "ACTIVE" && s.EndDate > DateTime.UtcNow)
                .OrderByDescending(s => s.StartDate)
                .FirstOrDefaultAsync();

            if (activeSub != null)
            {
                userTier = activeSub.Package?.Tier;
            }
        }

        var exercises = await query.ToListAsync();

        return exercises.Select(e =>
        {
            var isLocked = e.Package != null && (userTier == null || e.Package.Tier > userTier);

            string? thumbUrl = null;
            if (!isLocked && !string.IsNullOrEmpty(e.VideoUrl))
            {
                thumbUrl = ExtractThumbnailUrl(e.VideoUrl);
            }

            return new ExerciseCatalogDto
            {
                Id = e.Id,
                Title = e.Title,
                MuscleGroup = e.MuscleGroup?.Name,
                MuscleGroupId = e.MuscleGroupId,
                Difficulty = (int)e.Difficulty,
                Description = e.Description,
                VideoUrl = isLocked ? null : e.VideoUrl,
                DurationMinutes = e.DurationMinutes,
                PackageId = e.PackageId,
                PackageName = e.Package?.Name,
                IsLocked = isLocked,
                ThumbnailUrl = thumbUrl,
            };
        }).ToList();
    }

    private static string? ExtractThumbnailUrl(string videoUrl)
    {
        var youtubeMatch = System.Text.RegularExpressions.Regex.Match(videoUrl,
            @"(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([a-zA-Z0-9_-]{11})");
        if (youtubeMatch.Success)
            return $"https://img.youtube.com/vi/{youtubeMatch.Groups[1].Value}/mqdefault.jpg";

        var cloudinaryMatch = System.Text.RegularExpressions.Regex.Match(videoUrl,
            @"^(https?://res\.cloudinary\.com/[^/]+/video/upload/)(.+)$");
        if (cloudinaryMatch.Success)
            return $"{cloudinaryMatch.Groups[1].Value}so_0/{System.Text.RegularExpressions.Regex.Replace(cloudinaryMatch.Groups[2].Value, @"\.\w+$", ".jpg")}";

        if (System.Text.RegularExpressions.Regex.IsMatch(videoUrl, @"\.(gif|jpg|jpeg|png|webp)(\?|$)"))
            return videoUrl;

        return null;
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
                PackageId = e.PackageId,
                IsDraft = e.IsDraft
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
            PackageId = exercise.PackageId,
            IsDraft = exercise.IsDraft
        };
    }

    public async Task<bool> HasAccessAsync(int id, int? userId)
    {
        var exercise = await _context.Exercises
            .Include(e => e.Package)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (exercise == null) return false;
        if (exercise.Package == null) return true;

        if (userId == null) return false;

        var activeSub = await _context.MembershipSubscriptions
            .Include(s => s.Package)
            .Where(s => s.UserId == userId.Value && s.Status == "ACTIVE" && s.EndDate > DateTime.UtcNow)
            .OrderByDescending(s => s.StartDate)
            .FirstOrDefaultAsync();

        if (activeSub == null) return false;

        return activeSub.Package?.Tier >= exercise.Package.Tier;
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
            PackageId = dto.PackageId,
            IsDraft = dto.IsDraft
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
        if (dto.CreatedBy.HasValue)
            exercise.CreatedBy = dto.CreatedBy.Value;

        _context.Exercises.Update(exercise);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var exercise = await _context.Exercises.FindAsync(id);
        if (exercise == null) return false;

        var relatedRequests = await _context.PtUploadRequests
            .Where(r => r.ExerciseId == id)
            .ToListAsync();

        foreach (var request in relatedRequests)
        {
            request.ExerciseId = null;
        }

        _context.Exercises.Remove(exercise);
        await _context.SaveChangesAsync();

        return true;
    }
}
