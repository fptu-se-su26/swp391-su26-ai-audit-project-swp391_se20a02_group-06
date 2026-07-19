using FitnessTrainingSystem.Domain.Common;

namespace FitnessTrainingSystem.Domain.Entities;

public class User : BaseAuditableEntity
{
    public string Fullname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PasswordHash { get; set; }
    public string? GoogleId { get; set; }
    public string? Phone { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Status { get; set; } = "ACTIVE";
    public DateTime? UpdatedAt { get; set; }
    public DateTime? PasswordChangedAt { get; set; }
    public int? RoleId { get; set; }

    // Navigation properties
    public Role? Role { get; set; }
    public PtProfile? PtProfile { get; set; }
 
    public ICollection<BodyMetric> BodyMetrics { get; set; } = new List<BodyMetric>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Schedule> PtSchedules { get; set; } = new List<Schedule>();
    public ICollection<Schedule> MemberSchedules { get; set; } = new List<Schedule>();
    public ICollection<Exercise> CreatedExercises { get; set; } = new List<Exercise>();
    public ICollection<WorkoutSession> WorkoutSessions { get; set; } = new List<WorkoutSession>();
    public ICollection<AiRecommendation> AiRecommendations { get; set; } = new List<AiRecommendation>();
    public ICollection<MealSchedule> MealSchedules { get; set; } = new List<MealSchedule>();
<<<<<<< HEAD
    public ICollection<DailyNutritionLog> DailyNutritionLogs { get; set; } = new List<DailyNutritionLog>();
    public ICollection<MembershipSubscription> MembershipSubscriptions { get; set; } = new List<MembershipSubscription>();
=======

    public ICollection<AIChatSession>AIChatSessions
                = new List<AIChatSession>();
    public ICollection<AIDietHistory>AIDietHistories
                = new List<AIDietHistory>();

>>>>>>> origin/feature/AI_Nutrition
}
