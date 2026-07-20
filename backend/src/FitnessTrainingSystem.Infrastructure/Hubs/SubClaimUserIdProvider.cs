using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace FitnessTrainingSystem.Infrastructure.Hubs;

public class SubClaimUserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    {
        return connection.User?.FindFirstValue("sub");
    }
}
