using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FitnessTrainingSystem.Application.DTOs.ProductPackages;
using FitnessTrainingSystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessTrainingSystem.WebApi.Controllers;

[ApiController]
[Route("api/product-packages")]
[Authorize(Roles = "Admin,ADMIN")]
public class ProductPackagesController : ControllerBase
{
    private readonly IProductPackageService _productPackageService;

    public ProductPackagesController(IProductPackageService productPackageService)
    {
        _productPackageService = productPackageService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        int? userId = null;
        if (User.Identity?.IsAuthenticated == true)
        {
            var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                   ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(sub, out var uid))
                userId = uid;
        }
        var packages = await _productPackageService.GetAllAsync(userId);
        return Ok(packages);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        int? userId = null;
        if (User.Identity?.IsAuthenticated == true)
        {
            var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                   ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(sub, out var uid))
                userId = uid;
        }
        var package = await _productPackageService.GetByIdAsync(id, userId);
        if (package == null) return NotFound(new { message = "Package not found." });

        return Ok(package);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductPackageDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var createdPackage = await _productPackageService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = createdPackage.Id }, createdPackage);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductPackageDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _productPackageService.UpdateAsync(id, dto);
        if (!result) return NotFound(new { message = "Package not found." });

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _productPackageService.DeleteAsync(id);
        if (!result) return NotFound(new { message = "Package not found." });

        return NoContent();
    }
}
