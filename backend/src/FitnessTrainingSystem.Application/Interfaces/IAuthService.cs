using FitnessTrainingSystem.Application.DTOs.Auth;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
    Task<AuthResponseDto> GoogleLoginAsync(GoogleLoginRequestDto request);
}
