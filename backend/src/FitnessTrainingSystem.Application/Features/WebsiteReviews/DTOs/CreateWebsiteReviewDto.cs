using System.ComponentModel.DataAnnotations;

namespace FitnessTrainingSystem.Application.Features.WebsiteReviews.DTOs;

public class CreateWebsiteReviewDto
{
    [Required(ErrorMessage = "Số sao đánh giá là bắt buộc.")]
    [Range(1, 5, ErrorMessage = "Số sao phải từ 1 đến 5.")]
    public int Rating { get; set; }

    [MaxLength(1000, ErrorMessage = "Nội dung nhận xét tối đa 1000 ký tự.")]
    public string? Comment { get; set; }
}
