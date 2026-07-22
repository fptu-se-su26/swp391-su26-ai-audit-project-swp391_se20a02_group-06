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
    public virtual DbSet<DailyNutritionLog> DailyNutritionLogs { get; set; }
    public virtual DbSet<EmailOTP> EmailOTPs { get; set; }
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
  public virtual DbSet<AIChatSession> AIChatSessions { get; set; }

public virtual DbSet<AIChatMessage> AIChatMessages { get; set; }

public virtual DbSet<AIDietHistory> AIDietHistories { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Properties<FitnessTrainingSystem.Domain.Enums.RecommendationType>().HaveConversion<string>();
        configurationBuilder.Properties<FitnessTrainingSystem.Domain.Enums.ExerciseDifficulty>().HaveConversion<string>();
        configurationBuilder.Properties<FitnessTrainingSystem.Domain.Enums.PackageType>().HaveConversion<string>();
        configurationBuilder.Properties<FitnessTrainingSystem.Domain.Enums.ScheduleStatus>().HaveConversion<string>();
        configurationBuilder.Properties<FitnessTrainingSystem.Domain.Enums.PaymentStatus>().HaveConversion<string>();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

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

        // AIChatSession table mapping
        modelBuilder.Entity<AIChatSession>(entity =>
        {
            entity.ToTable("ai_chat_sessions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(x => x.User)
                .WithMany(x => x.AIChatSessions)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(x => x.Messages)
                .WithOne(x => x.Session)
                .HasForeignKey(x => x.SessionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // AIChatMessage table mapping
        modelBuilder.Entity<AIChatMessage>(entity =>
        {
            entity.ToTable("ai_chat_messages");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.SessionId).HasColumnName("session_id");
            entity.Property(e => e.Role).HasColumnName("sender");  // DB column is 'sender'
            entity.Property(e => e.Message).HasColumnName("message");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });

        // AIDietHistory table mapping
        modelBuilder.Entity<AIDietHistory>(entity =>
        {
            entity.ToTable("ai_diet_histories");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.SessionId).HasColumnName("session_id");
            entity.Property(e => e.DietTitle).HasColumnName("diet_title");
            entity.Property(e => e.TotalCalories).HasColumnName("total_calories");
            entity.Property(e => e.Protein).HasColumnName("protein");
            entity.Property(e => e.Carbs).HasColumnName("carbs");
            entity.Property(e => e.Fat).HasColumnName("fat");
            entity.Property(e => e.DietJson).HasColumnName("raw_json");  // DB column is 'raw_json'
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");

            entity.HasOne(x => x.User)
                .WithMany(x => x.AIDietHistories)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.Session)
                .WithMany()
                .HasForeignKey(x => x.SessionId)
                .OnDelete(DeleteBehavior.SetNull);
        });
        modelBuilder.Entity<Exercise>()
            .HasOne(e => e.MuscleGroup)
            .WithMany(m => m.Exercises)
            .HasForeignKey(e => e.MuscleGroupId);

        modelBuilder.Entity<Exercise>()
            .HasOne(e => e.Package)
            .WithMany(p => p.Exercises)
            .HasForeignKey(e => e.PackageId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<MembershipSubscription>()
            .HasOne(s => s.User)
            .WithMany(u => u.MembershipSubscriptions)
            .HasForeignKey(s => s.UserId);

        modelBuilder.Entity<MembershipSubscription>()
            .HasOne(s => s.Package)
            .WithMany()
            .HasForeignKey(s => s.PackageId);
    }
}
