using Microsoft.EntityFrameworkCore;
using FitnessTrainingSystem.Domain.Entities;

namespace FitnessTrainingSystem.Infrastructure.Persistence;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AiRecommendation> AiRecommendations { get; set; }

    public virtual DbSet<BodyMetric> BodyMetrics { get; set; }

    public virtual DbSet<Exercise> Exercises { get; set; }

    public virtual DbSet<Food> Foods { get; set; }

    public virtual DbSet<MealSchedule> MealSchedules { get; set; }

    public virtual DbSet<MealScheduleItem> MealScheduleItems { get; set; }

    public virtual DbSet<MembershipSubscription> MembershipSubscriptions { get; set; }

    public virtual DbSet<MuscleGroup> MuscleGroups { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<ProductPackage> ProductPackages { get; set; }

    public virtual DbSet<PtProfile> PtProfiles { get; set; }

    public virtual DbSet<PtUploadRequest> PtUploadRequests { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Schedule> Schedules { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<WorkoutPlan> WorkoutPlans { get; set; }

    public virtual DbSet<WorkoutPlanExercise> WorkoutPlanExercises { get; set; }

    public virtual DbSet<WorkoutSession> WorkoutSessions { get; set; }

    public virtual DbSet<WorkoutSessionDetail> WorkoutSessionDetails { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_unicode_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<AiRecommendation>(entity =>
        {
            entity.ToTable("ai_recommendations");
            entity.HasIndex(e => e.UserId, "user_id");
        });

        modelBuilder.Entity<Schedule>()
            .HasOne(s => s.Pt)
            .WithMany(u => u.PtSchedules)
            .HasForeignKey(s => s.PtId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Schedule>()
            .HasOne(s => s.Member)
            .WithMany(u => u.MemberSchedules)
            .HasForeignKey(s => s.MemberId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Exercise>()
            .HasOne(e => e.Creator)
            .WithMany()
            .HasForeignKey(e => e.CreatedBy);

        modelBuilder.Entity<Exercise>()
            .HasOne(e => e.MuscleGroup)
            .WithMany(m => m.Exercises)
            .HasForeignKey(e => e.MuscleGroupId);

        modelBuilder.Entity<Exercise>()
            .Property(e => e.Difficulty)
            .HasConversion<string>();

        modelBuilder.Entity<ProductPackage>()
            .Property(p => p.Type)
            .HasConversion<string>();
    }
}
