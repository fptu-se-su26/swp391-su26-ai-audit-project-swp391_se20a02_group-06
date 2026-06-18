using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitnessTrainingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProductPackages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_ProductPackage_PackageId",
                table: "Order");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductPackage",
                table: "ProductPackage");

            migrationBuilder.RenameTable(
                name: "ProductPackage",
                newName: "ProductPackages");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductPackages",
                table: "ProductPackages",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Order_ProductPackages_PackageId",
                table: "Order",
                column: "PackageId",
                principalTable: "ProductPackages",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_ProductPackages_PackageId",
                table: "Order");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductPackages",
                table: "ProductPackages");

            migrationBuilder.RenameTable(
                name: "ProductPackages",
                newName: "ProductPackage");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductPackage",
                table: "ProductPackage",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Order_ProductPackage_PackageId",
                table: "Order",
                column: "PackageId",
                principalTable: "ProductPackage",
                principalColumn: "Id");
        }
    }
}
