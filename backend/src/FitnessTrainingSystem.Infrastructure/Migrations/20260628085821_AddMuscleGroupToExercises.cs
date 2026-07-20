using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitnessTrainingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMuscleGroupToExercises : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AiRecommendation_Users_UserId",
                table: "AiRecommendation");

            migrationBuilder.DropForeignKey(
                name: "FK_BodyMetric_Users_UserId",
                table: "BodyMetric");

            migrationBuilder.DropForeignKey(
                name: "FK_Exercise_Users_CreatorId",
                table: "Exercise");

            migrationBuilder.DropForeignKey(
                name: "FK_MealSchedule_AiRecommendation_AiRecommendationId",
                table: "MealSchedule");

            migrationBuilder.DropForeignKey(
                name: "FK_MealSchedule_Users_UserId",
                table: "MealSchedule");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_ProductPackages_PackageId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Users_UserId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_PtProfile_Users_UserId",
                table: "PtProfile");

            migrationBuilder.DropForeignKey(
                name: "FK_Schedule_Users_MemberId",
                table: "Schedule");

            migrationBuilder.DropForeignKey(
                name: "FK_Schedule_Users_PtId",
                table: "Schedule");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Role_RoleId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Menu");

            migrationBuilder.DropTable(
                name: "WorkoutLog");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Orders",
                table: "Orders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Schedule",
                table: "Schedule");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Role",
                table: "Role");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PtProfile",
                table: "PtProfile");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductPackages",
                table: "ProductPackages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MealSchedule",
                table: "MealSchedule");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Food",
                table: "Food");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Exercise",
                table: "Exercise");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BodyMetric",
                table: "BodyMetric");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AiRecommendation",
                table: "AiRecommendation");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "users");

            migrationBuilder.RenameTable(
                name: "Orders",
                newName: "orders");

            migrationBuilder.RenameTable(
                name: "Schedule",
                newName: "schedules");

            migrationBuilder.RenameTable(
                name: "Role",
                newName: "roles");

            migrationBuilder.RenameTable(
                name: "PtProfile",
                newName: "pt_profiles");

            migrationBuilder.RenameTable(
                name: "ProductPackages",
                newName: "product_packages");

            migrationBuilder.RenameTable(
                name: "MealSchedule",
                newName: "meal_schedules");

            migrationBuilder.RenameTable(
                name: "Food",
                newName: "foods");

            migrationBuilder.RenameTable(
                name: "Exercise",
                newName: "exercises");

            migrationBuilder.RenameTable(
                name: "BodyMetric",
                newName: "body_metrics");

            migrationBuilder.RenameTable(
                name: "AiRecommendation",
                newName: "ai_recommendations");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "users",
                newName: "phone");

            migrationBuilder.RenameColumn(
                name: "Fullname",
                table: "users",
                newName: "fullname");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "users",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "users",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "RoleId",
                table: "users",
                newName: "role_id");

            migrationBuilder.RenameColumn(
                name: "PasswordHash",
                table: "users",
                newName: "password_hash");

            migrationBuilder.RenameColumn(
                name: "GoogleId",
                table: "users",
                newName: "google_id");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "users",
                newName: "created_at");

            migrationBuilder.RenameIndex(
                name: "IX_Users_RoleId",
                table: "users",
                newName: "ix_users_role_id");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "orders",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "orders",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "PurchasedAt",
                table: "orders",
                newName: "purchased_at");

            migrationBuilder.RenameColumn(
                name: "PricePaid",
                table: "orders",
                newName: "price_paid");

            migrationBuilder.RenameColumn(
                name: "PaymentStatus",
                table: "orders",
                newName: "payment_status");

            migrationBuilder.RenameColumn(
                name: "PackageId",
                table: "orders",
                newName: "package_id");

            migrationBuilder.RenameColumn(
                name: "ExpiredAt",
                table: "orders",
                newName: "expired_at");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_UserId",
                table: "orders",
                newName: "ix_orders_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_PackageId",
                table: "orders",
                newName: "ix_orders_package_id");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "schedules",
                newName: "status");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "schedules",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "schedules",
                newName: "start_time");

            migrationBuilder.RenameColumn(
                name: "PtId",
                table: "schedules",
                newName: "pt_id");

            migrationBuilder.RenameColumn(
                name: "MemberId",
                table: "schedules",
                newName: "member_id");

            migrationBuilder.RenameColumn(
                name: "MeetingUrl",
                table: "schedules",
                newName: "meeting_url");

            migrationBuilder.RenameColumn(
                name: "EndTime",
                table: "schedules",
                newName: "end_time");

            migrationBuilder.RenameIndex(
                name: "IX_Schedule_PtId",
                table: "schedules",
                newName: "ix_schedules_pt_id");

            migrationBuilder.RenameIndex(
                name: "IX_Schedule_MemberId",
                table: "schedules",
                newName: "ix_schedules_member_id");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "roles",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "RoleName",
                table: "roles",
                newName: "role_name");

            migrationBuilder.RenameColumn(
                name: "Rating",
                table: "pt_profiles",
                newName: "rating");

            migrationBuilder.RenameColumn(
                name: "Bio",
                table: "pt_profiles",
                newName: "bio");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "pt_profiles",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "pt_profiles",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "ExperienceYears",
                table: "pt_profiles",
                newName: "experience_years");

            migrationBuilder.RenameIndex(
                name: "IX_PtProfile_UserId",
                table: "pt_profiles",
                newName: "ix_pt_profiles_user_id");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "product_packages",
                newName: "type");

            migrationBuilder.RenameColumn(
                name: "Price",
                table: "product_packages",
                newName: "price");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "product_packages",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "product_packages",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "product_packages",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "DurationDays",
                table: "product_packages",
                newName: "duration_days");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "meal_schedules",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "meal_schedules",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "TotalCaloriesTarget",
                table: "meal_schedules",
                newName: "total_calories_target");

            migrationBuilder.RenameColumn(
                name: "ScheduleName",
                table: "meal_schedules",
                newName: "schedule_name");

            migrationBuilder.RenameColumn(
                name: "EatTime",
                table: "meal_schedules",
                newName: "eat_time");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "meal_schedules",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "AiRecommendationId",
                table: "meal_schedules",
                newName: "ai_recommendation_id");

            migrationBuilder.RenameIndex(
                name: "IX_MealSchedule_UserId",
                table: "meal_schedules",
                newName: "ix_meal_schedules_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_MealSchedule_AiRecommendationId",
                table: "meal_schedules",
                newName: "ix_meal_schedules_ai_recommendation_id");

            migrationBuilder.RenameColumn(
                name: "Protein",
                table: "foods",
                newName: "protein");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "foods",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Fat",
                table: "foods",
                newName: "fat");

            migrationBuilder.RenameColumn(
                name: "Carbs",
                table: "foods",
                newName: "carbs");

            migrationBuilder.RenameColumn(
                name: "Calories",
                table: "foods",
                newName: "calories");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "foods",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "exercises",
                newName: "title");

            migrationBuilder.RenameColumn(
                name: "Duration",
                table: "exercises",
                newName: "duration");

            migrationBuilder.RenameColumn(
                name: "Difficulty",
                table: "exercises",
                newName: "difficulty");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "exercises",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "exercises",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "VideoUrl",
                table: "exercises",
                newName: "video_url");

            migrationBuilder.RenameColumn(
                name: "MuscleGroup",
                table: "exercises",
                newName: "muscle_group");

            migrationBuilder.RenameColumn(
                name: "CreatorId",
                table: "exercises",
                newName: "creator_id");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "exercises",
                newName: "created_by");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "exercises",
                newName: "created_at");

            migrationBuilder.RenameIndex(
                name: "IX_Exercise_CreatorId",
                table: "exercises",
                newName: "ix_exercises_creator_id");

            migrationBuilder.RenameColumn(
                name: "Weight",
                table: "body_metrics",
                newName: "weight");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "body_metrics",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "body_metrics",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "RecordedAt",
                table: "body_metrics",
                newName: "recorded_at");

            migrationBuilder.RenameColumn(
                name: "MuscleMass",
                table: "body_metrics",
                newName: "muscle_mass");

            migrationBuilder.RenameColumn(
                name: "BodyFatPercentage",
                table: "body_metrics",
                newName: "body_fat_percentage");

            migrationBuilder.RenameIndex(
                name: "IX_BodyMetric_UserId",
                table: "body_metrics",
                newName: "ix_body_metrics_user_id");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "ai_recommendations",
                newName: "type");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "ai_recommendations",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UserRequest",
                table: "ai_recommendations",
                newName: "user_request");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "ai_recommendations",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "ai_recommendations",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "AiResponse",
                table: "ai_recommendations",
                newName: "ai_response");

            migrationBuilder.RenameIndex(
                name: "IX_AiRecommendation_UserId",
                table: "ai_recommendations",
                newName: "ix_ai_recommendations_user_id");

            migrationBuilder.AlterDatabase(
                collation: "utf8mb4_unicode_ci")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterTable(
                name: "users")
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterTable(
                name: "orders")
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterTable(
                name: "schedules")
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterTable(
                name: "roles")
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterTable(
                name: "pt_profiles")
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterTable(
                name: "product_packages")
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterTable(
                name: "meal_schedules")
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterTable(
                name: "foods")
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterTable(
                name: "exercises")
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterTable(
                name: "body_metrics")
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterTable(
                name: "ai_recommendations")
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "phone",
                table: "users",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "fullname",
                table: "users",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "users",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "password_hash",
                table: "users",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "google_id",
                table: "users",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "avatar_url",
                table: "users",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "date_of_birth",
                table: "users",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "gender",
                table: "users",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "users",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "users",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "meeting_url",
                table: "schedules",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "role_name",
                table: "roles",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "bio",
                table: "pt_profiles",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "product_packages",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "description",
                table: "product_packages",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "schedule_name",
                table: "meal_schedules",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "foods",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "image_url",
                table: "foods",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "serving_size",
                table: "foods",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "unit",
                table: "foods",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "title",
                table: "exercises",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "description",
                table: "exercises",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "video_url",
                table: "exercises",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "muscle_group",
                table: "exercises",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "muscle_group_id",
                table: "exercises",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "user_request",
                table: "ai_recommendations",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "ai_response",
                table: "ai_recommendations",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddPrimaryKey(
                name: "pk_users",
                table: "users",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_orders",
                table: "orders",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_schedules",
                table: "schedules",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_roles",
                table: "roles",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_pt_profiles",
                table: "pt_profiles",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_product_packages",
                table: "product_packages",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_meal_schedules",
                table: "meal_schedules",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_foods",
                table: "foods",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_exercises",
                table: "exercises",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_body_metrics",
                table: "body_metrics",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_ai_recommendations",
                table: "ai_recommendations",
                column: "id");

            migrationBuilder.CreateTable(
                name: "meal_schedule_items",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    meal_schedule_id = table.Column<int>(type: "int", nullable: false),
                    food_id = table.Column<int>(type: "int", nullable: false),
                    amount = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    is_eaten = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_meal_schedule_items", x => x.id);
                    table.ForeignKey(
                        name: "fk_meal_schedule_items_foods_food_id",
                        column: x => x.food_id,
                        principalTable: "foods",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_meal_schedule_items_meal_schedules_meal_schedule_id",
                        column: x => x.meal_schedule_id,
                        principalTable: "meal_schedules",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "membership_subscriptions",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    package_id = table.Column<int>(type: "int", nullable: false),
                    order_id = table.Column<int>(type: "int", nullable: true),
                    start_date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    end_date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    status = table.Column<string>(type: "longtext", nullable: true, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_membership_subscriptions", x => x.id);
                    table.ForeignKey(
                        name: "fk_membership_subscriptions_orders_order_id",
                        column: x => x.order_id,
                        principalTable: "orders",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_membership_subscriptions_product_packages_package_id",
                        column: x => x.package_id,
                        principalTable: "product_packages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_membership_subscriptions_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "muscle_groups",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    description = table.Column<string>(type: "longtext", nullable: true, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_muscle_groups", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "notifications",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    title = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    content = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    type = table.Column<string>(type: "longtext", nullable: true, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    is_read = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_notifications", x => x.id);
                    table.ForeignKey(
                        name: "fk_notifications_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "payments",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    order_id = table.Column<int>(type: "int", nullable: false),
                    payment_method = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    transaction_code = table.Column<string>(type: "longtext", nullable: true, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    amount = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    status = table.Column<string>(type: "longtext", nullable: true, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    paid_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_payments", x => x.id);
                    table.ForeignKey(
                        name: "fk_payments_orders_order_id",
                        column: x => x.order_id,
                        principalTable: "orders",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "pt_upload_requests",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    pt_id = table.Column<int>(type: "int", nullable: false),
                    exercise_id = table.Column<int>(type: "int", nullable: true),
                    title = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    description = table.Column<string>(type: "longtext", nullable: true, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    video_url = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    status = table.Column<string>(type: "longtext", nullable: true, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    admin_id = table.Column<int>(type: "int", nullable: true),
                    review_note = table.Column<string>(type: "longtext", nullable: true, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    submitted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    reviewed_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_pt_upload_requests", x => x.id);
                    table.ForeignKey(
                        name: "fk_pt_upload_requests_exercises_exercise_id",
                        column: x => x.exercise_id,
                        principalTable: "exercises",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_pt_upload_requests_users_admin_id",
                        column: x => x.admin_id,
                        principalTable: "users",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_pt_upload_requests_users_pt_id",
                        column: x => x.pt_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "workout_plans",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    ai_recommendation_id = table.Column<int>(type: "int", nullable: true),
                    title = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    goal = table.Column<string>(type: "longtext", nullable: true, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    target_calories = table.Column<int>(type: "int", nullable: true),
                    target_duration_minutes = table.Column<int>(type: "int", nullable: true),
                    created_by_ai = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_workout_plans", x => x.id);
                    table.ForeignKey(
                        name: "fk_workout_plans_ai_recommendations_ai_recommendation_id",
                        column: x => x.ai_recommendation_id,
                        principalTable: "ai_recommendations",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_workout_plans_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "workout_plan_exercises",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    workout_plan_id = table.Column<int>(type: "int", nullable: false),
                    exercise_id = table.Column<int>(type: "int", nullable: false),
                    sets = table.Column<int>(type: "int", nullable: true),
                    reps = table.Column<int>(type: "int", nullable: true),
                    duration_seconds = table.Column<int>(type: "int", nullable: true),
                    rest_seconds = table.Column<int>(type: "int", nullable: true),
                    exercise_order = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_workout_plan_exercises", x => x.id);
                    table.ForeignKey(
                        name: "fk_workout_plan_exercises_exercises_exercise_id",
                        column: x => x.exercise_id,
                        principalTable: "exercises",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_workout_plan_exercises_workout_plans_workout_plan_id",
                        column: x => x.workout_plan_id,
                        principalTable: "workout_plans",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "workout_sessions",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    workout_plan_id = table.Column<int>(type: "int", nullable: true),
                    total_duration_minutes = table.Column<int>(type: "int", nullable: true),
                    total_calories_burned = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    status = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    started_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    completed_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_workout_sessions", x => x.id);
                    table.ForeignKey(
                        name: "fk_workout_sessions_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_workout_sessions_workout_plans_workout_plan_id",
                        column: x => x.workout_plan_id,
                        principalTable: "workout_plans",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "workout_session_details",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    workout_session_id = table.Column<int>(type: "int", nullable: false),
                    exercise_id = table.Column<int>(type: "int", nullable: false),
                    sets_done = table.Column<int>(type: "int", nullable: true),
                    reps_done = table.Column<int>(type: "int", nullable: true),
                    duration_seconds = table.Column<int>(type: "int", nullable: true),
                    calories_burned = table.Column<decimal>(type: "decimal(65,30)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_workout_session_details", x => x.id);
                    table.ForeignKey(
                        name: "fk_workout_session_details_exercises_exercise_id",
                        column: x => x.exercise_id,
                        principalTable: "exercises",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_workout_session_details_workout_sessions_workout_session_id",
                        column: x => x.workout_session_id,
                        principalTable: "workout_sessions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateIndex(
                name: "ix_exercises_muscle_group_id",
                table: "exercises",
                column: "muscle_group_id");

            migrationBuilder.CreateIndex(
                name: "ix_meal_schedule_items_food_id",
                table: "meal_schedule_items",
                column: "food_id");

            migrationBuilder.CreateIndex(
                name: "ix_meal_schedule_items_meal_schedule_id",
                table: "meal_schedule_items",
                column: "meal_schedule_id");

            migrationBuilder.CreateIndex(
                name: "ix_membership_subscriptions_order_id",
                table: "membership_subscriptions",
                column: "order_id");

            migrationBuilder.CreateIndex(
                name: "ix_membership_subscriptions_package_id",
                table: "membership_subscriptions",
                column: "package_id");

            migrationBuilder.CreateIndex(
                name: "ix_membership_subscriptions_user_id",
                table: "membership_subscriptions",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_notifications_user_id",
                table: "notifications",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_payments_order_id",
                table: "payments",
                column: "order_id");

            migrationBuilder.CreateIndex(
                name: "ix_pt_upload_requests_admin_id",
                table: "pt_upload_requests",
                column: "admin_id");

            migrationBuilder.CreateIndex(
                name: "ix_pt_upload_requests_exercise_id",
                table: "pt_upload_requests",
                column: "exercise_id");

            migrationBuilder.CreateIndex(
                name: "ix_pt_upload_requests_pt_id",
                table: "pt_upload_requests",
                column: "pt_id");

            migrationBuilder.CreateIndex(
                name: "ix_workout_plan_exercises_exercise_id",
                table: "workout_plan_exercises",
                column: "exercise_id");

            migrationBuilder.CreateIndex(
                name: "ix_workout_plan_exercises_workout_plan_id",
                table: "workout_plan_exercises",
                column: "workout_plan_id");

            migrationBuilder.CreateIndex(
                name: "ix_workout_plans_ai_recommendation_id",
                table: "workout_plans",
                column: "ai_recommendation_id");

            migrationBuilder.CreateIndex(
                name: "ix_workout_plans_user_id",
                table: "workout_plans",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_workout_session_details_exercise_id",
                table: "workout_session_details",
                column: "exercise_id");

            migrationBuilder.CreateIndex(
                name: "ix_workout_session_details_workout_session_id",
                table: "workout_session_details",
                column: "workout_session_id");

            migrationBuilder.CreateIndex(
                name: "ix_workout_sessions_user_id",
                table: "workout_sessions",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_workout_sessions_workout_plan_id",
                table: "workout_sessions",
                column: "workout_plan_id");

            migrationBuilder.AddForeignKey(
                name: "fk_ai_recommendations_users_user_id",
                table: "ai_recommendations",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_body_metrics_users_user_id",
                table: "body_metrics",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_exercises_muscle_groups_muscle_group_id",
                table: "exercises",
                column: "muscle_group_id",
                principalTable: "muscle_groups",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_exercises_users_creator_id",
                table: "exercises",
                column: "creator_id",
                principalTable: "users",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_meal_schedules_ai_recommendations_ai_recommendation_id",
                table: "meal_schedules",
                column: "ai_recommendation_id",
                principalTable: "ai_recommendations",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_meal_schedules_users_user_id",
                table: "meal_schedules",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

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
                name: "fk_pt_profiles_users_user_id",
                table: "pt_profiles",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_schedules_users_member_id",
                table: "schedules",
                column: "member_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_schedules_users_pt_id",
                table: "schedules",
                column: "pt_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_users_roles_role_id",
                table: "users",
                column: "role_id",
                principalTable: "roles",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_ai_recommendations_users_user_id",
                table: "ai_recommendations");

            migrationBuilder.DropForeignKey(
                name: "fk_body_metrics_users_user_id",
                table: "body_metrics");

            migrationBuilder.DropForeignKey(
                name: "fk_exercises_muscle_groups_muscle_group_id",
                table: "exercises");

            migrationBuilder.DropForeignKey(
                name: "fk_exercises_users_creator_id",
                table: "exercises");

            migrationBuilder.DropForeignKey(
                name: "fk_meal_schedules_ai_recommendations_ai_recommendation_id",
                table: "meal_schedules");

            migrationBuilder.DropForeignKey(
                name: "fk_meal_schedules_users_user_id",
                table: "meal_schedules");

            migrationBuilder.DropForeignKey(
                name: "fk_orders_product_packages_package_id",
                table: "orders");

            migrationBuilder.DropForeignKey(
                name: "fk_orders_users_user_id",
                table: "orders");

            migrationBuilder.DropForeignKey(
                name: "fk_pt_profiles_users_user_id",
                table: "pt_profiles");

            migrationBuilder.DropForeignKey(
                name: "fk_schedules_users_member_id",
                table: "schedules");

            migrationBuilder.DropForeignKey(
                name: "fk_schedules_users_pt_id",
                table: "schedules");

            migrationBuilder.DropForeignKey(
                name: "fk_users_roles_role_id",
                table: "users");

            migrationBuilder.DropTable(
                name: "meal_schedule_items");

            migrationBuilder.DropTable(
                name: "membership_subscriptions");

            migrationBuilder.DropTable(
                name: "muscle_groups");

            migrationBuilder.DropTable(
                name: "notifications");

            migrationBuilder.DropTable(
                name: "payments");

            migrationBuilder.DropTable(
                name: "pt_upload_requests");

            migrationBuilder.DropTable(
                name: "workout_plan_exercises");

            migrationBuilder.DropTable(
                name: "workout_session_details");

            migrationBuilder.DropTable(
                name: "workout_sessions");

            migrationBuilder.DropTable(
                name: "workout_plans");

            migrationBuilder.DropPrimaryKey(
                name: "pk_users",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "pk_orders",
                table: "orders");

            migrationBuilder.DropPrimaryKey(
                name: "pk_schedules",
                table: "schedules");

            migrationBuilder.DropPrimaryKey(
                name: "pk_roles",
                table: "roles");

            migrationBuilder.DropPrimaryKey(
                name: "pk_pt_profiles",
                table: "pt_profiles");

            migrationBuilder.DropPrimaryKey(
                name: "pk_product_packages",
                table: "product_packages");

            migrationBuilder.DropPrimaryKey(
                name: "pk_meal_schedules",
                table: "meal_schedules");

            migrationBuilder.DropPrimaryKey(
                name: "pk_foods",
                table: "foods");

            migrationBuilder.DropPrimaryKey(
                name: "pk_exercises",
                table: "exercises");

            migrationBuilder.DropIndex(
                name: "ix_exercises_muscle_group_id",
                table: "exercises");

            migrationBuilder.DropPrimaryKey(
                name: "pk_body_metrics",
                table: "body_metrics");

            migrationBuilder.DropPrimaryKey(
                name: "pk_ai_recommendations",
                table: "ai_recommendations");

            migrationBuilder.DropColumn(
                name: "avatar_url",
                table: "users");

            migrationBuilder.DropColumn(
                name: "date_of_birth",
                table: "users");

            migrationBuilder.DropColumn(
                name: "gender",
                table: "users");

            migrationBuilder.DropColumn(
                name: "status",
                table: "users");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "users");

            migrationBuilder.DropColumn(
                name: "image_url",
                table: "foods");

            migrationBuilder.DropColumn(
                name: "serving_size",
                table: "foods");

            migrationBuilder.DropColumn(
                name: "unit",
                table: "foods");

            migrationBuilder.DropColumn(
                name: "muscle_group_id",
                table: "exercises");

            migrationBuilder.RenameTable(
                name: "users",
                newName: "Users");

            migrationBuilder.RenameTable(
                name: "orders",
                newName: "Orders");

            migrationBuilder.RenameTable(
                name: "schedules",
                newName: "Schedule");

            migrationBuilder.RenameTable(
                name: "roles",
                newName: "Role");

            migrationBuilder.RenameTable(
                name: "pt_profiles",
                newName: "PtProfile");

            migrationBuilder.RenameTable(
                name: "product_packages",
                newName: "ProductPackages");

            migrationBuilder.RenameTable(
                name: "meal_schedules",
                newName: "MealSchedule");

            migrationBuilder.RenameTable(
                name: "foods",
                newName: "Food");

            migrationBuilder.RenameTable(
                name: "exercises",
                newName: "Exercise");

            migrationBuilder.RenameTable(
                name: "body_metrics",
                newName: "BodyMetric");

            migrationBuilder.RenameTable(
                name: "ai_recommendations",
                newName: "AiRecommendation");

            migrationBuilder.RenameColumn(
                name: "phone",
                table: "Users",
                newName: "Phone");

            migrationBuilder.RenameColumn(
                name: "fullname",
                table: "Users",
                newName: "Fullname");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "Users",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "role_id",
                table: "Users",
                newName: "RoleId");

            migrationBuilder.RenameColumn(
                name: "password_hash",
                table: "Users",
                newName: "PasswordHash");

            migrationBuilder.RenameColumn(
                name: "google_id",
                table: "Users",
                newName: "GoogleId");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Users",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "ix_users_role_id",
                table: "Users",
                newName: "IX_Users_RoleId");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Orders",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "Orders",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "purchased_at",
                table: "Orders",
                newName: "PurchasedAt");

            migrationBuilder.RenameColumn(
                name: "price_paid",
                table: "Orders",
                newName: "PricePaid");

            migrationBuilder.RenameColumn(
                name: "payment_status",
                table: "Orders",
                newName: "PaymentStatus");

            migrationBuilder.RenameColumn(
                name: "package_id",
                table: "Orders",
                newName: "PackageId");

            migrationBuilder.RenameColumn(
                name: "expired_at",
                table: "Orders",
                newName: "ExpiredAt");

            migrationBuilder.RenameIndex(
                name: "ix_orders_user_id",
                table: "Orders",
                newName: "IX_Orders_UserId");

            migrationBuilder.RenameIndex(
                name: "ix_orders_package_id",
                table: "Orders",
                newName: "IX_Orders_PackageId");

            migrationBuilder.RenameColumn(
                name: "status",
                table: "Schedule",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Schedule",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "start_time",
                table: "Schedule",
                newName: "StartTime");

            migrationBuilder.RenameColumn(
                name: "pt_id",
                table: "Schedule",
                newName: "PtId");

            migrationBuilder.RenameColumn(
                name: "member_id",
                table: "Schedule",
                newName: "MemberId");

            migrationBuilder.RenameColumn(
                name: "meeting_url",
                table: "Schedule",
                newName: "MeetingUrl");

            migrationBuilder.RenameColumn(
                name: "end_time",
                table: "Schedule",
                newName: "EndTime");

            migrationBuilder.RenameIndex(
                name: "ix_schedules_pt_id",
                table: "Schedule",
                newName: "IX_Schedule_PtId");

            migrationBuilder.RenameIndex(
                name: "ix_schedules_member_id",
                table: "Schedule",
                newName: "IX_Schedule_MemberId");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Role",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "role_name",
                table: "Role",
                newName: "RoleName");

            migrationBuilder.RenameColumn(
                name: "rating",
                table: "PtProfile",
                newName: "Rating");

            migrationBuilder.RenameColumn(
                name: "bio",
                table: "PtProfile",
                newName: "Bio");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "PtProfile",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "PtProfile",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "experience_years",
                table: "PtProfile",
                newName: "ExperienceYears");

            migrationBuilder.RenameIndex(
                name: "ix_pt_profiles_user_id",
                table: "PtProfile",
                newName: "IX_PtProfile_UserId");

            migrationBuilder.RenameColumn(
                name: "type",
                table: "ProductPackages",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "price",
                table: "ProductPackages",
                newName: "Price");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "ProductPackages",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "ProductPackages",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "ProductPackages",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "duration_days",
                table: "ProductPackages",
                newName: "DurationDays");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "MealSchedule",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "MealSchedule",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "total_calories_target",
                table: "MealSchedule",
                newName: "TotalCaloriesTarget");

            migrationBuilder.RenameColumn(
                name: "schedule_name",
                table: "MealSchedule",
                newName: "ScheduleName");

            migrationBuilder.RenameColumn(
                name: "eat_time",
                table: "MealSchedule",
                newName: "EatTime");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "MealSchedule",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "ai_recommendation_id",
                table: "MealSchedule",
                newName: "AiRecommendationId");

            migrationBuilder.RenameIndex(
                name: "ix_meal_schedules_user_id",
                table: "MealSchedule",
                newName: "IX_MealSchedule_UserId");

            migrationBuilder.RenameIndex(
                name: "ix_meal_schedules_ai_recommendation_id",
                table: "MealSchedule",
                newName: "IX_MealSchedule_AiRecommendationId");

            migrationBuilder.RenameColumn(
                name: "protein",
                table: "Food",
                newName: "Protein");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Food",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "fat",
                table: "Food",
                newName: "Fat");

            migrationBuilder.RenameColumn(
                name: "carbs",
                table: "Food",
                newName: "Carbs");

            migrationBuilder.RenameColumn(
                name: "calories",
                table: "Food",
                newName: "Calories");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Food",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "title",
                table: "Exercise",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "duration",
                table: "Exercise",
                newName: "Duration");

            migrationBuilder.RenameColumn(
                name: "difficulty",
                table: "Exercise",
                newName: "Difficulty");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Exercise",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Exercise",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "video_url",
                table: "Exercise",
                newName: "VideoUrl");

            migrationBuilder.RenameColumn(
                name: "muscle_group",
                table: "Exercise",
                newName: "MuscleGroup");

            migrationBuilder.RenameColumn(
                name: "creator_id",
                table: "Exercise",
                newName: "CreatorId");

            migrationBuilder.RenameColumn(
                name: "created_by",
                table: "Exercise",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Exercise",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "ix_exercises_creator_id",
                table: "Exercise",
                newName: "IX_Exercise_CreatorId");

            migrationBuilder.RenameColumn(
                name: "weight",
                table: "BodyMetric",
                newName: "Weight");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "BodyMetric",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "BodyMetric",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "recorded_at",
                table: "BodyMetric",
                newName: "RecordedAt");

            migrationBuilder.RenameColumn(
                name: "muscle_mass",
                table: "BodyMetric",
                newName: "MuscleMass");

            migrationBuilder.RenameColumn(
                name: "body_fat_percentage",
                table: "BodyMetric",
                newName: "BodyFatPercentage");

            migrationBuilder.RenameIndex(
                name: "ix_body_metrics_user_id",
                table: "BodyMetric",
                newName: "IX_BodyMetric_UserId");

            migrationBuilder.RenameColumn(
                name: "type",
                table: "AiRecommendation",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "AiRecommendation",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "user_request",
                table: "AiRecommendation",
                newName: "UserRequest");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "AiRecommendation",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "AiRecommendation",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "ai_response",
                table: "AiRecommendation",
                newName: "AiResponse");

            migrationBuilder.RenameIndex(
                name: "ix_ai_recommendations_user_id",
                table: "AiRecommendation",
                newName: "IX_AiRecommendation_UserId");

            migrationBuilder.AlterDatabase(
                oldCollation: "utf8mb4_unicode_ci")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterTable(
                name: "Users")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterTable(
                name: "Orders")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterTable(
                name: "Schedule")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterTable(
                name: "Role")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterTable(
                name: "PtProfile")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterTable(
                name: "ProductPackages")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterTable(
                name: "MealSchedule")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterTable(
                name: "Food")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterTable(
                name: "Exercise")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterTable(
                name: "BodyMetric")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterTable(
                name: "AiRecommendation")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "Users",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "Fullname",
                table: "Users",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "GoogleId",
                table: "Users",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "MeetingUrl",
                table: "Schedule",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "RoleName",
                table: "Role",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "Bio",
                table: "PtProfile",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "ProductPackages",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "ProductPackages",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "ScheduleName",
                table: "MealSchedule",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Food",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Exercise",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Exercise",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "VideoUrl",
                table: "Exercise",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "MuscleGroup",
                table: "Exercise",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UserRequest",
                table: "AiRecommendation",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "AiResponse",
                table: "AiRecommendation",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Orders",
                table: "Orders",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Schedule",
                table: "Schedule",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Role",
                table: "Role",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PtProfile",
                table: "PtProfile",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductPackages",
                table: "ProductPackages",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MealSchedule",
                table: "MealSchedule",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Food",
                table: "Food",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Exercise",
                table: "Exercise",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BodyMetric",
                table: "BodyMetric",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AiRecommendation",
                table: "AiRecommendation",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Menu",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    FoodId = table.Column<int>(type: "int", nullable: false),
                    MealScheduleId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    IsEaten = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Menu", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Menu_Food_FoodId",
                        column: x => x.FoodId,
                        principalTable: "Food",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Menu_MealSchedule_MealScheduleId",
                        column: x => x.MealScheduleId,
                        principalTable: "MealSchedule",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Menu_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "WorkoutLog",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ExerciseId = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    LoggedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Reps = table.Column<int>(type: "int", nullable: true),
                    Sets = table.Column<int>(type: "int", nullable: true),
                    WeightKg = table.Column<decimal>(type: "decimal(65,30)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkoutLog", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkoutLog_Exercise_ExerciseId",
                        column: x => x.ExerciseId,
                        principalTable: "Exercise",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_WorkoutLog_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Menu_FoodId",
                table: "Menu",
                column: "FoodId");

            migrationBuilder.CreateIndex(
                name: "IX_Menu_MealScheduleId",
                table: "Menu",
                column: "MealScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_Menu_UserId",
                table: "Menu",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkoutLog_ExerciseId",
                table: "WorkoutLog",
                column: "ExerciseId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkoutLog_UserId",
                table: "WorkoutLog",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_AiRecommendation_Users_UserId",
                table: "AiRecommendation",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BodyMetric_Users_UserId",
                table: "BodyMetric",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Exercise_Users_CreatorId",
                table: "Exercise",
                column: "CreatorId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MealSchedule_AiRecommendation_AiRecommendationId",
                table: "MealSchedule",
                column: "AiRecommendationId",
                principalTable: "AiRecommendation",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MealSchedule_Users_UserId",
                table: "MealSchedule",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_ProductPackages_PackageId",
                table: "Orders",
                column: "PackageId",
                principalTable: "ProductPackages",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Users_UserId",
                table: "Orders",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PtProfile_Users_UserId",
                table: "PtProfile",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Schedule_Users_MemberId",
                table: "Schedule",
                column: "MemberId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Schedule_Users_PtId",
                table: "Schedule",
                column: "PtId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Role_RoleId",
                table: "Users",
                column: "RoleId",
                principalTable: "Role",
                principalColumn: "Id");
        }
    }
}
