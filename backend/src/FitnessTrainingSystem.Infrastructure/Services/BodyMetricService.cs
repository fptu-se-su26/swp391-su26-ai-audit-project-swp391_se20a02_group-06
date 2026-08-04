using FitnessTrainingSystem.Application.DTOs.BodyMetric;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Domain.Entities;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class BodyMetricService : IBodyMetricService
{
    private readonly ApplicationDbContext _context;

    public BodyMetricService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<BodyMetricDto?> GetLatestMetricByUserIdAsync(int userId)
    {
        var metric = await _context.BodyMetrics
            .Where(m => m.UserId == userId)
            .OrderByDescending(m => m.RecordedAt)
            .FirstOrDefaultAsync();

        if (metric == null) return null;

        return new BodyMetricDto
        {
            Id = metric.Id,
            UserId = metric.UserId,
            Height = metric.Height,
            Weight = metric.Weight,
            BodyFatPercentage = metric.BodyFatPercentage,
            MuscleMass = metric.MuscleMass,
            Bmi = metric.Bmi,
            RecordedAt = metric.RecordedAt
        };
    }

    public async Task<IEnumerable<BodyMetricDto>> GetMetricsByUserIdAsync(int userId)
    {
        var metrics = await _context.BodyMetrics
            .Where(m => m.UserId == userId)
            .OrderByDescending(m => m.RecordedAt)
            .Select(m => new BodyMetricDto
            {
                Id = m.Id,
                UserId = m.UserId,
                Height = m.Height,
                Weight = m.Weight,
                BodyFatPercentage = m.BodyFatPercentage,
                MuscleMass = m.MuscleMass,
                Bmi = m.Bmi,
                RecordedAt = m.RecordedAt
            })
            .ToListAsync();

        return metrics;
    }

    public async Task<BodyMetricDto> AddMetricAsync(int userId, CreateBodyMetricDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            throw new Exception("User not found");
        }

        // Update user's age/gender if provided
        if (dto.Gender != null && user.Gender != dto.Gender)
        {
            user.Gender = dto.Gender;
        }
        if (dto.Age.HasValue)
        {
            // Simple date of birth calculation from age
            var dob = DateTime.UtcNow.AddYears(-dto.Age.Value);
            user.DateOfBirth = dob;
        }

        var metric = new BodyMetric
        {
            UserId = userId,
            Height = dto.Height,
            Weight = dto.Weight,
            BodyFatPercentage = dto.BodyFatPercentage,
            MuscleMass = dto.MuscleMass,
            Bmi = dto.Bmi,
            RecordedAt = DateTime.UtcNow
        };

        _context.BodyMetrics.Add(metric);
        await _context.SaveChangesAsync();

        return new BodyMetricDto
        {
            Id = metric.Id,
            UserId = metric.UserId,
            Height = metric.Height,
            Weight = metric.Weight,
            BodyFatPercentage = metric.BodyFatPercentage,
            MuscleMass = metric.MuscleMass,
            Bmi = metric.Bmi,
            RecordedAt = metric.RecordedAt
        };
    }
}
