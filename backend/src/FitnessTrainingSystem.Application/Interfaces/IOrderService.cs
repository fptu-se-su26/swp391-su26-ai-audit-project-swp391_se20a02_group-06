using FitnessTrainingSystem.Application.DTOs.Orders;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IOrderService
{
    Task<OrderDto> PurchasePackageAsync(int userId, PurchasePackageDto dto);
}
