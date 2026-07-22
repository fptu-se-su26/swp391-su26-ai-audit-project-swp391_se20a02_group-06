using FitnessTrainingSystem.Application.DTOs.Exercises;
using FitnessTrainingSystem.Application.DTOs.Workouts;
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

    public async Task<IEnumerable<ExerciseDto>> GetAllAsync()
    {
        return await _context.Exercises
            .Include(e => e.Creator)
            .Include(e => e.MuscleGroup)
            .Select(e => new ExerciseDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                VideoUrl = e.VideoUrl,
                ThumbnailUrl = e.ThumbnailUrl,
                MuscleGroup = e.MuscleGroup != null ? e.MuscleGroup.Name : null,
                MuscleGroupId = e.MuscleGroupId,
                Difficulty = e.Difficulty,
                Duration = e.DurationMinutes,
                CreatedBy = e.CreatedBy,
                CreatorName = e.Creator != null ? e.Creator.Fullname : null
            })
            .ToListAsync();
    }

    public async Task<ExerciseDto?> GetByIdAsync(int id)
    {
        var exercise = await _context.Exercises
            .Include(e => e.Creator)
            .Include(e => e.MuscleGroup)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (exercise == null) return null;

        return new ExerciseDto
        {
            Id = exercise.Id,
            Title = exercise.Title,
            Description = exercise.Description,
            VideoUrl = exercise.VideoUrl,
            ThumbnailUrl = exercise.ThumbnailUrl,
            MuscleGroup = exercise.MuscleGroup?.Name,
            MuscleGroupId = exercise.MuscleGroupId,
            Difficulty = exercise.Difficulty,
            Duration = exercise.DurationMinutes,
            CreatedBy = exercise.CreatedBy,
            CreatorName = exercise.Creator?.Fullname
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
            CreatedBy = createdByUserId
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

    public async Task<List<AvailableExerciseDto>> GetAvailableExercisesByMuscleGroupAsync(string muscleGroup, CancellationToken cancellationToken = default)
    {
        var targetMuscles = muscleGroup.Split(',')
            .Select(m => m.Trim().ToLower())
            .Where(m => !string.IsNullOrEmpty(m))
            .ToList();

        return await _context.Exercises
            .Include(e => e.MuscleGroup)
            .Where(e => e.MuscleGroup != null 
                && targetMuscles.Contains(e.MuscleGroup.Name.ToLower()))
            .Select(e => new AvailableExerciseDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                MuscleGroupId = e.MuscleGroupId,
                Equipment = "None",
                DurationMinutes = e.DurationMinutes,
                CaloriesBurnPerMin = 5.0,
                Difficulty = e.Difficulty.ToString()
            })
            .ToListAsync(cancellationToken);
    }
}
