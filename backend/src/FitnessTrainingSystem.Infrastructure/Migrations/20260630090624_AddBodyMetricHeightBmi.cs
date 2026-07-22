using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitnessTrainingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBodyMetricHeightBmi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_active",
                table: "product_packages",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_popular",
                table: "product_packages",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "bmi",
                table: "body_metrics",
                type: "decimal(65,30)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "height",
                table: "body_metrics",
                type: "decimal(65,30)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_active",
                table: "product_packages");

            migrationBuilder.DropColumn(
                name: "is_popular",
                table: "product_packages");

            migrationBuilder.DropColumn(
                name: "bmi",
                table: "body_metrics");

            migrationBuilder.DropColumn(
                name: "height",
                table: "body_metrics");
        }
    }
}
