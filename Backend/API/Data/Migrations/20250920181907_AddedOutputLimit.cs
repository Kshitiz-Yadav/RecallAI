using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedOutputLimit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Used",
                table: "UserLimits",
                newName: "OutputUsed");

            migrationBuilder.AddColumn<long>(
                name: "InputUsed",
                table: "UserLimits",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InputUsed",
                table: "UserLimits");

            migrationBuilder.RenameColumn(
                name: "OutputUsed",
                table: "UserLimits",
                newName: "Used");
        }
    }
}
