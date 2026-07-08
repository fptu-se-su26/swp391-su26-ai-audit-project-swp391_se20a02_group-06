using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitnessTrainingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddExerciseRequestFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_pt_upload_requests_users_admin_id",
                table: "pt_upload_requests");

            migrationBuilder.AlterColumn<string>(
                name: "video_url",
                table: "pt_upload_requests",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "title",
                table: "pt_upload_requests",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AddColumn<DateTime>(
                name: "deadline",
                table: "pt_upload_requests",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "difficulty",
                table: "pt_upload_requests",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "duration",
                table: "pt_upload_requests",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "instructions",
                table: "pt_upload_requests",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "muscle_group",
                table: "pt_upload_requests",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "priority",
                table: "pt_upload_requests",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "requested_by",
                table: "pt_upload_requests",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_pt_upload_requests_requested_by",
                table: "pt_upload_requests",
                column: "requested_by");

            migrationBuilder.AddForeignKey(
                name: "fk_pt_upload_requests_users_admin_id",
                table: "pt_upload_requests",
                column: "admin_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_pt_upload_requests_users_requested_by",
                table: "pt_upload_requests",
                column: "requested_by",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_pt_upload_requests_users_admin_id",
                table: "pt_upload_requests");

            migrationBuilder.DropForeignKey(
                name: "fk_pt_upload_requests_users_requested_by",
                table: "pt_upload_requests");

            migrationBuilder.DropIndex(
                name: "ix_pt_upload_requests_requested_by",
                table: "pt_upload_requests");

            migrationBuilder.DropColumn(
                name: "deadline",
                table: "pt_upload_requests");

            migrationBuilder.DropColumn(
                name: "difficulty",
                table: "pt_upload_requests");

            migrationBuilder.DropColumn(
                name: "duration",
                table: "pt_upload_requests");

            migrationBuilder.DropColumn(
                name: "instructions",
                table: "pt_upload_requests");

            migrationBuilder.DropColumn(
                name: "muscle_group",
                table: "pt_upload_requests");

            migrationBuilder.DropColumn(
                name: "priority",
                table: "pt_upload_requests");

            migrationBuilder.DropColumn(
                name: "requested_by",
                table: "pt_upload_requests");

            migrationBuilder.UpdateData(
                table: "pt_upload_requests",
                keyColumn: "video_url",
                keyValue: null,
                column: "video_url",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "video_url",
                table: "pt_upload_requests",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.UpdateData(
                table: "pt_upload_requests",
                keyColumn: "title",
                keyValue: null,
                column: "title",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "title",
                table: "pt_upload_requests",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AddForeignKey(
                name: "fk_pt_upload_requests_users_admin_id",
                table: "pt_upload_requests",
                column: "admin_id",
                principalTable: "users",
                principalColumn: "id");
        }
    }
}
