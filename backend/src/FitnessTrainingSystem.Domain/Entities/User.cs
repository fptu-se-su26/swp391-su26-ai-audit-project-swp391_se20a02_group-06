using FitnessTrainingSystem.Domain.Common;

namespace FitnessTrainingSystem.Domain.Entities;

public class User : BaseAuditableEntity
{
    public string Fullname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PasswordHash { get; set; }
    public string? GoogleId { get; set; }
    public string? Phone { get; set; }
    public int? RoleId { get; set; }

    // Navigation properties
    public Role? Role { get; set; }
    public PtProfile? PtProfile { get; set; }
    
    public ICollection<BodyMetric> BodyMetrics { get; set; } = new List<BodyMetric>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Schedule> PtSchedules { get; set; } = new List<Schedule>();
    public ICollection<Schedule> MemberSchedules { get; set; } = new List<Schedule>();
    public ICollection<Exercise> CreatedExercises { get; set; } = new List<Exercise>();
    public ICollection<WorkoutLog> WorkoutLogs { get; set; } = new List<WorkoutLog>();
    public ICollection<AiRecommendation> AiRecommendations { get; set; } = new List<AiRecommendation>();
    public ICollection<MealSchedule> MealSchedules { get; set; } = new List<MealSchedule>();
    public ICollection<Menu> Menus { get; set; } = new List<Menu>();
}
