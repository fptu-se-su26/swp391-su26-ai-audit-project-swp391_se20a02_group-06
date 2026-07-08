using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FitnessTrainingSystem.Application.DTOs.Notifications;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Domain.Entities;
using FitnessTrainingSystem.Infrastructure.Hubs;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class NotificationService : INotificationService
{
    private readonly ApplicationDbContext _context;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationService(ApplicationDbContext context, IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async Task<NotificationDto> SendNotificationAsync(int userId, string title, string content, string type)
    {
        var notification = new Notification
        {
            UserId = userId,
            Title = title,
            Content = content,
            Type = type,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        var dto = new NotificationDto
        {
            Id = notification.Id,
            UserId = notification.UserId,
            Title = notification.Title,
            Content = notification.Content,
            Type = notification.Type,
            IsRead = notification.IsRead ?? false,
            CreatedAt = notification.CreatedAt ?? DateTime.UtcNow
        };

        // Push realtime via SignalR
        try
        {
            await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveNotification", dto);
        }
        catch (Exception ex)
        {
            // Log or ignore connection issues (e.g. if no clients are connected for this user)
            Console.WriteLine($"SignalR push failed for User {userId}: {ex.Message}");
        }

        return dto;
    }

    public async Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(int userId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        return notifications.Select(n => new NotificationDto
        {
            Id = n.Id,
            UserId = n.UserId,
            Title = n.Title,
            Content = n.Content,
            Type = n.Type,
            IsRead = n.IsRead ?? false,
            CreatedAt = n.CreatedAt ?? DateTime.UtcNow
        });
    }

    public async Task<bool> MarkAsReadAsync(int notificationId, int userId)
    {
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);

        if (notification == null) return false;

        notification.IsRead = true;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> MarkAllAsReadAsync(int userId)
    {
        var unread = await _context.Notifications
            .Where(n => n.UserId == userId && (n.IsRead == null || n.IsRead == false))
            .ToListAsync();

        foreach (var item in unread)
        {
            item.IsRead = true;
        }

        await _context.SaveChangesAsync();
        return true;
    }
}
