using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitnessTrainingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPayOSOrderCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_exercises_users_creator_id",
                table: "exercises");

            migrationBuilder.DropForeignKey(
                name: "fk_orders_product_packages_package_id",
                table: "orders");

            migrationBuilder.DropForeignKey(
                name: "fk_orders_users_user_id",
                table: "orders");

            migrationBuilder.DropForeignKey(
                name: "fk_pt_upload_requests_users_admin_id",
                table: "pt_upload_requests");

            migrationBuilder.DropForeignKey(
                name: "fk_pt_upload_requests_users_requested_by",
                table: "pt_upload_requests");

            migrationBuilder.DropIndex(
                name: "ix_pt_upload_requests_requested_by",
                table: "pt_upload_requests");

            migrationBuilder.DropIndex(
                name: "ix_membership_subscriptions_order_id",
                table: "membership_subscriptions");

            migrationBuilder.DropIndex(
                name: "ix_exercises_creator_id",
                table: "exercises");

            migrationBuilder.DropColumn(
                name: "expired_at",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "creator_id",
                table: "exercises");

            migrationBuilder.DropColumn(
                name: "muscle_group",
                table: "exercises");

            migrationBuilder.AlterColumn<string>(
                name: "status",
                table: "schedules",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "difficulty",
                table: "pt_upload_requests",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "requested_by_user_id",
                table: "pt_upload_requests",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "type",
                table: "product_packages",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<int>(
                name: "user_id",
                table: "orders",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "payment_status",
                table: "orders",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<int>(
                name: "package_id",
                table: "orders",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<long>(
                name: "order_code",
                table: "orders",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "user_id1",
                table: "orders",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "difficulty",
                table: "exercises",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "type",
                table: "ai_recommendations",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "ix_pt_upload_requests_requested_by_user_id",
                table: "pt_upload_requests",
                column: "requested_by_user_id");

            migrationBuilder.CreateIndex(
                name: "ix_orders_user_id1",
                table: "orders",
                column: "user_id1");

            migrationBuilder.CreateIndex(
                name: "ix_membership_subscriptions_order_id",
                table: "membership_subscriptions",
                column: "order_id",
                unique: true);

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

            migrationBuilder.AddForeignKey(
                name: "fk_orders_product_packages_package_id",
                table: "orders",
                column: "package_id",
                principalTable: "product_packages",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_orders_users_user_id",
                table: "orders",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_orders_users_user_id1",
                table: "orders",
                column: "user_id1",
                principalTable: "users",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_pt_upload_requests_users_admin_id",
                table: "pt_upload_requests",
                column: "admin_id",
                principalTable: "users",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_pt_upload_requests_users_requested_by_user_id",
                table: "pt_upload_requests",
                column: "requested_by_user_id",
                principalTable: "users",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_exercises_users_created_by",
                table: "exercises");

            migrationBuilder.DropForeignKey(
                name: "fk_orders_product_packages_package_id",
                table: "orders");

            migrationBuilder.DropForeignKey(
                name: "fk_orders_users_user_id",
                table: "orders");

            migrationBuilder.DropForeignKey(
                name: "fk_orders_users_user_id1",
                table: "orders");

            migrationBuilder.DropForeignKey(
                name: "fk_pt_upload_requests_users_admin_id",
                table: "pt_upload_requests");

            migrationBuilder.DropForeignKey(
                name: "fk_pt_upload_requests_users_requested_by_user_id",
                table: "pt_upload_requests");

            migrationBuilder.DropIndex(
                name: "ix_pt_upload_requests_requested_by_user_id",
                table: "pt_upload_requests");

            migrationBuilder.DropIndex(
                name: "ix_orders_user_id1",
                table: "orders");

            migrationBuilder.DropIndex(
                name: "ix_membership_subscriptions_order_id",
                table: "membership_subscriptions");

            migrationBuilder.DropIndex(
                name: "ix_exercises_created_by",
                table: "exercises");

            migrationBuilder.DropColumn(
                name: "requested_by_user_id",
                table: "pt_upload_requests");

            migrationBuilder.DropColumn(
                name: "order_code",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "user_id1",
                table: "orders");

            migrationBuilder.AlterColumn<int>(
                name: "status",
                table: "schedules",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<int>(
                name: "difficulty",
                table: "pt_upload_requests",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<int>(
                name: "type",
                table: "product_packages",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<int>(
                name: "user_id",
                table: "orders",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "payment_status",
                table: "orders",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<int>(
                name: "package_id",
                table: "orders",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<DateTime>(
                name: "expired_at",
                table: "orders",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "difficulty",
                table: "exercises",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

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

            migrationBuilder.AlterColumn<int>(
                name: "type",
                table: "ai_recommendations",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateIndex(
                name: "ix_pt_upload_requests_requested_by",
                table: "pt_upload_requests",
                column: "requested_by");

            migrationBuilder.CreateIndex(
                name: "ix_membership_subscriptions_order_id",
                table: "membership_subscriptions",
                column: "order_id");

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

            migrationBuilder.AddForeignKey(
                name: "fk_orders_product_packages_package_id",
                table: "orders",
                column: "package_id",
                principalTable: "product_packages",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_orders_users_user_id",
                table: "orders",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id");

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
    }
}
