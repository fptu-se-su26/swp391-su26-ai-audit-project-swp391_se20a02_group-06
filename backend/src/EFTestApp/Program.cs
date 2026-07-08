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
            var entityTypes = typeof(User).Assembly.GetTypes()
                .Where(t => t.Namespace == "FitnessTrainingSystem.Domain.Entities" && t.IsClass && !t.IsAbstract)
                .ToList();

            foreach (var type in entityTypes)
            {
                Console.WriteLine($"Testing entity: {type.Name}...");
                try
                {
                    using var context = new DynamicDbContext(type);
                    var model = context.Model; // Forces model building
                    Console.WriteLine($"  -> SUCCESS");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"  -> CRASH: {ex.Message}");
                    if (ex.InnerException != null)
                        Console.WriteLine($"     Inner: {ex.InnerException.Message}");
                }
            }
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
