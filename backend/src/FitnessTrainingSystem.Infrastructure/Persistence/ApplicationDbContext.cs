using Microsoft.EntityFrameworkCore;
using FitnessTrainingSystem.Domain.Entities;

namespace FitnessTrainingSystem.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    // --- KHAI BÁO TOÀN BỘ ĐẦY ĐỦ CÁC ĐỐI TƯỢNG ĐÃ CÓ TRONG THƯ MỤC ENTITIES ---
    public DbSet<User> Users { get; set; }
    public DbSet<AiRecommendation> AiRecommendations { get; set; }
    public DbSet<BodyMetric> BodyMetrics { get; set; }
    public DbSet<EmailOTP> EmailOTPs { get; set; }
    public DbSet<Exercise> Exercises { get; set; }
    public DbSet<Food> Foods { get; set; }
    public DbSet<MealSchedule> MealSchedules { get; set; }
    public DbSet<MealScheduleItem> MealScheduleItems { get; set; }
    public DbSet<MembershipSubscription> MembershipSubscriptions { get; set; }
    public DbSet<Menu> Menus { get; set; }
    public DbSet<MuscleGroup> MuscleGroups { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<ProductPackage> ProductPackages { get; set; }
    public DbSet<PtProfile> PtProfiles { get; set; }
    public DbSet<PtUploadRequest> PtUploadRequests { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<WorkoutLog> WorkoutLogs { get; set; }
    public DbSet<WorkoutPlan> WorkoutPlans { get; set; }
    public DbSet<WorkoutPlanExercise> WorkoutPlanExercises { get; set; }
    public DbSet<WorkoutSession> WorkoutSessions { get; set; }
    public DbSet<WorkoutSessionDetail> WorkoutSessionDetails { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Tự động áp dụng tất cả các cấu hình Fluent API có trong Assembly này
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // Giữ cấu hình tránh lỗi Cascade Delete vòng lặp cho bảng Schedule
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