using System.Threading.Tasks;

namespace FitnessTrainingSystem.Application.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string body);
}
