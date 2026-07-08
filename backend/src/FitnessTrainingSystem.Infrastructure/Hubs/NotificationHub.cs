using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace FitnessTrainingSystem.Infrastructure.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        // Connection mapping logic can go here if needed.
        // By default, SignalR automatically maps User.FindFirst(ClaimTypes.NameIdentifier) to Context.UserIdentifier
        // so HubContext.Clients.User(userId) will map perfectly if authorization token is correctly parsed!
        await base.OnConnectedAsync();
    }
}
