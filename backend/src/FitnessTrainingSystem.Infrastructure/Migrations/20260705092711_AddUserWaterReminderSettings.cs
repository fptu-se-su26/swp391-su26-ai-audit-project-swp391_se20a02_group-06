using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitnessTrainingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserWaterReminderSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "water_reminder_end_time",
                table: "users",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "water_reminder_start_time",
                table: "users",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci")
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "water_reminder_end_time",
                table: "users");

            migrationBuilder.DropColumn(
                name: "water_reminder_start_time",
                table: "users");
        }
    }
}
