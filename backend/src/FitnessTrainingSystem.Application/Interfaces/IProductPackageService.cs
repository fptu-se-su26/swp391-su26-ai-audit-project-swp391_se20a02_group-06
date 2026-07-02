using FitnessTrainingSystem.Application.DTOs.ProductPackages;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IProductPackageService
{
    Task<IEnumerable<ProductPackageDto>> GetAllAsync();
    Task<ProductPackageDto?> GetByIdAsync(int id);
    Task<ProductPackageDto> CreateAsync(CreateProductPackageDto dto);
    Task<bool> UpdateAsync(int id, UpdateProductPackageDto dto);
    Task<bool> DeleteAsync(int id);
}
