using System.Collections.Generic;
using System.Threading.Tasks;
using FitnessTrainingSystem.Application.DTOs.Notifications;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface INotificationService
{
    Task<NotificationDto> SendNotificationAsync(int userId, string title, string content, string type);
    Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(int userId);
    Task<bool> MarkAsReadAsync(int notificationId, int userId);
    Task<bool> MarkAllAsReadAsync(int userId);
}
