using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitnessTrainingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixCreatorId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_exercises_users_creator_id",
                table: "exercises");

            migrationBuilder.DropIndex(
                name: "ix_exercises_creator_id",
                table: "exercises");

            migrationBuilder.DropColumn(
                name: "creator_id",
                table: "exercises");

            migrationBuilder.DropColumn(
                name: "muscle_group",
                table: "exercises");

            migrationBuilder.CreateIndex(
                name: "ix_exercises_created_by",
                table: "exercises",
                column: "created_by");

            migrationBuilder.AddForeignKey(
                name: "fk_exercises_users_created_by",
                table: "exercises",
                column: "created_by",
                principalTable: "users",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_exercises_users_created_by",
                table: "exercises");

            migrationBuilder.DropIndex(
                name: "ix_exercises_created_by",
                table: "exercises");

            migrationBuilder.AddColumn<int>(
                name: "creator_id",
                table: "exercises",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "muscle_group",
                table: "exercises",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "ix_exercises_creator_id",
                table: "exercises",
                column: "creator_id");

            migrationBuilder.AddForeignKey(
                name: "fk_exercises_users_creator_id",
                table: "exercises",
                column: "creator_id",
                principalTable: "users",
                principalColumn: "id");
        }
    }
}
