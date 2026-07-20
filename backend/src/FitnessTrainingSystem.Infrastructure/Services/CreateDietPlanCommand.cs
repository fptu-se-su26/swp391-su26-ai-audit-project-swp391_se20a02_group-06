using MediatR;
using FitnessTrainingSystem.Application.DTOs.Nutrition;

namespace FitnessTrainingSystem.Application.Features.Nutrition;

// Định nghĩa dữ liệu đầu vào nhận từ Client gửi lên
public record CreateDietPlanCommand(int UserId, string UserRequest) : IRequest<DietPlanResponse>;