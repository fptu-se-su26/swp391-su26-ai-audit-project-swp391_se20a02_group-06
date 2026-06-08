using FitnessTrainingSystem.Domain.Entities;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}
