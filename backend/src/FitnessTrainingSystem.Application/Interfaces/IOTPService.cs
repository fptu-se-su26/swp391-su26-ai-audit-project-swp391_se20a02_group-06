using System.Threading.Tasks;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IOTPService
{
    Task<string> SendRegisterOTPAsync(string email);
    Task<bool> VerifyRegisterOTPAsync(string email, string otpCode);
    
    Task<string> SendForgotPasswordOTPAsync(string email);
    Task<bool> VerifyForgotPasswordOTPAsync(string email, string otpCode);
}
