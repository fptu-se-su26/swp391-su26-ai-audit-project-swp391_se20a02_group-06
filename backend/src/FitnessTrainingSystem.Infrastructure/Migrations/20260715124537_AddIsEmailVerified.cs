using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitnessTrainingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIsEmailVerified : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_orders_users_user_id1",
                table: "orders");

            migrationBuilder.DropIndex(
                name: "ix_orders_user_id1",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "user_id1",
                table: "orders");

            migrationBuilder.AddColumn<bool>(
                name: "is_email_verified",
                table: "users",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_email_verified",
                table: "users");

            migrationBuilder.AddColumn<int>(
                name: "user_id1",
                table: "orders",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_orders_user_id1",
                table: "orders",
                column: "user_id1");

            migrationBuilder.AddForeignKey(
                name: "fk_orders_users_user_id1",
                table: "orders",
                column: "user_id1",
                principalTable: "users",
                principalColumn: "id");
        }
    }
}
