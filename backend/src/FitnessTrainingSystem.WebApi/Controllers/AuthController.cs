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
        if (string.IsNullOrWhiteSpace(request?.Email))
        {
            return BadRequest(new { message = "Email không được để trống." });
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var existingUser = await _context.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
        if (existingUser)
        {
            return BadRequest(new { message = "Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác." });
        }

        try
        {
            var otpCode = await _otpService.SendRegisterOTPAsync(normalizedEmail);
            if (!string.IsNullOrEmpty(otpCode))
            {
                var isDev = string.IsNullOrEmpty(_configuration["SMTP_USER"]) || string.IsNullOrEmpty(_configuration["SMTP_PASS"]);
                if (isDev) return Ok(new { message = "Mã OTP đã được tạo (Dev mode).", otpCode });
                return Ok(new { message = "Mã OTP đã được gửi thành công đến email của bạn." });
            }
            return BadRequest(new { message = "Không thể gửi mã OTP. Vui lòng thử lại sau." });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Lỗi gửi mã OTP: " + ex.Message });
        }
    }

    [HttpPost("verify-register-otp")]
    public async Task<IActionResult> VerifyRegisterOTP([FromBody] VerifyOTPDto request)
    {
        if (string.IsNullOrWhiteSpace(request?.Email) || string.IsNullOrWhiteSpace(request?.OTPCode))
        {
            return BadRequest(new { message = "Email và mã OTP không được để trống." });
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var result = await _otpService.VerifyRegisterOTPAsync(normalizedEmail, request.OTPCode.Trim());
        if (result) return Ok(new { message = "Xác thực OTP thành công." });
        return BadRequest(new { message = "Mã OTP không đúng hoặc đã hết hạn." });
    }

    [HttpPost("send-forgot-password-otp")]
    public async Task<IActionResult> SendForgotPasswordOTP([FromBody] SendOTPDto request)
    {
        if (string.IsNullOrWhiteSpace(request?.Email))
        {
            return BadRequest(new { message = "Email không được để trống." });
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
        if (user == null) return BadRequest(new { message = "Không tìm thấy tài khoản với email này." });

        try
        {
            var otpCode = await _otpService.SendForgotPasswordOTPAsync(normalizedEmail);
            if (!string.IsNullOrEmpty(otpCode))
            {
                var isDev = string.IsNullOrEmpty(_configuration["SMTP_USER"]) || string.IsNullOrEmpty(_configuration["SMTP_PASS"]);
                if (isDev) return Ok(new { message = "Mã OTP đã được tạo (Dev mode).", otpCode });
                return Ok(new { message = "Mã OTP đặt lại mật khẩu đã được gửi đến email." });
            }
            return BadRequest(new { message = "Không thể gửi mã OTP. Vui lòng thử lại sau." });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Lỗi gửi mã OTP: " + ex.Message });
        }
    }

    [HttpPost("verify-forgot-password-otp")]
    public async Task<IActionResult> VerifyForgotPasswordOTP([FromBody] VerifyOTPDto request)
    {
        if (string.IsNullOrWhiteSpace(request?.Email) || string.IsNullOrWhiteSpace(request?.OTPCode))
        {
            return BadRequest(new { message = "Email và mã OTP không được để trống." });
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var result = await _otpService.VerifyForgotPasswordOTPAsync(normalizedEmail, request.OTPCode.Trim());
        if (result) return Ok(new { message = "Xác thực OTP thành công. Bạn có thể đặt lại mật khẩu." });
        return BadRequest(new { message = "Mã OTP không đúng hoặc đã hết hạn." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
    {
        if (string.IsNullOrWhiteSpace(request?.Email) || string.IsNullOrWhiteSpace(request?.NewPassword))
        {
            return BadRequest(new { message = "Email và mật khẩu mới không được để trống." });
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        // Check if there's a recently USED OTP for this email and purpose within 15 minutes
        EmailOTP? latestOTP = await _context.EmailOTPs
           .OrderByDescending(e => e.CreatedAt)
           .FirstOrDefaultAsync(e => e.Email == normalizedEmail && e.Purpose == "ForgotPassword");

        if (latestOTP == null || !latestOTP.IsUsed || (DateTime.UtcNow - latestOTP.UpdatedAt).TotalMinutes > 15)
        {
            return BadRequest(new { message = "Mã OTP chưa được xác thực hoặc phiên xác thực đã hết hạn (quá 15 phút)." });
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
        if (user == null) return BadRequest(new { message = "Không tìm thấy tài khoản người dùng." });

        // Update password using BCrypt
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword.Trim());
        user.PasswordChangedAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;
        _context.Users.Update(user);

        // Invalidate the OTP so it cannot be reused
        _context.EmailOTPs.Remove(latestOTP);

        await _context.SaveChangesAsync();

        return Ok(new { message = "Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới." });
    }
}
