
using PayOS;
using PayOS.Models;
using PayOS.Models.V2.PaymentRequests;
using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class PayOSService : IPayOSService
{
    private readonly PayOSClient _payOS;
    private readonly string _returnUrl;
    private readonly string _cancelUrl;

    public PayOSService(PayOSClient payOS, IConfiguration configuration)
    {
        _payOS = payOS;
        _returnUrl = configuration["PayOS:ReturnUrl"] ?? "http://localhost:5173/payment/success";
        _cancelUrl = configuration["PayOS:CancelUrl"] ?? "http://localhost:5173/payment/cancel";
    }

    public async Task<(string checkoutUrl, string qrCode)> CreatePaymentLinkAsync(long orderCode, int amountVnd, string description, string buyerName)
    {
        // Truncate description to 25 chars max (PayOS limit)
        var desc = description.Length > 25 ? description[..25] : description;

        var paymentData = new CreatePaymentLinkRequest
        {
            OrderCode = orderCode,
            Amount = amountVnd,
            Description = desc,
            CancelUrl = _cancelUrl,
            ReturnUrl = _returnUrl
        };

        var paymentLink = await _payOS.PaymentRequests.CreateAsync(paymentData);
        return (paymentLink.CheckoutUrl, paymentLink.QrCode);
    }


}
