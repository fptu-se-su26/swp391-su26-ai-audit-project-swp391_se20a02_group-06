using FitnessTrainingSystem.Domain.Entities;
using System.Threading.Tasks;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IEmailOTPRepository
{
    Task CreateOTPAsync(EmailOTP otp);
    Task<EmailOTP?> GetLatestOTPAsync(string email, string purpose);
    Task UpdateOTPAsync(EmailOTP otp);
    Task DeleteExpiredOTPAsync();
}
