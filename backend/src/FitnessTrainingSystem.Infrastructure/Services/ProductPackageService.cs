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

    public async Task<IEnumerable<ProductPackageDto>> GetAllAsync(int? currentUserId = null)
    {
        var packages = await _context.ProductPackages.ToListAsync();

        var activePackageIds = new HashSet<int>();
        if (currentUserId.HasValue)
        {
            var now = DateTime.UtcNow;
            activePackageIds = (await _context.MembershipSubscriptions
                .Where(s => s.UserId == currentUserId.Value && s.Status == "ACTIVE" && s.EndDate >= now)
                .Select(s => s.PackageId)
                .ToListAsync())
                .ToHashSet();
        }

        var dtos = _mapper.Map<List<ProductPackageDto>>(packages);
        foreach (var dto in dtos)
        {
            if (activePackageIds.Contains(dto.Id))
                dto.IsPurchased = true;
        }

        return dtos;
    }

    public async Task<ProductPackageDto?> GetByIdAsync(int id, int? currentUserId = null)
    {
        var package = await _context.ProductPackages.FindAsync(id);
        if (package == null) return null;

        var dto = _mapper.Map<ProductPackageDto>(package);

        if (currentUserId.HasValue)
        {
            var now = DateTime.UtcNow;
            var isPurchased = await _context.MembershipSubscriptions
                .AnyAsync(s => s.UserId == currentUserId.Value && s.PackageId == id && s.Status == "ACTIVE" && s.EndDate >= now);
            dto.IsPurchased = isPurchased;
        }

        return dto;
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
}
