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
    public virtual DbSet<EmailOTP> EmailOTPs { get; set; }

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

    public virtual DbSet<AIChatSession> AIChatSessions { get; set; }

    public virtual DbSet<AIChatMessage> AIChatMessages { get; set; }

    public virtual DbSet<AIDietHistory> AIDietHistories { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Schedule> Schedules { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<WorkoutPlan> WorkoutPlans { get; set; }

    public virtual DbSet<WorkoutPlanExercise> WorkoutPlanExercises { get; set; }

    public virtual DbSet<WorkoutSession> WorkoutSessions { get; set; }

    public virtual DbSet<WorkoutSessionDetail> WorkoutSessionDetails { get; set; }

    public virtual DbSet<DailyNutritionLog> DailyNutritionLogs { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Properties<FitnessTrainingSystem.Domain.Enums.RecommendationType>().HaveConversion<string>();
        configurationBuilder.Properties<FitnessTrainingSystem.Domain.Enums.ExerciseDifficulty>().HaveConversion<string>();
        configurationBuilder.Properties<FitnessTrainingSystem.Domain.Enums.PackageType>().HaveConversion<string>();
        configurationBuilder.Properties<FitnessTrainingSystem.Domain.Enums.ScheduleStatus>().HaveConversion<string>();
    }

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

        modelBuilder.Entity<EmailOTP>(entity =>
        {
            entity.ToTable("EmailOTP");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasMaxLength(36);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Purpose).HasMaxLength(50);
            entity.HasIndex(e => e.Email).HasDatabaseName("IX_EmailOTP_Email");
            entity.HasIndex(e => e.Purpose).HasDatabaseName("IX_EmailOTP_Purpose");
            entity.HasIndex(e => e.ExpiredAt).HasDatabaseName("IX_EmailOTP_ExpiredAt");
        });
        modelBuilder.Entity<DailyNutritionLog>(entity =>
        {
            entity.HasIndex(e => new { e.UserId, e.LogDate })
                  .IsUnique()
                  .HasDatabaseName("IX_DailyNutritionLog_UserId_LogDate");
        });

        modelBuilder.Entity<PtUploadRequest>(entity =>
        {
            entity.ToTable("pt_upload_requests");
            entity.HasOne(r => r.Pt)
                .WithMany()
                .HasForeignKey(r => r.PtId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(r => r.Admin)
                .WithMany()
                .HasForeignKey(r => r.AdminId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.RequestedByUser)
                .WithMany()
                .HasForeignKey(r => r.RequestedBy)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Exercise>()
            .HasOne(e => e.Creator)
            .WithMany(u => u.CreatedExercises)
            .HasForeignKey(e => e.CreatedBy);

        modelBuilder.Entity<Exercise>()
            .HasOne(e => e.MuscleGroup)
            .WithMany(m => m.Exercises)
            .HasForeignKey(e => e.MuscleGroupId);

        modelBuilder.Entity<Exercise>()
            .Property(e => e.DurationMinutes)
            .HasColumnName("duration");

        modelBuilder.Entity<Exercise>()
            .Property(e => e.Difficulty)
            .HasConversion(
                v => v.ToString().ToUpper(),
                v => (FitnessTrainingSystem.Domain.Enums.ExerciseDifficulty)System.Enum.Parse(typeof(FitnessTrainingSystem.Domain.Enums.ExerciseDifficulty), v, true)
            );
    }
}

