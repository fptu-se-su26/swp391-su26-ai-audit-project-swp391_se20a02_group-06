using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public DbSet<FitnessTrainingSystem.Domain.Entities.User> Users { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Automatically apply all entity configurations defined in this assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        modelBuilder.Entity<FitnessTrainingSystem.Domain.Entities.Schedule>()
            .HasOne(s => s.Pt)
            .WithMany(u => u.PtSchedules)
            .HasForeignKey(s => s.PtId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<FitnessTrainingSystem.Domain.Entities.Schedule>()
            .HasOne(s => s.Member)
            .WithMany(u => u.MemberSchedules)
            .HasForeignKey(s => s.MemberId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
