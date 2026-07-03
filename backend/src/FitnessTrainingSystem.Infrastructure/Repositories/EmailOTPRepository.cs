using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Domain.Entities;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.Infrastructure.Repositories;

public class EmailOTPRepository : IEmailOTPRepository
{
    private readonly ApplicationDbContext _context;

    public EmailOTPRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task CreateOTPAsync(EmailOTP otp)
    {
        await _context.EmailOTPs.AddAsync(otp);
        await _context.SaveChangesAsync();
    }

    public async Task<EmailOTP?> GetLatestOTPAsync(string email, string purpose)
    {
        
        return await _context.EmailOTPs
            .Where(e => e.Email == email && e.Purpose == purpose)
            .OrderByDescending(e => e.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task UpdateOTPAsync(EmailOTP otp)
    {
        _context.EmailOTPs.Update(otp);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteExpiredOTPAsync()
    {
        var expired = await _context.EmailOTPs
            .Where(e => e.ExpiredAt < DateTime.UtcNow)
            .ToListAsync();
            
        if (expired.Any())
        {
            _context.EmailOTPs.RemoveRange(expired);
            await _context.SaveChangesAsync();
        }
    }
}
