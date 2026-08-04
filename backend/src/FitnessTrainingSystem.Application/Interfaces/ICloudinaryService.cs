namespace FitnessTrainingSystem.Application.Interfaces;

public interface ICloudinaryService
{
    /// <summary>
    /// Uploads a video stream to Cloudinary and returns the secure hosted URL.
    /// </summary>
    Task<string> UploadVideoAsync(Stream fileStream, string fileName);

    /// <summary>
    /// Uploads an image stream to Cloudinary and returns the secure hosted URL.
    /// </summary>
    Task<string> UploadImageAsync(Stream fileStream, string fileName);

    /// <summary>
    /// Uploads a GIF to Cloudinary (as image resource, no cropping) and returns the secure hosted URL.
    /// </summary>
    Task<string> UploadGifAsync(Stream fileStream, string fileName);

    /// <summary>
    /// Generates authentication parameters for direct-to-Cloudinary uploads from the client.
    /// </summary>
    (string signature, long timestamp, string apiKey, string cloudName) GetSignature(string folder = "fitness-training/exercises");
}
