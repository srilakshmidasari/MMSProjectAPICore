// =============================
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

            builder.Entity<Project>().HasOne(d => d.LookUp_Id)
             .WithMany(p => p.App_Project_StoreId)
             .HasForeignKey(d => d.StoreId)
             .OnDelete(DeleteBehavior.ClientSetNull)
             .HasConstraintName("FK_App_Project_StoreId");
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
