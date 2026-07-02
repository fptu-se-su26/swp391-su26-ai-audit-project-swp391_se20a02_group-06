using FitnessTrainingSystem.Application.DTOs.Exercises;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.Infrastructure.Services
{
    public class MuscleGroupService : IMuscleGroupService
    {
        private readonly ApplicationDbContext _context;

        public MuscleGroupService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MuscleGroupDto>> GetAllMuscleGroupsAsync()
        {
            var muscleGroups = await _context.MuscleGroups
                .Select(mg => new MuscleGroupDto
                {
                    Id = mg.Id,
                    Name = mg.Name,
                    Description = mg.Description
                })
                .ToListAsync();

            return muscleGroups;
        }
    }
}
