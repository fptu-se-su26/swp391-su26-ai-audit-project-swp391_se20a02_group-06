namespace FitnessTrainingSystem.Application.Interfaces;

public interface IPayOSService
{
    /// <summary>
    /// Creates a PayOS payment link and returns the checkout URL.
    /// </summary>
    Task<(string checkoutUrl, string qrCode)> CreatePaymentLinkAsync(long orderCode, int amountVnd, string description, string buyerName);


}
