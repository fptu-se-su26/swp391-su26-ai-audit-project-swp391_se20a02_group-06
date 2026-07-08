using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FitnessTrainingSystem.Application.DTOs.Dashboard;
using FitnessTrainingSystem.Application.Interfaces;

using FitnessTrainingSystem.Infrastructure.Persistence;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _context;

    public DashboardService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardSummaryDto> GetSummaryAsync(int userId)
    {
        var dto = new DashboardSummaryDto();
        var today = DateTime.UtcNow.Date;

        // 1. Calculate Active Calories History (last 7 days) & Today
        var sevenDaysAgo = today.AddDays(-6); // Include today = 7 days
        var sessionsLast7Days = await _context.WorkoutSessions
            .Where(ws => ws.UserId == userId && ws.Status == "COMPLETED" && ws.CompletedAt != null && ws.CompletedAt.Value.Date >= sevenDaysAgo)
            .ToListAsync();

        for (int i = 0; i < 7; i++)
        {
            var date = sevenDaysAgo.AddDays(i);
            var calories = sessionsLast7Days
                .Where(ws => ws.CompletedAt!.Value.Date == date)
                .Sum(ws => ws.TotalCaloriesBurned ?? 0);
            
            dto.ActiveCaloriesHistory.Add((double)calories);
            
            if (date == today)
            {
                dto.ActiveCaloriesToday = (double)calories;
            }
        }

        // 2. Calculate Active Days This Week (Mon to Sun)
        int diff = (7 + ((int)today.DayOfWeek - (int)DayOfWeek.Monday)) % 7;
        var startOfWeek = today.AddDays(-1 * diff);
        var endOfWeek = startOfWeek.AddDays(6);

        var sessionsThisWeek = await _context.WorkoutSessions
            .Where(ws => ws.UserId == userId && ws.Status == "COMPLETED" && ws.CompletedAt != null && ws.CompletedAt.Value.Date >= startOfWeek && ws.CompletedAt.Value.Date <= endOfWeek)
            .ToListAsync();

        var activeDays = sessionsThisWeek
            .Select(ws => ws.CompletedAt!.Value.Date)
            .Distinct()
            .Select(d => (((int)d.DayOfWeek + 6) % 7)) // Mon=0, Sun=6
            .ToList();
        
        dto.ActiveDaysThisWeek = activeDays;

        // 3. Calculate Current Streak
        var allSessions = await _context.WorkoutSessions
            .Where(ws => ws.UserId == userId && ws.Status == "COMPLETED" && ws.CompletedAt != null && ws.CompletedAt.Value.Date <= today)
            .OrderByDescending(ws => ws.CompletedAt)
            .ToListAsync();

        var activeDates = allSessions
            .Select(ws => ws.CompletedAt!.Value.Date)
            .Distinct()
            .ToList();

        int streak = 0;
        var checkDate = today;
        
        // If they didn't train today, maybe streak is kept if they trained yesterday
        if (!activeDates.Contains(today) && activeDates.Contains(today.AddDays(-1)))
        {
            checkDate = today.AddDays(-1);
        }

        foreach (var date in activeDates)
        {
            if (date == checkDate)
            {
                streak++;
                checkDate = checkDate.AddDays(-1);
            }
            else if (date < checkDate)
            {
                break;
            }
        }
        
        dto.CurrentStreak = streak;

        // 4. Macros
        var todayLog = await _context.DailyNutritionLogs
            .FirstOrDefaultAsync(l => l.UserId == userId && l.LogDate == today);
        
        if (todayLog != null)
        {
            dto.ProteinConsumed = (double)todayLog.ProteinConsumedGrams;
            dto.ProteinTarget = (double)todayLog.ProteinTargetGrams;
            dto.CarbsConsumed = (double)todayLog.CarbsConsumedGrams;
            dto.CarbsTarget = (double)todayLog.CarbsTargetGrams;
            dto.FatsConsumed = (double)todayLog.FatConsumedGrams;
            dto.FatsTarget = (double)todayLog.FatTargetGrams;
        }

        return dto;
    }
}
