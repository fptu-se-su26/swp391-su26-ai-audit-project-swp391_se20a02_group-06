using FitnessTrainingSystem.Application.DTOs.Auth;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Domain.Entities;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IConfiguration _configuration;

    public AuthService(ApplicationDbContext context, IJwtTokenGenerator jwtTokenGenerator, IConfiguration configuration)
    {
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (existingUser != null)
        {
            throw new Exception("User with this email already exists.");
        }

        if (request.Password != request.ConfirmPassword)
        {
            throw new Exception("Passwords do not match.");
        }

        var user = new User
        {
            Fullname = request.Fullname,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResponseDto
        {
            UserId = user.Id,
            Fullname = user.Fullname,
            Email = user.Email,
            Token = token,
            RoleId = user.RoleId
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        
        if (user == null)
        {
            throw new Exception("Invalid email or password.");
        }

        if (string.IsNullOrEmpty(user.PasswordHash))
        {
            throw new Exception("This account is linked with Google. Please use Google Login.");
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new Exception("Invalid email or password.");
        }

        var token = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResponseDto
        {
            UserId = user.Id,
            Fullname = user.Fullname,
            Email = user.Email,
            Token = token,
            RoleId = user.RoleId
        };
    }

    public async Task<AuthResponseDto> GoogleLoginAsync(GoogleLoginRequestDto request)
    {
        var clientId = _configuration["GoogleAuth:ClientId"];
        var settings = new GoogleJsonWebSignature.ValidationSettings()
        {
            Audience = new List<string>() { clientId }
        };

        try
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(request.Credential, settings);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);

            if (user == null)
            {
                // Create new user if not exists
                user = new User
                {
                    Email = payload.Email,
                    Fullname = payload.Name,
                    GoogleId = payload.Subject,
                    PasswordHash = null, // No password for Google users
                    RoleId = 3 // Default role for members
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }
            else if (string.IsNullOrEmpty(user.GoogleId))
            {
                // Link Google account to existing user
                user.GoogleId = payload.Subject;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
            }

            var token = _jwtTokenGenerator.GenerateToken(user);

            return new AuthResponseDto
            {
                UserId = user.Id,
                Fullname = user.Fullname,
                Email = user.Email,
                Token = token,
                RoleId = user.RoleId
            };
        }
        catch (InvalidJwtException)
        {
            throw new Exception("Invalid Google credential.");
        }
    }
}
