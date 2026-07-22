using FitnessTrainingSystem.Application.DTOs.Auth;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Domain.Entities;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IOTPService _otpService;
    private readonly ApplicationDbContext _context; // Required to update password directly if AuthService doesn't have ResetPassword

    private readonly IConfiguration _configuration;

    public AuthController(IAuthService authService, IOTPService otpService, ApplicationDbContext context, IConfiguration configuration)
    {
        _authService = authService;
        _otpService = otpService;
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        try
        {
            var response = await _authService.RegisterAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message, stack = ex.StackTrace });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        try
        {
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Login Error: " + ex.ToString());
            return BadRequest(new { message = ex.Message, stack = ex.StackTrace });
        }
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequestDto request)
    {
        try
        {
            var response = await _authService.GoogleLoginAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            Console.WriteLine("GoogleLogin Error: " + ex.Message);
            Console.WriteLine(ex.StackTrace);
            return BadRequest(new { message = ex.Message, stack = ex.StackTrace });
        }
    }

    [HttpPost("send-register-otp")]
    public async Task<IActionResult> SendRegisterOTP([FromBody] SendOTPDto request)
    {
        var otpCode = await _otpService.SendRegisterOTPAsync(request.Email);
        if (!string.IsNullOrEmpty(otpCode))
        {
            var isDev = string.IsNullOrEmpty(_configuration["SMTP_USER"]) || string.IsNullOrEmpty(_configuration["SMTP_PASS"]);
            if (isDev) return Ok(new { message = "OTP sent successfully. (Dev mode)", otpCode });
            return Ok(new { message = "OTP sent successfully." });
        }
        return BadRequest(new { message = "Failed to send OTP or cooldown active." });
    }

    [HttpPost("verify-register-otp")]
    public async Task<IActionResult> VerifyRegisterOTP([FromBody] VerifyOTPDto request)
    {
        var result = await _otpService.VerifyRegisterOTPAsync(request.Email, request.OTPCode);
        if (result) return Ok(new { message = "OTP verified successfully." });
        return BadRequest(new { message = "Invalid or expired OTP." });
    }

    [HttpPost("send-forgot-password-otp")]
    public async Task<IActionResult> SendForgotPasswordOTP([FromBody] SendOTPDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null) return BadRequest(new { message = "Email not found." });

        var otpCode = await _otpService.SendForgotPasswordOTPAsync(request.Email);
        if (!string.IsNullOrEmpty(otpCode))
        {
            // In development, return OTP code since SMTP might not be configured
            var isDev = string.IsNullOrEmpty(_configuration["SMTP_USER"]) || string.IsNullOrEmpty(_configuration["SMTP_PASS"]);
            if (isDev) return Ok(new { message = "OTP sent successfully. (Dev mode)", otpCode });
            return Ok(new { message = "OTP sent successfully." });
        }
        return BadRequest(new { message = "Failed to send OTP or cooldown active." });
    }

    [HttpPost("verify-forgot-password-otp")]
    public async Task<IActionResult> VerifyForgotPasswordOTP([FromBody] VerifyOTPDto request)
    {
        // Actually, we don't need to verify here if we verify in reset-password, but to support the 5 APIs requirement, we can do a dry run or just verify.
        // Wait, if we verify here, IsUsed becomes true. Then ResetPassword can't verify again.
        // To fix this without complex tokens, let's just use VerifyForgotPasswordOTPAsync as intended.
        var result = await _otpService.VerifyForgotPasswordOTPAsync(request.Email, request.OTPCode);
        if (result) return Ok(new { message = "OTP verified successfully. You can now reset your password." });
        return BadRequest(new { message = "Invalid or expired OTP." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
    {
        // Check if there's a recently USED OTP for this email and purpose within the 15 minutes
        EmailOTP? latestOTP = await _context.EmailOTPs
           .OrderByDescending(e => e.CreatedAt)
           .FirstOrDefaultAsync(e => e.Email == request.Email && e.Purpose == "ForgotPassword");

        if (latestOTP == null || !latestOTP.IsUsed || (DateTime.UtcNow - latestOTP.UpdatedAt).TotalMinutes > 15)
        {
            return BadRequest(new { message = "OTP not verified or verification expired." });
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null) return BadRequest(new { message = "User not found." });

        // Update password using BCrypt (assuming it's what AuthService uses)
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Password reset successfully." });
    }
}
