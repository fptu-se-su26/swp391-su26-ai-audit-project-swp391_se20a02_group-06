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
    [AllowAnonymous] // Allow anyone to see the packages
    public async Task<IActionResult> GetAll()
    {
        var packages = await _productPackageService.GetAllAsync();
        return Ok(packages);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var package = await _productPackageService.GetByIdAsync(id);
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
