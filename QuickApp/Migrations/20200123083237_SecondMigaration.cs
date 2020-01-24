using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MMS.Migrations
{
    public partial class SecondMigaration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Site",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SiteReference = table.Column<string>(maxLength: 50, nullable: false),
                    Name1 = table.Column<string>(maxLength: 100, nullable: false),
                    Name2 = table.Column<string>(maxLength: 100, nullable: false),
                    FileName = table.Column<string>(maxLength: 50, nullable: true),
                    FileLocation = table.Column<string>(maxLength: 250, nullable: true),
                    FileExtention = table.Column<string>(maxLength: 10, nullable: false),
                    CreatedBy = table.Column<string>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    UpdatedBy = table.Column<string>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Site", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Site_CreatedUser",
                        column: x => x.CreatedBy,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Site_UpdatedUser",
                        column: x => x.UpdatedBy,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Site_CreatedBy",
                table: "Site",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Site_UpdatedBy",
                table: "Site",
                column: "UpdatedBy");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Site");
        }
    }
}
