using FitnessTrainingSystem.Application.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using System.Threading.Tasks;
using System;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var user = _configuration["SMTP_USER"]?.Trim();
        var pass = _configuration["SMTP_PASS"]?.Replace(" ", "").Trim();

        // In development, just log the email content instead of sending
        if (string.IsNullOrEmpty(user) || string.IsNullOrEmpty(pass))
        {
            _logger.LogInformation($"[DEV] Email to {toEmail}: Subject='{subject}', Body preview='{body[..Math.Min(body.Length, 200)]}'");
            return Task.CompletedTask;
        }

        // Fire and forget so we don't block API requests when SMTP is blocked or slow on cloud providers
        _ = Task.Run(async () => 
        {
            try
            {
                var host = _configuration["SMTP_HOST"] ?? "smtp.gmail.com";
                var port = int.TryParse(_configuration["SMTP_PORT"], out int p) ? p : 587;
                var from = _configuration["SMTP_FROM"] ?? "AISTHEA <ecodanarentcar@gmail.com>";
                var enableSsl = bool.TryParse(_configuration["SMTP_ENABLE_SSL"], out bool ssl) ? ssl : true;

                var email = new MimeMessage();
                
                // Parse "Name <email@address.com>"
                var fromAddress = from;
                var fromName = "";
                if (from.Contains("<") && from.Contains(">"))
                {
                    var parts = from.Split('<');
                    fromName = parts[0].Trim();
                    fromAddress = parts[1].TrimEnd('>');
                }
                
                email.From.Add(new MailboxAddress(fromName, fromAddress));
                email.To.Add(new MailboxAddress("", toEmail));
                email.Subject = subject;

                var builder = new BodyBuilder
                {
                    HtmlBody = body
                };

                email.Body = builder.ToMessageBody();

                using var smtp = new SmtpClient();
                smtp.Timeout = 10000; // 10 seconds timeout instead of 100s default
                smtp.ServerCertificateValidationCallback = (s, c, ch, e) => true;
                
                if (enableSsl)
                {
                    await smtp.ConnectAsync(host, port, SecureSocketOptions.StartTls);
                }
                else
                {
                    await smtp.ConnectAsync(host, port, SecureSocketOptions.None);
                }

                if (!string.IsNullOrEmpty(user) && !string.IsNullOrEmpty(pass))
                {
                    await smtp.AuthenticateAsync(user, pass);
                }
                
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
                
                _logger.LogInformation($"Successfully sent email to {toEmail} with subject: {subject}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {toEmail}");
            }
        });

        return Task.CompletedTask;
    }
}
