using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IConfiguration configuration)
    {
        var cloudName = configuration["Cloudinary:CloudName"];
        if (string.IsNullOrWhiteSpace(cloudName))
            cloudName = Environment.GetEnvironmentVariable("Cloudinary__CloudName");
        if (string.IsNullOrWhiteSpace(cloudName))
            throw new InvalidOperationException("Cloudinary CloudName is not configured. Add Cloudinary__CloudName to your .env file.");

        var apiKey = configuration["Cloudinary:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
            apiKey = Environment.GetEnvironmentVariable("Cloudinary__ApiKey");
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new InvalidOperationException("Cloudinary ApiKey is not configured.");

        var apiSecret = configuration["Cloudinary:ApiSecret"];
        if (string.IsNullOrWhiteSpace(apiSecret))
            apiSecret = Environment.GetEnvironmentVariable("Cloudinary__ApiSecret");
        if (string.IsNullOrWhiteSpace(apiSecret))
            throw new InvalidOperationException("Cloudinary ApiSecret is not configured.");

        var account = new Account(cloudName, apiKey, apiSecret);
        _cloudinary = new Cloudinary(account);
        _cloudinary.Api.Secure = true;
    }

    public async Task<string> UploadVideoAsync(Stream fileStream, string fileName)
    {
        if (fileStream == null || fileStream.Length == 0)
            throw new ArgumentException("No file stream provided or stream is empty.");

        var uploadParams = new VideoUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = "fitness-training/exercises"
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
            throw new Exception($"Cloudinary upload failed: {result.Error.Message}");

        return result.SecureUrl.ToString();
    }

    public async Task<string> UploadImageAsync(Stream fileStream, string fileName)
    {
        if (fileStream == null || fileStream.Length == 0)
            throw new ArgumentException("No file stream provided or stream is empty.");

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = "fitness-training/avatars",
            Transformation = new CloudinaryDotNet.Transformation().Width(400).Height(400).Crop("fill")
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
            throw new Exception($"Cloudinary image upload failed: {result.Error.Message}");

        return result.SecureUrl.ToString();
    }

    public async Task<string> UploadGifAsync(Stream fileStream, string fileName)
    {
        if (fileStream == null || fileStream.Length == 0)
            throw new ArgumentException("No file stream provided or stream is empty.");

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = "fitness-training/exercises"
            // No transformation — preserve animation and aspect ratio
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
            throw new Exception($"Cloudinary GIF upload failed: {result.Error.Message}");

        return result.SecureUrl.ToString();
    }
}
