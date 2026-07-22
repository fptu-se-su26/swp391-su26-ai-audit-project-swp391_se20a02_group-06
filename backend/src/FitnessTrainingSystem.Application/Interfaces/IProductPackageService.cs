using FitnessTrainingSystem.Application.DTOs.ProductPackages;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IProductPackageService
{
    Task<IEnumerable<ProductPackageDto>> GetAllAsync(int? currentUserId = null);
    Task<ProductPackageDto?> GetByIdAsync(int id, int? currentUserId = null);
    Task<ProductPackageDto> CreateAsync(CreateProductPackageDto dto);
    Task<bool> UpdateAsync(int id, UpdateProductPackageDto dto);
    Task<bool> DeleteAsync(int id);
}
