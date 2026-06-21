using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class User
{
    public int Id { get; set; }

    public string Fullname { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;
    public string? GoogleId { get; set; }

    public string? Phone { get; set; }

    public string? AvatarUrl { get; set; }

    public string? Gender { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public int RoleId { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<AiRecommendation> AiRecommendations { get; set; } = new List<AiRecommendation>();

    public virtual ICollection<BodyMetric> BodyMetrics { get; set; } = new List<BodyMetric>();

    public virtual ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();

    public virtual ICollection<MealSchedule> MealSchedules { get; set; } = new List<MealSchedule>();

    public virtual ICollection<MembershipSubscription> MembershipSubscriptions { get; set; } = new List<MembershipSubscription>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual PtProfile? PtProfile { get; set; }

    public virtual ICollection<PtUploadRequest> PtUploadRequestAdmins { get; set; } = new List<PtUploadRequest>();

    public virtual ICollection<PtUploadRequest> PtUploadRequestPts { get; set; } = new List<PtUploadRequest>();

    public virtual Role Role { get; set; } = null!;

    public virtual ICollection<Schedule> ScheduleMembers { get; set; } = new List<Schedule>();

    public virtual ICollection<Schedule> SchedulePts { get; set; } = new List<Schedule>();

    public virtual ICollection<WorkoutPlan> WorkoutPlans { get; set; } = new List<WorkoutPlan>();

    public virtual ICollection<WorkoutSession> WorkoutSessions { get; set; } = new List<WorkoutSession>();
}
