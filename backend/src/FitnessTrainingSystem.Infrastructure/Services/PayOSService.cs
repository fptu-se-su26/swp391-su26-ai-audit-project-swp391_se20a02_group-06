
using PayOS;
using PayOS.Models;
using PayOS.Models.V2.PaymentRequests;
using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class PayOSService : IPayOSService
{
    private readonly PayOSClient _payOS;
    private readonly string _returnUrl;
    private readonly string _cancelUrl;
    private readonly ILogger<PayOSService> _logger;

    public PayOSService(PayOSClient payOS, IConfiguration configuration, ILogger<PayOSService> logger)
    {
        _payOS = payOS;
        _returnUrl = configuration["PayOS:ReturnUrl"] ?? "https://swp391-su26-ai-audit-project-swp391-sigma.vercel.app/#/payment/success";
        _cancelUrl = configuration["PayOS:CancelUrl"] ?? "https://swp391-su26-ai-audit-project-swp391-sigma.vercel.app/#/payment/cancel";
        _logger = logger;
    }

    public async Task<(string checkoutUrl, string qrCode)> CreatePaymentLinkAsync(long orderCode, int amountVnd, string description, string buyerName, string? returnUrl = null, string? cancelUrl = null)
    {
        // Truncate description to 25 chars max (PayOS limit)
        var desc = description.Length > 25 ? description[..25] : description;

        _logger.LogInformation("[PayOS] Creating payment link for OrderCode={OrderCode}, Amount={Amount}, Desc={Desc}", orderCode, amountVnd, desc);

        var paymentData = new CreatePaymentLinkRequest
        {
            OrderCode = orderCode,
            Amount = amountVnd,
            Description = desc,
            CancelUrl = cancelUrl ?? _cancelUrl,
            ReturnUrl = returnUrl ?? _returnUrl
        };

        var paymentLink = await _payOS.PaymentRequests.CreateAsync(paymentData);

        _logger.LogInformation("[PayOS] Payment link created. CheckoutUrl={CheckoutUrl}", paymentLink?.CheckoutUrl ?? "NULL");

        if (paymentLink == null)
            throw new Exception("PayOS returned null payment link.");

        return (paymentLink.CheckoutUrl ?? "", paymentLink.QrCode ?? "");
    }
}
