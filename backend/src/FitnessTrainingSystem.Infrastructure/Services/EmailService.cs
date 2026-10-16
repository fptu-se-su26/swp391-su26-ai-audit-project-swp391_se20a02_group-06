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

    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var user = _configuration["SMTP_USER"]?.Trim();
        var pass = _configuration["SMTP_PASS"]?.Replace(" ", "").Trim();

        _logger.LogInformation($"[EmailService] Attempting to send email to {toEmail}. SMTP_USER configured: {!string.IsNullOrEmpty(user)}, SMTP_PASS configured: {!string.IsNullOrEmpty(pass)}");

        // In development, just log the email content instead of sending
        if (string.IsNullOrEmpty(user) || string.IsNullOrEmpty(pass))
        {
            _logger.LogInformation($"[DEV] Email to {toEmail}: Subject='{subject}', Body preview='{body[..Math.Min(body.Length, 200)]}'");
            return;
        }

        var host = _configuration["SMTP_HOST"] ?? "smtp.gmail.com";
        var port = int.TryParse(_configuration["SMTP_PORT"], out int p) ? p : 587;
        var from = _configuration["SMTP_FROM"] ?? $"NETFIT <{user}>";
        var enableSsl = bool.TryParse(_configuration["SMTP_ENABLE_SSL"], out bool ssl) ? ssl : true;

        _logger.LogInformation($"[EmailService] Connecting to SMTP: host={host}, port={port}, enableSsl={enableSsl}");

        try
        {
            var email = new MimeMessage();
            
            // Parse "Name <email@address.com>"
            var fromAddress = user;
            var fromName = "NETFIT";
            if (from.Contains("<") && from.Contains(">"))
            {
                var parts = from.Split('<');
                fromName = parts[0].Trim().Trim('"');
                var parsedAddr = parts[1].TrimEnd('>', ' ', '"');
                if (!string.IsNullOrWhiteSpace(parsedAddr))
                {
                    fromAddress = parsedAddr;
                }
            }
            
            email.From.Add(new MailboxAddress(fromName, fromAddress));
            email.To.Add(new MailboxAddress("", toEmail));
            email.Subject = subject;

            var builder = new BodyBuilder { HtmlBody = body };
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            smtp.Timeout = 30000; // 30s
            smtp.ServerCertificateValidationCallback = (s, c, ch, e) => true;
            
            var socketOptions = port switch
            {
                465 => SecureSocketOptions.SslOnConnect,
                587 => SecureSocketOptions.StartTls,
                _ => enableSsl ? SecureSocketOptions.Auto : SecureSocketOptions.None
            };

            _logger.LogInformation($"[EmailService] Connecting to {host}:{port} with {socketOptions}...");
            await smtp.ConnectAsync(host, port, socketOptions);
            _logger.LogInformation($"[EmailService] Connected. Authenticating as {user}...");
            
            await smtp.AuthenticateAsync(user, pass);
            _logger.LogInformation($"[EmailService] Authenticated. Sending email...");
            
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
            
            _logger.LogInformation($"[EmailService] Successfully sent email to {toEmail} with subject: {subject}");
        }
        catch (MailKit.Net.Smtp.SmtpCommandException smtpEx)
        {
            _logger.LogError(smtpEx, $"[EmailService] SMTP command error sending to {toEmail}. StatusCode: {smtpEx.StatusCode}, ErrorCode: {smtpEx.ErrorCode}");
            throw new InvalidOperationException($"Lỗi SMTP khi gửi email: {smtpEx.Message} (StatusCode: {smtpEx.StatusCode})", smtpEx);
        }
        catch (MailKit.Security.AuthenticationException authEx)
        {
            _logger.LogError(authEx, $"[EmailService] SMTP authentication failed for user {user}. Verify Gmail App Password is correct and 2FA is enabled.");
            throw new InvalidOperationException("Xác thực SMTP thất bại. Vui lòng kiểm tra lại App Password Gmail.", authEx);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"[EmailService] Failed to send email to {toEmail}. Type: {ex.GetType().Name}, Message: {ex.Message}");
            throw;
        }
    }
}
