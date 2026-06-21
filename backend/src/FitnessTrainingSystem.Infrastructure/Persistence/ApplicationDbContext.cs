using FitnessTrainingSystem.Domain.Entities;
﻿using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

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

        modelBuilder.Entity<AiRecommendation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("ai_recommendations");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AiResponse).HasColumnName("ai_response");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.ModelName)
                .HasMaxLength(100)
                .HasColumnName("model_name");
            entity.Property(e => e.Type)
                .HasColumnType("enum('WORKOUT_PLAN','NUTRITION_DIET')")
                .HasColumnName("type");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.UserRequest)
                .HasColumnType("text")
                .HasColumnName("user_request");

            entity.HasOne(d => d.User).WithMany(p => p.AiRecommendations)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("ai_recommendations_ibfk_1");
        });

        modelBuilder.Entity<BodyMetric>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("body_metrics");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Bmi)
                .HasPrecision(5, 2)
                .HasColumnName("bmi");
            entity.Property(e => e.BodyFatPercentage)
                .HasPrecision(4, 2)
                .HasColumnName("body_fat_percentage");
            entity.Property(e => e.Height)
                .HasPrecision(5, 2)
                .HasColumnName("height");
            entity.Property(e => e.MuscleMass)
                .HasPrecision(5, 2)
                .HasColumnName("muscle_mass");
            entity.Property(e => e.RecordedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("recorded_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Weight)
                .HasPrecision(5, 2)
                .HasColumnName("weight");

            entity.HasOne(d => d.User).WithMany(p => p.BodyMetrics)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("body_metrics_ibfk_1");
        });

        modelBuilder.Entity<Exercise>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("exercises");

            entity.HasIndex(e => e.CreatedBy, "created_by");

            entity.HasIndex(e => e.MuscleGroupId, "muscle_group_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CaloriesBurnPerMin)
                .HasPrecision(5, 2)
                .HasDefaultValueSql("'0.00'")
                .HasColumnName("calories_burn_per_min");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.Difficulty)
                .HasColumnType("enum('BEGINNER','INTERMEDIATE','ADVANCED')")
                .HasColumnName("difficulty");
            entity.Property(e => e.DurationMinutes).HasColumnName("duration_minutes");
            entity.Property(e => e.Equipment)
                .HasMaxLength(100)
                .HasDefaultValueSql("'No Equipment'")
                .HasColumnName("equipment");
            entity.Property(e => e.MuscleGroupId).HasColumnName("muscle_group_id");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'APPROVED'")
                .HasColumnType("enum('PENDING','APPROVED','REJECTED')")
                .HasColumnName("status");
            entity.Property(e => e.ThumbnailUrl)
                .HasMaxLength(255)
                .HasColumnName("thumbnail_url");
            entity.Property(e => e.Title)
                .HasMaxLength(150)
                .HasColumnName("title");
            entity.Property(e => e.VideoUrl)
                .HasMaxLength(255)
                .HasColumnName("video_url");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Exercises)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("exercises_ibfk_2");

            entity.HasOne(d => d.MuscleGroup).WithMany(p => p.Exercises)
                .HasForeignKey(d => d.MuscleGroupId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("exercises_ibfk_1");
        });

        modelBuilder.Entity<Food>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("foods");

            entity.HasIndex(e => e.Name, "name").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Calories).HasColumnName("calories");
            entity.Property(e => e.Carbs)
                .HasPrecision(5, 2)
                .HasDefaultValueSql("'0.00'")
                .HasColumnName("carbs");
            entity.Property(e => e.Fat)
                .HasPrecision(5, 2)
                .HasDefaultValueSql("'0.00'")
                .HasColumnName("fat");
            entity.Property(e => e.ImageUrl)
                .HasMaxLength(255)
                .HasColumnName("image_url");
            entity.Property(e => e.Name)
                .HasMaxLength(150)
                .HasColumnName("name");
            entity.Property(e => e.Protein)
                .HasPrecision(5, 2)
                .HasDefaultValueSql("'0.00'")
                .HasColumnName("protein");
            entity.Property(e => e.ServingSize)
                .HasMaxLength(50)
                .HasColumnName("serving_size");
            entity.Property(e => e.Unit)
                .HasMaxLength(30)
                .HasColumnName("unit");
        });

        modelBuilder.Entity<MealSchedule>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("meal_schedules");

            entity.HasIndex(e => e.AiRecommendationId, "ai_recommendation_id");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AiRecommendationId).HasColumnName("ai_recommendation_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.EatTime)
                .HasColumnType("time")
                .HasColumnName("eat_time");
            entity.Property(e => e.ScheduleName)
                .HasMaxLength(100)
                .HasColumnName("schedule_name");
            entity.Property(e => e.TotalCaloriesTarget).HasColumnName("total_calories_target");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.AiRecommendation).WithMany(p => p.MealSchedules)
                .HasForeignKey(d => d.AiRecommendationId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("meal_schedules_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.MealSchedules)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("meal_schedules_ibfk_1");
        });

        modelBuilder.Entity<MealScheduleItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("meal_schedule_items");

            entity.HasIndex(e => e.FoodId, "food_id");

            entity.HasIndex(e => e.MealScheduleId, "meal_schedule_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Amount)
                .HasMaxLength(50)
                .HasColumnName("amount");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.FoodId).HasColumnName("food_id");
            entity.Property(e => e.IsEaten)
                .HasDefaultValueSql("'0'")
                .HasColumnName("is_eaten");
            entity.Property(e => e.MealScheduleId).HasColumnName("meal_schedule_id");

            entity.HasOne(d => d.Food).WithMany(p => p.MealScheduleItems)
                .HasForeignKey(d => d.FoodId)
                .HasConstraintName("meal_schedule_items_ibfk_2");

            entity.HasOne(d => d.MealSchedule).WithMany(p => p.MealScheduleItems)
                .HasForeignKey(d => d.MealScheduleId)
                .HasConstraintName("meal_schedule_items_ibfk_1");
        });

        modelBuilder.Entity<MembershipSubscription>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("membership_subscriptions");

            entity.HasIndex(e => e.OrderId, "order_id");

            entity.HasIndex(e => e.PackageId, "package_id");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.EndDate)
                .HasColumnType("datetime")
                .HasColumnName("end_date");
            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.PackageId).HasColumnName("package_id");
            entity.Property(e => e.StartDate)
                .HasColumnType("datetime")
                .HasColumnName("start_date");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'ACTIVE'")
                .HasColumnType("enum('ACTIVE','EXPIRED','CANCELLED')")
                .HasColumnName("status");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Order).WithMany(p => p.MembershipSubscriptions)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("membership_subscriptions_ibfk_3");

            entity.HasOne(d => d.Package).WithMany(p => p.MembershipSubscriptions)
                .HasForeignKey(d => d.PackageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("membership_subscriptions_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.MembershipSubscriptions)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("membership_subscriptions_ibfk_1");
        });

        modelBuilder.Entity<MuscleGroup>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("muscle_groups");

            entity.HasIndex(e => e.Name, "name").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("notifications");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content)
                .HasColumnType("text")
                .HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.IsRead)
                .HasDefaultValueSql("'0'")
                .HasColumnName("is_read");
            entity.Property(e => e.Title)
                .HasMaxLength(150)
                .HasColumnName("title");
            entity.Property(e => e.Type)
                .HasDefaultValueSql("'SYSTEM'")
                .HasColumnType("enum('SYSTEM','WORKOUT','SCHEDULE','PAYMENT','MEMBERSHIP')")
                .HasColumnName("type");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("notifications_ibfk_1");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("orders");

            entity.HasIndex(e => e.PackageId, "package_id");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PackageId).HasColumnName("package_id");
            entity.Property(e => e.PaymentStatus)
                .HasDefaultValueSql("'PENDING'")
                .HasColumnType("enum('PENDING','PAID','FAILED','CANCELLED')")
                .HasColumnName("payment_status");
            entity.Property(e => e.PricePaid)
                .HasPrecision(10, 2)
                .HasColumnName("price_paid");
            entity.Property(e => e.PurchasedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("purchased_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Package).WithMany(p => p.Orders)
                .HasForeignKey(d => d.PackageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("orders_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("orders_ibfk_1");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("payments");

            entity.HasIndex(e => e.OrderId, "order_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Amount)
                .HasPrecision(10, 2)
                .HasColumnName("amount");
            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.PaidAt)
                .HasColumnType("datetime")
                .HasColumnName("paid_at");
            entity.Property(e => e.PaymentMethod)
                .HasColumnType("enum('CASH','MOMO','VNPAY','PAYOS','BANK_TRANSFER')")
                .HasColumnName("payment_method");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'PENDING'")
                .HasColumnType("enum('PENDING','SUCCESS','FAILED')")
                .HasColumnName("status");
            entity.Property(e => e.TransactionCode)
                .HasMaxLength(100)
                .HasColumnName("transaction_code");

            entity.HasOne(d => d.Order).WithMany(p => p.Payments)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("payments_ibfk_1");
        });

        modelBuilder.Entity<ProductPackage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("product_packages");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.DurationDays).HasColumnName("duration_days");
            entity.Property(e => e.IsActive)
                .HasDefaultValueSql("'1'")
                .HasColumnName("is_active");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Price)
                .HasPrecision(10, 2)
                .HasColumnName("price");
            entity.Property(e => e.Type)
                .HasColumnType("enum('MEMBERSHIP','ONLINE_WORKOUT')")
                .HasColumnName("type");
        });

        modelBuilder.Entity<PtProfile>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("pt_profiles");

            entity.HasIndex(e => e.UserId, "user_id").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Bio)
                .HasColumnType("text")
                .HasColumnName("bio");
            entity.Property(e => e.CertificateUrl)
                .HasMaxLength(255)
                .HasColumnName("certificate_url");
            entity.Property(e => e.ExperienceYears)
                .HasDefaultValueSql("'0'")
                .HasColumnName("experience_years");
            entity.Property(e => e.HourlyRate)
                .HasPrecision(10, 2)
                .HasDefaultValueSql("'0.00'")
                .HasColumnName("hourly_rate");
            entity.Property(e => e.Rating)
                .HasPrecision(3, 2)
                .HasDefaultValueSql("'5.00'")
                .HasColumnName("rating");
            entity.Property(e => e.Specialization)
                .HasMaxLength(150)
                .HasColumnName("specialization");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithOne(p => p.PtProfile)
                .HasForeignKey<PtProfile>(d => d.UserId)
                .HasConstraintName("pt_profiles_ibfk_1");
        });

        modelBuilder.Entity<PtUploadRequest>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("pt_upload_requests");

            entity.HasIndex(e => e.AdminId, "admin_id");

            entity.HasIndex(e => e.ExerciseId, "exercise_id");

            entity.HasIndex(e => e.PtId, "pt_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AdminId).HasColumnName("admin_id");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.ExerciseId).HasColumnName("exercise_id");
            entity.Property(e => e.PtId).HasColumnName("pt_id");
            entity.Property(e => e.ReviewNote)
                .HasColumnType("text")
                .HasColumnName("review_note");
            entity.Property(e => e.ReviewedAt)
                .HasColumnType("datetime")
                .HasColumnName("reviewed_at");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'PENDING'")
                .HasColumnType("enum('PENDING','APPROVED','REJECTED')")
                .HasColumnName("status");
            entity.Property(e => e.SubmittedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("submitted_at");
            entity.Property(e => e.Title)
                .HasMaxLength(150)
                .HasColumnName("title");
            entity.Property(e => e.VideoUrl)
                .HasMaxLength(255)
                .HasColumnName("video_url");

            entity.HasOne(d => d.Admin).WithMany(p => p.PtUploadRequestAdmins)
                .HasForeignKey(d => d.AdminId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("pt_upload_requests_ibfk_3");

            entity.HasOne(d => d.Exercise).WithMany(p => p.PtUploadRequests)
                .HasForeignKey(d => d.ExerciseId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("pt_upload_requests_ibfk_2");

            entity.HasOne(d => d.Pt).WithMany(p => p.PtUploadRequestPts)
                .HasForeignKey(d => d.PtId)
                .HasConstraintName("pt_upload_requests_ibfk_1");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("roles");

            entity.HasIndex(e => e.RoleName, "role_name").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.RoleName)
                .HasMaxLength(50)
                .HasColumnName("role_name");
        });

        modelBuilder.Entity<Schedule>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("schedules");

            entity.HasIndex(e => e.MemberId, "member_id");

            entity.HasIndex(e => e.PtId, "pt_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CancelReason)
                .HasColumnType("text")
                .HasColumnName("cancel_reason");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.EndTime)
                .HasColumnType("datetime")
                .HasColumnName("end_time");
            entity.Property(e => e.MeetingUrl)
                .HasMaxLength(512)
                .HasColumnName("meeting_url");
            entity.Property(e => e.MemberId).HasColumnName("member_id");
            entity.Property(e => e.Note)
                .HasColumnType("text")
                .HasColumnName("note");
            entity.Property(e => e.PtId).HasColumnName("pt_id");
            entity.Property(e => e.StartTime)
                .HasColumnType("datetime")
                .HasColumnName("start_time");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'PENDING'")
                .HasColumnType("enum('PENDING','CONFIRMED','COMPLETED','CANCELLED')")
                .HasColumnName("status");

            entity.HasOne(d => d.Member).WithMany(p => p.ScheduleMembers)
                .HasForeignKey(d => d.MemberId)
                .HasConstraintName("schedules_ibfk_2");

            entity.HasOne(d => d.Pt).WithMany(p => p.SchedulePts)
                .HasForeignKey(d => d.PtId)
                .HasConstraintName("schedules_ibfk_1");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.HasIndex(e => e.RoleId, "role_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(255)
                .HasColumnName("avatar_url");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.Fullname)
                .HasMaxLength(100)
                .HasColumnName("fullname");
            entity.Property(e => e.Gender)
                .HasColumnType("enum('MALE','FEMALE','OTHER')")
                .HasColumnName("gender");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("password_hash");
            entity.Property(e => e.GoogleId).HasMaxLength(255).HasColumnName("google_id");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .HasColumnName("phone");
            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'ACTIVE'")
                .HasColumnType("enum('ACTIVE','INACTIVE','BANNED')")
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("users_ibfk_1");
        });

        modelBuilder.Entity<WorkoutPlan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("workout_plans");

            entity.HasIndex(e => e.AiRecommendationId, "ai_recommendation_id");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AiRecommendationId).HasColumnName("ai_recommendation_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedByAi)
                .HasDefaultValueSql("'1'")
                .HasColumnName("created_by_ai");
            entity.Property(e => e.Goal)
                .HasMaxLength(150)
                .HasColumnName("goal");
            entity.Property(e => e.TargetCalories).HasColumnName("target_calories");
            entity.Property(e => e.TargetDurationMinutes).HasColumnName("target_duration_minutes");
            entity.Property(e => e.Title)
                .HasMaxLength(150)
                .HasColumnName("title");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.AiRecommendation).WithMany(p => p.WorkoutPlans)
                .HasForeignKey(d => d.AiRecommendationId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("workout_plans_ibfk_2");

            entity.HasOne(d => d.User).WithMany(p => p.WorkoutPlans)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("workout_plans_ibfk_1");
        });

        modelBuilder.Entity<WorkoutPlanExercise>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("workout_plan_exercises");

            entity.HasIndex(e => e.ExerciseId, "exercise_id");

            entity.HasIndex(e => e.WorkoutPlanId, "workout_plan_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DurationSeconds).HasColumnName("duration_seconds");
            entity.Property(e => e.ExerciseId).HasColumnName("exercise_id");
            entity.Property(e => e.ExerciseOrder)
                .HasDefaultValueSql("'1'")
                .HasColumnName("exercise_order");
            entity.Property(e => e.Reps).HasColumnName("reps");
            entity.Property(e => e.RestSeconds)
                .HasDefaultValueSql("'60'")
                .HasColumnName("rest_seconds");
            entity.Property(e => e.Sets)
                .HasDefaultValueSql("'1'")
                .HasColumnName("sets");
            entity.Property(e => e.WorkoutPlanId).HasColumnName("workout_plan_id");

            entity.HasOne(d => d.Exercise).WithMany(p => p.WorkoutPlanExercises)
                .HasForeignKey(d => d.ExerciseId)
                .HasConstraintName("workout_plan_exercises_ibfk_2");

            entity.HasOne(d => d.WorkoutPlan).WithMany(p => p.WorkoutPlanExercises)
                .HasForeignKey(d => d.WorkoutPlanId)
                .HasConstraintName("workout_plan_exercises_ibfk_1");
        });

        modelBuilder.Entity<WorkoutSession>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("workout_sessions");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.HasIndex(e => e.WorkoutPlanId, "workout_plan_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CompletedAt)
                .HasColumnType("datetime")
                .HasColumnName("completed_at");
            entity.Property(e => e.StartedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("started_at");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'IN_PROGRESS'")
                .HasColumnType("enum('IN_PROGRESS','COMPLETED','CANCELLED')")
                .HasColumnName("status");
            entity.Property(e => e.TotalCaloriesBurned)
                .HasPrecision(8, 2)
                .HasDefaultValueSql("'0.00'")
                .HasColumnName("total_calories_burned");
            entity.Property(e => e.TotalDurationMinutes)
                .HasDefaultValueSql("'0'")
                .HasColumnName("total_duration_minutes");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.WorkoutPlanId).HasColumnName("workout_plan_id");

            entity.HasOne(d => d.User).WithMany(p => p.WorkoutSessions)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("workout_sessions_ibfk_1");

            entity.HasOne(d => d.WorkoutPlan).WithMany(p => p.WorkoutSessions)
                .HasForeignKey(d => d.WorkoutPlanId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("workout_sessions_ibfk_2");
        });

        modelBuilder.Entity<WorkoutSessionDetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("workout_session_details");

            entity.HasIndex(e => e.ExerciseId, "exercise_id");

            entity.HasIndex(e => e.WorkoutSessionId, "workout_session_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CaloriesBurned)
                .HasPrecision(8, 2)
                .HasDefaultValueSql("'0.00'")
                .HasColumnName("calories_burned");
            entity.Property(e => e.DurationSeconds)
                .HasDefaultValueSql("'0'")
                .HasColumnName("duration_seconds");
            entity.Property(e => e.ExerciseId).HasColumnName("exercise_id");
            entity.Property(e => e.RepsDone)
                .HasDefaultValueSql("'0'")
                .HasColumnName("reps_done");
            entity.Property(e => e.SetsDone)
                .HasDefaultValueSql("'0'")
                .HasColumnName("sets_done");
            entity.Property(e => e.WorkoutSessionId).HasColumnName("workout_session_id");

            entity.HasOne(d => d.Exercise).WithMany(p => p.WorkoutSessionDetails)
                .HasForeignKey(d => d.ExerciseId)
                .HasConstraintName("workout_session_details_ibfk_2");

            entity.HasOne(d => d.WorkoutSession).WithMany(p => p.WorkoutSessionDetails)
                .HasForeignKey(d => d.WorkoutSessionId)
                .HasConstraintName("workout_session_details_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
