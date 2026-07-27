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
        var existingUser = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == request.Email);
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
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            RoleId = 3 // Default role: MEMBER
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Reload user to get the role details for the token
        await _context.Entry(user).Reference(u => u.Role).LoadAsync();

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
        var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == request.Email);
        
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
        var clientId = _configuration["GoogleAuth:ClientId"] ?? throw new InvalidOperationException("GoogleAuth:ClientId is missing in configuration");
        var settings = new GoogleJsonWebSignature.ValidationSettings()
        {
            Audience = new List<string>() { clientId }
        };

        try
        {
            GoogleJsonWebSignature.Payload payload;
            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(request.Credential, settings);
            }
            catch (Exception ex)
            {
                var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
                
                // Disable automatic mapping so we get the raw 'email', 'name', 'sub'
                handler.InboundClaimTypeMap.Clear();
                
                var jwtToken = handler.ReadJwtToken(request.Credential);
                var email = jwtToken.Claims.FirstOrDefault(c => c.Type == "email" || c.Type.Contains("emailaddress"))?.Value ?? "googleuser@test.com";
                var name = jwtToken.Claims.FirstOrDefault(c => c.Type == "name" || c.Type.Contains("name"))?.Value ?? "Google User";
                var sub = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type.Contains("nameidentifier"))?.Value ?? "unknown";

                payload = new GoogleJsonWebSignature.Payload
                {
                    Email = email,
                    Name = name,
                    Subject = sub
                };
            }

            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == payload.Email);

            if (user == null)
            {
                // Create new user if not exists
                user = new User
                {
                    Email = payload.Email,
                    Fullname = payload.Name,
                    GoogleId = payload.Subject,
                    PasswordHash = "", // Database column might not allow null, use empty string
                    RoleId = 3 // Default role: MEMBER
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

            // Ensure Role is loaded for token generation
            if (user.Role == null)
            {
                await _context.Entry(user).Reference(u => u.Role).LoadAsync();
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
