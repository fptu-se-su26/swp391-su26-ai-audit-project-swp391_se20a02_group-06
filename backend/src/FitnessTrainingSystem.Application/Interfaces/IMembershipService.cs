using FitnessTrainingSystem.Application.DTOs.Membership;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IMembershipService
{
    Task<MembershipDto?> GetCurrentSubscriptionAsync(int userId);
    Task<IEnumerable<MembershipDto>> GetAllSubscriptionsAsync();
}
