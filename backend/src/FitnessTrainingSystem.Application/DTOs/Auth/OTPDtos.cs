namespace FitnessTrainingSystem.Application.DTOs.Auth;

public class SendOTPDto
{
    public string Email { get; set; } = string.Empty;
}

public class VerifyOTPDto
{
    public string Email { get; set; } = string.Empty;
    public string OTPCode { get; set; } = string.Empty;
}

public class ResetPasswordDto
{
    public string Email { get; set; } = string.Empty;
    public string OTPCode { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
