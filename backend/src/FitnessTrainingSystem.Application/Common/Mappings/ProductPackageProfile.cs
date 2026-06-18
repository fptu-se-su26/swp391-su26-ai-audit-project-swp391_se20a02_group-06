using AutoMapper;
using FitnessTrainingSystem.Application.DTOs.ProductPackages;
using FitnessTrainingSystem.Domain.Entities;

namespace FitnessTrainingSystem.Application.Common.Mappings;

public class ProductPackageProfile : Profile
{
    public ProductPackageProfile()
    {
        CreateMap<ProductPackage, ProductPackageDto>();
        CreateMap<CreateProductPackageDto, ProductPackage>();
        CreateMap<UpdateProductPackageDto, ProductPackage>();
    }
}
