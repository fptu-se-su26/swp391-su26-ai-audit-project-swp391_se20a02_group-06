using AutoMapper;
using FitnessTrainingSystem.Application.DTOs.ProductPackages;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Domain.Entities;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class ProductPackageService : IProductPackageService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ProductPackageService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductPackageDto>> GetAllAsync()
    {
        var packages = await _context.ProductPackages.ToListAsync();
        return _mapper.Map<IEnumerable<ProductPackageDto>>(packages);
    }

    public async Task<ProductPackageDto?> GetByIdAsync(int id)
    {
        var package = await _context.ProductPackages.FindAsync(id);
        if (package == null) return null;

        return _mapper.Map<ProductPackageDto>(package);
    }

    public async Task<ProductPackageDto> CreateAsync(CreateProductPackageDto dto)
    {
        var package = _mapper.Map<ProductPackage>(dto);
        _context.ProductPackages.Add(package);
        await _context.SaveChangesAsync();

        return _mapper.Map<ProductPackageDto>(package);
    }

    public async Task<bool> UpdateAsync(int id, UpdateProductPackageDto dto)
    {
        var package = await _context.ProductPackages.FindAsync(id);
        if (package == null) return false;

        _mapper.Map(dto, package);
        await _context.SaveChangesAsync();
        
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var package = await _context.ProductPackages.FindAsync(id);
        if (package == null) return false;

        _context.ProductPackages.Remove(package);
        await _context.SaveChangesAsync();
        
        return true;
    }
        
    public async Task<bool> HasHighestTierPackageAsync(int userId)
    {
        var maxTier = await _context.ProductPackages.MaxAsync(p => (int?)p.Tier) ?? 0;
        
        var userActiveSub = await _context.MembershipSubscriptions
            .Include(s => s.Package)
            .Where(s => s.UserId == userId && s.Status == "ACTIVE" && s.EndDate > DateTime.UtcNow)
            .OrderByDescending(s => s.StartDate)
            .FirstOrDefaultAsync();

        if (userActiveSub?.Package == null) return false;

        return userActiveSub.Package.Tier >= maxTier;
    }
}
