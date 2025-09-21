using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedUserLimitsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserLimits",
                table: "UserLimits");

            migrationBuilder.DropColumn(
                name: "MaxStorage",
                table: "UserLimits");

            migrationBuilder.RenameColumn(
                name: "UsedStorage",
                table: "UserLimits",
                newName: "Used");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "UserLimits",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "Month",
                table: "UserLimits",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Resource",
                table: "UserLimits",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Month",
                table: "UserLimits");

            migrationBuilder.DropColumn(
                name: "Resource",
                table: "UserLimits");

            migrationBuilder.RenameColumn(
                name: "Used",
                table: "UserLimits",
                newName: "UsedStorage");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "UserLimits",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<long>(
                name: "MaxStorage",
                table: "UserLimits",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserLimits",
                table: "UserLimits",
                column: "UserId");
        }
    }
}
