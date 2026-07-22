using System;
using System.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using FitnessTrainingSystem.Domain.Entities;
using FitnessTrainingSystem.Infrastructure.Persistence;

namespace EFTestApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Querying database...");
            try
            {
                var connectionString = "Server=127.0.0.1;Port=3306;Database=FitnessProject;User=root;Password=Hung29022004;AllowPublicKeyRetrieval=True;CharSet=utf8mb4;ConvertZeroDateTime=True;";
                
                var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
                optionsBuilder.UseMySql(connectionString, Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.42-mysql"))
                              .UseSnakeCaseNamingConvention();
                
                using var db = new ApplicationDbContext(optionsBuilder.Options);
                
                var muscleGroups = db.MuscleGroups.ToList();
                Console.WriteLine($"Found {muscleGroups.Count} muscle groups:");
                foreach (var mg in muscleGroups)
                {
                    var count = db.Exercises.Count(e => e.MuscleGroupId == mg.Id);
                    Console.WriteLine($"- ID {mg.Id}: {mg.Name} ({count} exercises)");
                }

                Console.WriteLine("\nAll Exercises in DB:");
                var exercises = db.Exercises.Include(e => e.MuscleGroup).ToList();
                foreach (var ex in exercises)
                {
                    Console.WriteLine($"- ID {ex.Id}: {ex.Title} (Muscle Group: {ex.MuscleGroup?.Name ?? "None"}, Difficulty: {ex.Difficulty})");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"CRASH: {ex.Message}");
                if (ex.InnerException != null)
                    Console.WriteLine($"   Inner: {ex.InnerException.Message}");
            }
        }
    }

    class DbContextForTest : DbContext
    {
        public DbContextForTest(DbContextOptions<DbContextForTest> options) : base(options) {}
        public DbSet<MuscleGroup> MuscleGroups { get; set; }
        public DbSet<Exercise> Exercises { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
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
                entity.Property(e => e.Id).HasColumnType("char(36)");
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.Purpose).HasMaxLength(50);
            });
        }
    }

    class DynamicDbContext : DbContext
    {
        private readonly Type _entityType;
        public DynamicDbContext(Type entityType)
        {
            _entityType = entityType;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql("server=localhost;database=FitnessProject;user=root;password=test", 
                                    Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.42-mysql"));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity(_entityType);

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
                entity.Property(e => e.Id).HasColumnType("char(36)");
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.Purpose).HasMaxLength(50);
                entity.HasIndex(e => e.Email).HasDatabaseName("IX_EmailOTP_Email");
                entity.HasIndex(e => e.Purpose).HasDatabaseName("IX_EmailOTP_Purpose");
                entity.HasIndex(e => e.ExpiredAt).HasDatabaseName("IX_EmailOTP_ExpiredAt");
            });
        }
    }
}
