namespace FitnessTrainingSystem.Application.Interfaces;

public interface ICloudinaryService
{
    /// <summary>
    /// Uploads a video stream to Cloudinary and returns the secure hosted URL.
    /// </summary>
    Task<string> UploadVideoAsync(Stream fileStream, string fileName);
}
