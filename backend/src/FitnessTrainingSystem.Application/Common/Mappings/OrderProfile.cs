using AutoMapper;
using FitnessTrainingSystem.Application.DTOs.Orders;
using FitnessTrainingSystem.Domain.Entities;

namespace FitnessTrainingSystem.Application.Common.Mappings;

public class OrderProfile : Profile
{
    public OrderProfile()
    {
        CreateMap<Order, OrderDto>();
    }
}
