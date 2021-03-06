﻿// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using DAL.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using DAL.Models.Interfaces;

namespace DAL
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public string CurrentUserId { get; set; }
        public DbSet<SiteInfo> SiteInfos { get; set; }
        public DbSet<FileRepository> FileRepositories { get; set; }
        public DbSet<ClassType> ClassTypes { get; set; }
        public DbSet<TypeCdDmt> TypeCdDmts { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectRepository> ProjectRepositories { get; set; }
        public DbSet<LookUp> LookUps { get; set; }
        public DbSet<LookUpProjectXref> LookUpProjectXrefs { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<AssetGroup> AssetGroups { get; set; }
        public DbSet<AssetLocation> AssetLocations { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<AssetFileRepository> AssetFileRepositories { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<PurchageOrder> PurchageOrders { get; set; }
        public DbSet<PurchageItemXref> PurchageItemXrefs { get; set; }
        public DbSet<WorkOrder> WorkOrders { get; set; }
        public DbSet<WorkOrderItemXref> WorkOrderItemXrefs { get; set; }
        public DbSet<UserProjectXref> UserProjectXrefs { get; set; }

        public DbSet<WorkOrderStatusHistory> WorkOrderStatusHistories { get; set; }

        public DbSet<PreventiveMaintenance> PreventiveMaintenances { get; set; }

        public DbSet<Inventory> Inventories { get; set; }

        public DbSet<PMAssetXref> PMAssetXrefs { get; set; }

        public DbSet<PMStatusHistory> PMStatusHistories { get; set; }

        public DbSet<JobPlan> JobPlans { get; set; }

        public DbSet<JobTask> JobTasks { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        { }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            const string priceDecimalType = "decimal(18,2)";

            builder.Entity<ApplicationUser>().HasMany(u => u.Claims).WithOne().HasForeignKey(c => c.UserId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<ApplicationUser>().HasMany(u => u.Roles).WithOne().HasForeignKey(r => r.UserId).IsRequired().OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ApplicationRole>().HasMany(r => r.Claims).WithOne().HasForeignKey(c => c.RoleId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<ApplicationRole>().HasMany(r => r.Users).WithOne().HasForeignKey(r => r.RoleId).IsRequired().OnDelete(DeleteBehavior.Cascade);



            builder.Entity<SiteInfo>().ToTable("SiteInfo");
            builder.Entity<SiteInfo>().Property(p => p.IsActive).HasDefaultValue(true);
            builder.Entity<FileRepository>().ToTable("FileRepository");
            builder.Entity<ClassType>().ToTable("ClassType");
            builder.Entity<ClassType>().Property(p => p.IsActive).HasDefaultValue(true);
            builder.Entity<TypeCdDmt>().ToTable("TypeCdDmt");
            builder.Entity<TypeCdDmt>().Property(p => p.IsActive).HasDefaultValue(true);
            builder.Entity<Project>().ToTable("Project");
            builder.Entity<Project>().Property(p => p.IsActive).HasDefaultValue(true);
            builder.Entity<ProjectRepository>().ToTable("ProjectRepository");
            builder.Entity<LookUp>().ToTable("LookUP");
            builder.Entity<LookUpProjectXref>().ToTable("LookUpProjectXref");
            builder.Entity<Location>().ToTable("Location");
            builder.Entity<AssetGroup>().ToTable("AssetGroup");
            builder.Entity<AssetGroup>().Property(p => p.IsActive).HasDefaultValue(true);
            builder.Entity<AssetLocation>().ToTable("AssetLocation");
            builder.Entity<AssetLocation>().Property(p => p.IsActive).HasDefaultValue(true);
            builder.Entity<Supplier>().ToTable("Supplier");
            builder.Entity<Supplier>().Property(p => p.IsActive).HasDefaultValue(true);
            builder.Entity<AssetFileRepository>().ToTable("AssetFileRepository");


            builder.Entity<Item>().ToTable("Item");
            builder.Entity<Item>().Property(p => p.IsActive).HasDefaultValue(true);
            builder.Entity<PurchageOrder>().ToTable("PurchageOrder");
            builder.Entity<PurchageOrder>().Property(p => p.IsActive).HasDefaultValue(true);
            builder.Entity<PurchageItemXref>().ToTable("PurchageItemXref");

            builder.Entity<WorkOrder>().ToTable("WorkOrder");
            builder.Entity<WorkOrder>().Property(p => p.IsActive).HasDefaultValue(true);
            builder.Entity<WorkOrderItemXref>().ToTable("WorkOrderItemXref");
            builder.Entity<UserProjectXref>().ToTable("UserProjectXref");
            builder.Entity<Inventory>().ToTable("Inventory");
            builder.Entity<WorkOrderStatusHistory>().ToTable("WorkOrderStatusHistory");
            builder.Entity<PreventiveMaintenance>().ToTable("PreventiveMaintenance");
            builder.Entity<PreventiveMaintenance>().Property(p => p.IsActive).HasDefaultValue(true);
            builder.Entity<PMAssetXref>().ToTable("PMAssetXref");
            builder.Entity<PMStatusHistory>().ToTable("PMStatusHistory");
            builder.Entity<JobPlan>().ToTable("JobPlan");
            builder.Entity<JobPlan>().Property(p => p.IsActive).HasDefaultValue(true);

            builder.Entity<JobTask>().ToTable("JobTask");



            builder.Entity<SiteInfo>().HasOne(d => d.CreatedUser)
           .WithMany(p => p.App_SiteInfo_CreatedUser)
           .HasForeignKey(d => d.CreatedBy)
           .OnDelete(DeleteBehavior.ClientSetNull)
           .HasConstraintName("FK_SiteInfo_CreatedUser");

            builder.Entity<SiteInfo>().HasOne(d => d.UpdatedUser)
                  .WithMany(p => p.App_SiteInfo_UpdatedUser)
                  .HasForeignKey(d => d.UpdatedBy)
                  .OnDelete(DeleteBehavior.ClientSetNull)
                  .HasConstraintName("FK_SiteInfo_UpdatedUser");

            builder.Entity<FileRepository>().HasOne(d => d.CreatedUser)
         .WithMany(p => p.App_Repository_CreatedUser)
         .HasForeignKey(d => d.CreatedBy)
         .OnDelete(DeleteBehavior.ClientSetNull)
         .HasConstraintName("FK_FileRepository_CreatedUser");

            builder.Entity<FileRepository>().HasOne(d => d.UpdatedUser)
                  .WithMany(p => p.App_Repository_UpdatedUser)
                  .HasForeignKey(d => d.UpdatedBy)
                  .OnDelete(DeleteBehavior.ClientSetNull)
                  .HasConstraintName("FK_FileRepository_UpdatedUser");

            builder.Entity<FileRepository>().HasOne(d => d.File_TypeCdDmt)
                  .WithMany(p => p.FileRepository_DocumentTypeId)
                  .HasForeignKey(d => d.DocumentType)
                  .OnDelete(DeleteBehavior.ClientSetNull)
                  .HasConstraintName("FK_FileRepository_DocumentTypeId");

            builder.Entity<TypeCdDmt>().HasOne(d => d.ClassType)
         .WithMany(p => p.TypeCdDmt_ClassTypes)
         .HasForeignKey(d => d.ClassTypeId)
         .OnDelete(DeleteBehavior.ClientSetNull)
         .HasConstraintName("FK_TypeCdDmt_ClassTypes");

            builder.Entity<TypeCdDmt>().HasOne(d => d.CreatedUser)
             .WithMany(p => p.App_TypeCdDmt_CreatedUser)
             .HasForeignKey(d => d.CreatedBy)
             .OnDelete(DeleteBehavior.ClientSetNull)
             .HasConstraintName("FK_App_TypeCdDmt_CreatedUser");

            builder.Entity<TypeCdDmt>().HasOne(d => d.UpdatedUser)
           .WithMany(p => p.App_TypeCdDmt_UpdatedUser)
           .HasForeignKey(d => d.UpdatedBy)
           .OnDelete(DeleteBehavior.ClientSetNull)
           .HasConstraintName("FK_App_TypeCdDmt_UpdatedUser");

            builder.Entity<ClassType>().HasOne(d => d.CreatedUser)
         .WithMany(p => p.App_ClassType_CreatedUser)
         .HasForeignKey(d => d.CreatedBy)
         .OnDelete(DeleteBehavior.ClientSetNull)
         .HasConstraintName("FK_ClassType_CreatedUser");

            builder.Entity<ClassType>().HasOne(d => d.UpdatedUser)
             .WithMany(p => p.App_ClassType_UpdatedUser)
             .HasForeignKey(d => d.UpdatedBy)
             .OnDelete(DeleteBehavior.ClientSetNull)
             .HasConstraintName("FK_App_ClassType_UpdatedUser");

            builder.Entity<Project>().HasOne(d => d.CreatedUser)
               .WithMany(p => p.App_Project_CreatedUser)
               .HasForeignKey(d => d.CreatedBy)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_Project_CreatedUser");

            builder.Entity<Project>().HasOne(d => d.UpdatedUser)
                 .WithMany(p => p.App_Project_UpdatedUser)
                 .HasForeignKey(d => d.UpdatedBy)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_App_Project_UpdatedUser");

            builder.Entity<Project>().HasOne(d => d.SiteInfo_Id)
               .WithMany(p => p.App_Project_SiteId)
               .HasForeignKey(d => d.SiteId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_App_Project_SiteId");

            builder.Entity<ProjectRepository>().HasOne(d => d.CreatedUser)
            .WithMany(p => p.App_ProjectRepository_CreatedUser)
            .HasForeignKey(d => d.CreatedBy)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_ProjectRepository_CreatedUser");

            builder.Entity<ProjectRepository>().HasOne(d => d.UpdatedUser)
                 .WithMany(p => p.App_ProjectRepository_UpdatedUser)
                 .HasForeignKey(d => d.UpdatedBy)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_App_ProjectRepository_UpdatedUser");

            builder.Entity<ProjectRepository>().HasOne(d => d.Project_TypeCdDmt)
                .WithMany(p => p.ProjectRepository_DocumentTypeId)
                .HasForeignKey(d => d.DocumentType)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProjectRepository_DocumentTypeId");

            builder.Entity<ProjectRepository>().HasOne(d => d.Project_Id)
               .WithMany(p => p.App_ProjectRepository_ProjectId)
               .HasForeignKey(d => d.ProjectId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_App_ProjectRepository_ProjectId");

            builder.Entity<LookUp>().HasOne(d => d.CreatedUser)
           .WithMany(p => p.App_LookUp_CreatedUser)
           .HasForeignKey(d => d.CreatedBy)
           .OnDelete(DeleteBehavior.ClientSetNull)
           .HasConstraintName("FK_LookUp_CreatedUser");

            builder.Entity<LookUp>().HasOne(d => d.UpdatedUser)
                 .WithMany(p => p.App_LookUp_UpdatedUser)
                 .HasForeignKey(d => d.UpdatedBy)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_App_LookUp_UpdatedUser");

            builder.Entity<LookUp>().HasOne(d => d.TypecdId)
                .WithMany(p => p.LookUP_TypeId)
                .HasForeignKey(d => d.LookUpTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_LookUp_TypeId");

            //builder.Entity<Project>().HasOne(d => d.LookUp_Id)
            // .WithMany(p => p.App_Project_StoreId)
            // .HasForeignKey(d => d.StoreId)
            // .OnDelete(DeleteBehavior.ClientSetNull)
            // .HasConstraintName("FK_App_Project_StoreId");

            builder.Entity<LookUpProjectXref>().HasOne(d => d.LookUp_Id)
                 .WithMany(p => p.StorexrefId)
                 .HasForeignKey(d => d.StoreId)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_StorexrefId");

            builder.Entity<LookUpProjectXref>().HasOne(d => d.Project_Id)
                 .WithMany(p => p.ProjectxrefId)
                 .HasForeignKey(d => d.ProjectId)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_ProjectxrefId");

            builder.Entity<Location>().HasOne(d => d.CreatedUser)
               .WithMany(p => p.App_Location_CreatedUser)
               .HasForeignKey(d => d.CreatedBy)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_Location_CreatedUser");

            builder.Entity<Location>().HasOne(d => d.UpdatedUser)
                 .WithMany(p => p.App_Location_UpdatedUser)
                 .HasForeignKey(d => d.UpdatedBy)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_App_Location_UpdatedUser");


            builder.Entity<Location>().HasOne(d => d.Project)
               .WithMany(p => p.Location_ProjectId)
               .HasForeignKey(d => d.ProjectId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_Location_ProjectId");

            //builder.Entity<Location>().HasOne(d => d.SiteInfo_Id)
            //     .WithMany(p => p.App_Location_SiteId)
            //     .HasForeignKey(d => d.SiteId)
            //     .OnDelete(DeleteBehavior.ClientSetNull)
            //     .HasConstraintName("FK_App_Location_SiteId");

            builder.Entity<AssetGroup>().HasOne(d => d.CreatedUser)
             .WithMany(p => p.App_AssetGroup_CreatedUser)
             .HasForeignKey(d => d.CreatedBy)
             .OnDelete(DeleteBehavior.ClientSetNull)
             .HasConstraintName("FK_AssetGroup_CreatedUser");

            builder.Entity<AssetGroup>().HasOne(d => d.UpdatedUser)
                 .WithMany(p => p.App_AssetGroup_UpdatedUser)
                 .HasForeignKey(d => d.UpdatedBy)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_App_AssetGroup_UpdatedUser");

            builder.Entity<AssetLocation>().HasOne(d => d.CreatedUser)
               .WithMany(p => p.App_AssetLocation_CreatedUser)
               .HasForeignKey(d => d.CreatedBy)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_AssetLocation_CreatedUser");

            builder.Entity<AssetLocation>().HasOne(d => d.UpdatedUser)
                 .WithMany(p => p.App_AssetLocation_UpdatedUser)
                 .HasForeignKey(d => d.UpdatedBy)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_App_AssetLocation_UpdatedUser");

            //builder.Entity<AssetLocation>().HasOne(d => d.SiteInfo_Id)
            //  .WithMany(p => p.App_AssetLocation_SiteId)
            //  .HasForeignKey(d => d.SiteId)
            //  .OnDelete(DeleteBehavior.ClientSetNull)
            //  .HasConstraintName("FK_App_AssetLocation_SiteId");

            builder.Entity<AssetLocation>().HasOne(d => d.Location_Id)
                  .WithMany(p => p.App_AssetLocation_LocationId)
                  .HasForeignKey(d => d.LocationId)
                  .OnDelete(DeleteBehavior.ClientSetNull)
                  .HasConstraintName("FK_App_AssetLocation_LocationId");

            //builder.Entity<AssetLocation>().HasOne(d => d.Project)
            //     .WithMany(p => p.App_AssetLocation_ProjectId)
            //     .HasForeignKey(d => d.ProjectId)
            //     .OnDelete(DeleteBehavior.ClientSetNull)
            //     .HasConstraintName("FK_App_AssetLocation_ProjectId");

            builder.Entity<AssetLocation>().HasOne(d => d.AstGroup_Id)
                .WithMany(p => p.App_AssetLocation_AstGroup_Id)
                .HasForeignKey(d => d.AstGroupId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_AssetLocation_AstGroupId");

            builder.Entity<AssetLocation>().HasOne(d => d.AstTrade_Id)
                .WithMany(p => p.App_AssetLocation_AstTrade_Id)
                .HasForeignKey(d => d.AstTradeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_AssetLocation_AstTradeId");

            builder.Entity<Supplier>().HasOne(d => d.CreatedUser)
                 .WithMany(p => p.App_Supplier_CreatedUser)
                 .HasForeignKey(d => d.CreatedBy)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_Supplier_CreatedUser");

            builder.Entity<Supplier>().HasOne(d => d.UpdatedUser)
                 .WithMany(p => p.App_Supplier_UpdatedUser)
                 .HasForeignKey(d => d.UpdatedBy)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_App_Supplier_UpdatedUser");
          
            builder.Entity<AssetFileRepository>().HasOne(d => d.CreatedUser)
                 .WithMany(p => p.App_AssetFileRepository_CreatedUser)
                 .HasForeignKey(d => d.CreatedBy)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_AssetFileRepository_CreatedUser");

            builder.Entity<AssetFileRepository>().HasOne(d => d.UpdatedUser)
                 .WithMany(p => p.App_AssetFileRepository_UpdatedUser)
                 .HasForeignKey(d => d.UpdatedBy)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_App_AssetFileRepository_UpdatedUser");

            builder.Entity<AssetFileRepository>().HasOne(d => d.Asset_Id)
                .WithMany(p => p.App_Repository_Id)
                .HasForeignKey(d => d.AssetId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_Repository_Id");

            builder.Entity<AssetFileRepository>().HasOne(d => d.Asset_TypeCdDmt)
             .WithMany(p => p.Asset_DocumnetId)
             .HasForeignKey(d => d.DocumentType)
             .OnDelete(DeleteBehavior.ClientSetNull)
             .HasConstraintName("FK_Asset_DocumnetId");


            builder.Entity<Item>().HasOne(d => d.CreatedUser)
                 .WithMany(p => p.App_Item_CreatedUser)
                 .HasForeignKey(d => d.CreatedBy)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_Item_CreatedUser");

            builder.Entity<Item>().HasOne(d => d.UpdatedUser)
                 .WithMany(p => p.App_Item_UpdatedUser)
                 .HasForeignKey(d => d.UpdatedBy)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_App_Item_UpdatedUser");

            builder.Entity<Item>().HasOne(d => d.UOM_Id)
                 .WithMany(p => p.App_Item_UOM_Id)
                 .HasForeignKey(d => d.UOMId)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_App_Item_UOMId");

            builder.Entity<Item>().HasOne(d => d.ItemCategory_Id)
                .WithMany(p => p.App_Item_ItemCategory_Id)
                .HasForeignKey(d => d.ItemCategory)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_Item_ItemCategoryId");

            builder.Entity<Item>().HasOne(d => d.ItemType_Id)
                .WithMany(p => p.Item_ItemTypeId)
                .HasForeignKey(d =>d.ItemType)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Item_ItemType");

            builder.Entity<PurchageOrder>().HasOne(d => d.Supplier_Id)
               .WithMany(p => p.Purchage_Supplier_Id)
               .HasForeignKey(d => d.SupplierId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_Purchage_Supplier_Id");

            builder.Entity<PurchageOrder>().HasOne(d => d.CreatedUser)
               .WithMany(p => p.App_PurchageOrder_CreatedUser)
               .HasForeignKey(d => d.CreatedBy)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_App_PurchageOrder_CreatedUser");

            builder.Entity<PurchageOrder>().HasOne(d => d.UpdatedUser)
               .WithMany(p => p.App_PurchageOrder_UpdatedUser)
               .HasForeignKey(d => d.UpdatedBy)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_App_PurchageOrder_UpdatedUser");

            builder.Entity<PurchageOrder>().HasOne(d => d.StatusType_Id)
               .WithMany(p => p.Order_StatusTypeId)
               .HasForeignKey(d => d.StatusTypeId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_App_Order_StatusTypeId");

            builder.Entity<PurchageOrder>().HasOne(d => d.Project_Id)
               .WithMany(p => p.App_PurchageOrder_ProjectId)
               .HasForeignKey(d => d.ProjectId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_App_PurchageOrder_ProjectId ");

            builder.Entity<PurchageOrder>().HasOne(d => d.Store_Id)
             .WithMany(p => p.App_PurchageOrder_Store_Id)
             .HasForeignKey(d => d.StoreId)
             .OnDelete(DeleteBehavior.ClientSetNull)
             .HasConstraintName("FK_App_PurchageOrder_Store_Id");

            builder.Entity<PurchageItemXref>().HasOne(d => d.Purchage_Id)
              .WithMany(p => p.Purchage_OrderXref_Id)
              .HasForeignKey(d => d.PurchageId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK_Purchage_OrderXref_Id");

            builder.Entity<PurchageItemXref>().HasOne(d => d.Item_Id)
            .WithMany(p => p.Purchage_ItemXref_Id)
            .HasForeignKey(d => d.ItemId)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_Purchage_ItemXref_Id");


            builder.Entity<WorkOrder>().HasOne(d => d.CreatedUser)
                .WithMany(p => p.App_WorkOrder_CreatedUser)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_WorkOrder_CreatedUser");

            builder.Entity<WorkOrder>().HasOne(d => d.UpdatedUser)
               .WithMany(p => p.App_WorkOrder_UpdatedUser)
               .HasForeignKey(d => d.UpdatedBy)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_App_WorkOrder_UpdatedUser");

            builder.Entity<WorkOrder>().HasOne(d => d.Asset_Id)
                .WithMany(p => p.App_WorkOrderAsset_Id)
                .HasForeignKey(d => d.AssetId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_WorkOrderAsset_Id");

            builder.Entity<WorkOrder>().HasOne(d => d.Store_Id)
              .WithMany(p => p.App_WorkOrder_Store_Id)
              .HasForeignKey(d => d.StoreId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK_App_WorkOrder_Store_Id");

            builder.Entity<WorkOrder>().HasOne(d => d.WorkStatus_Id)
                .WithMany(p => p.App_WorkOrder_WorkSatus_Id)
                .HasForeignKey(d => d.WorkStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_WorkOrder_WorkSatus_Id");

            builder.Entity<WorkOrder>().HasOne(d => d.WorkFault_Id)
               .WithMany(p => p.App_WorkOrder_WorkFault_Id)
               .HasForeignKey(d => d.WorkFaultId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_App_WorkOrder_WorkFault_Id");

            builder.Entity<WorkOrder>().HasOne(d => d.WorkType_Id)
                .WithMany(p => p.App_WorkOrder_WorkType_Id)
                .HasForeignKey(d => d.WorkTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_WorkOrder_WorkType_Id");

            builder.Entity<WorkOrder>().HasOne(d => d.WorkTechnician_Id)
                .WithMany(p => p.App_WorkOrder_WorkTechinician_Id)
                .HasForeignKey(d => d.WorkTechnicianId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_WorkOrder_WorkTechinician_Id");

            builder.Entity<WorkOrder>().HasOne(d => d.StatusType_Id)
               .WithMany(p => p.WorkOrder_StatusTypeId)
               .HasForeignKey(d => d.StatusTypeId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_WorkOrder_StatusTypeId");

            builder.Entity<WorkOrder>().HasOne(d => d.OrderType_Id)
              .WithMany(p => p.App_WorkOrder_OrderTypeId)
              .HasForeignKey(d => d.OrderTypeId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK_App_WorkOrder_OrderTypeId");

            builder.Entity<WorkOrderItemXref>().HasOne(d => d.Item_Id)
                .WithMany(p => p.App_WorkOrderItemIdXref_Id)
                .HasForeignKey(d => d.ItemId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_WorkOrderItemIdXref_Id");

            builder.Entity<WorkOrderItemXref>().HasOne(d => d.WorkOrder_Id)
                .WithMany(p => p.App_WorkOrderItemxref_Id)
                .HasForeignKey(d => d.WorkOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_WorkOrderItemxref_Id");

            builder.Entity<UserProjectXref>().HasOne(d => d.User_Id)
                .WithMany(p => p.App_UserProjectXref_UserId)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_UserProjectXref_UserId");

            builder.Entity<UserProjectXref>().HasOne(d => d.Project_Id)
                .WithMany(p => p.App_UserProjectXref_ProjectId)
                .HasForeignKey(d => d.ProjectId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_UserProjectXref_ProjectId");


            builder.Entity<Inventory>().HasOne(d => d.PurchaseOrder_Id)
               .WithMany(p => p.App_Inventory_Order_Id)
               .HasForeignKey(d => d.PurchaseOrderId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_App_Inventory_Order_Id");

            builder.Entity<Inventory>().HasOne(d => d.Item_Id)
               .WithMany(p => p.App_InventoryItemId_Id)
               .HasForeignKey(d => d.ItemId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_App_InventoryItemId_Id");

            builder.Entity<WorkOrderStatusHistory>().HasOne(d => d.WorkOrder_Id)
               .WithMany(p => p.App_WorkOrderStatusHistory_Id)
               .HasForeignKey(d => d.WorkOrderId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_App_WorkOrderStatusHistory_Id");

            builder.Entity<WorkOrderStatusHistory>().HasOne(d => d.TypeCdDmt)
                .WithMany(p => p.App_WorkOrderStatusHistory_StausId)
                .HasForeignKey(d => d.StatusTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_WorkOrderStatusHistory_StausId");


            builder.Entity<WorkOrderStatusHistory>().HasOne(d => d.CreatedUser)
                .WithMany(p => p.App_WorkOrderStatusHistory_CreatedUser)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_WorkOrderStatusHistory_CreatedUser");

            builder.Entity<WorkOrderStatusHistory>().HasOne(d => d.UpdatedUser)
                .WithMany(p => p.App_WorkOrderStatusHistory_UpdatedUser)
                .HasForeignKey(d => d.UpdatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_WorkOrderStatusHistory_UpdatedUser");

            builder.Entity<PreventiveMaintenance>().HasOne(d => d.CreatedUser)
               .WithMany(p => p.App_PreventiveMaintenance_CreatedUser)
               .HasForeignKey(d => d.CreatedBy)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_App_PreventiveMaintenance_CreatedUser");

            builder.Entity<PreventiveMaintenance>().HasOne(d => d.UpdatedUser)
                .WithMany(p => p.App_PreventiveMaintenance_UpdatedUser)
                .HasForeignKey(d => d.UpdatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_PreventiveMaintenance_UpdatedUser");


            //builder.Entity<PreventiveMaintenance>().HasOne(d => d.Asset_Id)
            //    .WithMany(p => p.App_PreventiveMaintenance_Asset_Id)
            //    .HasForeignKey(d => d.AssetId)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK_App_PreventiveMaintenance_Asset_Id");

            builder.Entity<PreventiveMaintenance>().HasOne(d => d.StatusType_Id)
             .WithMany(p => p.App_PreventiveMaintenance_StatusId)
             .HasForeignKey(d => d.StatusTypeId)
             .OnDelete(DeleteBehavior.ClientSetNull)
             .HasConstraintName("FK_App_PreventiveMaintenance_StatusId");

            builder.Entity<PreventiveMaintenance>().HasOne(d => d.TypeOfMaintenance_Id)
             .WithMany(p => p.App_PreventiveMaintenance_MaintenanceId)
             .HasForeignKey(d => d.TypeOfMaintenance)
             .OnDelete(DeleteBehavior.ClientSetNull)
             .HasConstraintName("FK_AApp_PreventiveMaintenance_MaintenanceId");

            builder.Entity<PreventiveMaintenance>().HasOne(d => d.WorkTechnician_Id)
              .WithMany(p => p.App_PreventiveMaintenance_WorkTechinician_Id)
              .HasForeignKey(d => d.WorkTechnicianId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK_App_PreventiveMaintenance_WorkTechinician_Id");

            builder.Entity<PreventiveMaintenance>().HasOne(d => d.JobPlan_Id)
                .WithMany(p => p.App_PreventiveMaintenance_JobPlan_Id)
                .HasForeignKey(d => d.JobPlanId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_PreventiveMaintenance_JobPlan_Id");

            builder.Entity<PMAssetXref>().HasOne(d => d.PreventiveMaintenance_Id)
                 .WithMany(p => p.App_PreventiveMaintenance_AssetXref_Id)
                 .HasForeignKey(d => d.PreventiveMaintenanceId)
                 .OnDelete(DeleteBehavior.ClientSetNull)
                 .HasConstraintName("FK_App_PreventiveMaintenance_AssetXref_Id");

            builder.Entity<PMAssetXref>().HasOne(d => d.Asset_Id)
                .WithMany(p => p.App_PMAssetXref_Asset_Id)
                .HasForeignKey(d => d.AssetId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_PMAssetXref_Asset_Id");

            builder.Entity<PMStatusHistory>().HasOne(d => d.PreventiveMaintenance_Id)
              .WithMany(p => p.App_PMStatusHistory_PMtStatus_Id)
              .HasForeignKey(d => d.PreventiveMaintenanceId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK_App_PMStatusHistory_PMtStatus_Id");


            builder.Entity<PMStatusHistory>().HasOne(d => d.TypeCdDmt)
              .WithMany(p => p.App_PMStatusHistoryr_StatusId)
              .HasForeignKey(d => d.StatusTypeId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK_App_PMStatusHistoryr_StatusId");

            builder.Entity<JobPlan>().HasOne(d => d.StatusType_Id)
               .WithMany(p => p.App_JobPlan_StatusId)
               .HasForeignKey(d => d.StatusTypeId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_App_JobPlan_StatusId");

            builder.Entity<JobPlan>().HasOne(d => d.CreatedUser)
            .WithMany(p => p.App_JobPlan_CreatedUser)
            .HasForeignKey(d => d.CreatedBy)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_App_JobPlan_CreatedUser");

            builder.Entity<JobPlan>().HasOne(d => d.UpdatedUser)
                .WithMany(p => p.App_JobPlan_UpdatedUser)
                .HasForeignKey(d => d.UpdatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_App_JobPlan_UpdatedUser");

            builder.Entity<JobPlan>().HasOne(d => d.Technician_Id)
             .WithMany(p => p.App_JobPlan_Techinician_Id)
             .HasForeignKey(d => d.TechnicianId)
             .OnDelete(DeleteBehavior.ClientSetNull)
             .HasConstraintName("FK_App_JobPlan_Techinician_Id");

            builder.Entity<JobPlan>().HasOne(d => d.AssetGroup_Id)
               .WithMany(p => p.App_JobPlan_AssetGroup_Id)
             .HasForeignKey(d => d.AssetGroupId)
            .OnDelete(DeleteBehavior.ClientSetNull)
           .HasConstraintName("FK_App_JobPlan_AssetGroup_Id");


            builder.Entity<JobPlan>().HasOne(d => d.Site_Id)
               .WithMany(p => p.App_JobPlan_SiteId)
              .HasForeignKey(d => d.SiteId)
              .OnDelete(DeleteBehavior.ClientSetNull)
             .HasConstraintName("FK_App_JobPlan_SiteId");

            builder.Entity<JobPlan>().HasOne(d => d.Project_Id)
           .WithMany(p => p.App_JobPlan_ProjectId)
           .HasForeignKey(d => d.ProjectId)
           .OnDelete(DeleteBehavior.ClientSetNull)
           .HasConstraintName("FK_App_JobPlan_ProjectId");

            builder.Entity<JobTask>().HasOne(d => d.JobPlan_Id)
          .WithMany(p => p.App_JobTask_JobPlanId)
          .HasForeignKey(d => d.JobPlanId)
          .OnDelete(DeleteBehavior.ClientSetNull)
          .HasConstraintName("FK_App_JobTask_JobPlanId");

            builder.Entity<JobTask>().HasOne(d => d.AstTrade_Id)
               .WithMany(p => p.App_JobTask_AstTrade_Id)
               .HasForeignKey(d => d.AstTradeId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_App_JobTask_AstTrade_Id");

            builder.Entity<WorkOrder>().HasOne(d => d.PMProcedure_Id)
               .WithMany(p => p.App_WorkOrder_PMProcedure_Id)
               .HasForeignKey(d => d.PMProcedureId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_App_WorkOrder_PMProcedure_Id");

        }

        public override int SaveChanges()
        {
            UpdateAuditEntities();
            return base.SaveChanges();
        }


        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            UpdateAuditEntities();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }


        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(cancellationToken);
        }


        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }


        private void UpdateAuditEntities()
        {
            var modifiedEntries = ChangeTracker.Entries()
                .Where(x => x.Entity is IAuditableEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));


            foreach (var entry in modifiedEntries)
            {
                var entity = (IAuditableEntity)entry.Entity;
                DateTime now = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedDate = now;
                    entity.CreatedBy = CurrentUserId;
                }
                else
                {
                    base.Entry(entity).Property(x => x.CreatedBy).IsModified = false;
                    base.Entry(entity).Property(x => x.CreatedDate).IsModified = false;
                }

                entity.UpdatedDate = now;
                entity.UpdatedBy = CurrentUserId;
            }
        }
    }
}
