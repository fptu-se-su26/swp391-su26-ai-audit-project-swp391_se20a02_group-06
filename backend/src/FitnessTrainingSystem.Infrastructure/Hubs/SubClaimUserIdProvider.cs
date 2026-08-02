using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace FitnessTrainingSystem.Infrastructure.Hubs
{
    public class SubClaimUserIdProvider : IUserIdProvider
    {
        public string? GetUserId(HubConnectionContext connection)
        {
            return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? connection.User?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        }
    }
}
