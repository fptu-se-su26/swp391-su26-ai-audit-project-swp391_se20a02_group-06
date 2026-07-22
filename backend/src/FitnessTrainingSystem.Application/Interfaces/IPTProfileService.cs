using FitnessTrainingSystem.Application.DTOs.PTs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IPTProfileService
{
    Task<PTProfileDto?> GetProfileAsync(int userId);
    Task<bool> UpdateProfileAsync(int userId, UpdatePTProfileDto dto);
    Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
}
