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

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;database=FitnessProject;user=root;password=Levandat2004^", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.42-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_unicode_ci")
            .HasCharSet("utf8mb4");

public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<ProductPackage> ProductPackages { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<AiRecommendation> AiRecommendations { get; set; }
    public DbSet<BodyMetric> BodyMetrics { get; set; }
    public DbSet<Exercise> Exercises { get; set; }
    public DbSet<Food> Foods { get; set; }
    public DbSet<MealSchedule> MealSchedules { get; set; }
    public DbSet<MealScheduleItem> MealScheduleItems { get; set; }
    public DbSet<PtProfile> PtProfiles { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<WorkoutSession> WorkoutSessions { get; set; }
    public DbSet<WorkoutSessionDetail> WorkoutSessionDetails { get; set; }

            entity.ToTable("ai_recommendations");

            entity.HasIndex(e => e.UserId, "user_id");

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
    }
}
