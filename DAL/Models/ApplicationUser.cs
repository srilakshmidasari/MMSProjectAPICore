﻿// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using DAL.Models.Interfaces;

namespace DAL.Models
{
    public class ApplicationUser : IdentityUser, IAuditableEntity
    {
        public virtual string FriendlyName
        {
            get
            {
                string friendlyName = string.IsNullOrWhiteSpace(FullName) ? UserName : FullName;

                if (!string.IsNullOrWhiteSpace(JobTitle))
                    friendlyName = $"{JobTitle} {friendlyName}";

                return friendlyName;
            }
        }


        public string JobTitle { get; set; }
        public string FullName { get; set; }
        public string Configuration { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsLockedOut => this.LockoutEnabled && this.LockoutEnd >= DateTimeOffset.UtcNow;
        public string EmployeeId { get; set; }
        public string Name1 { get; set; }
        public string Name2 { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }



        /// <summary>
        /// Navigation property for the roles this user belongs to.
        /// </summary>
        public virtual ICollection<IdentityUserRole<string>> Roles { get; set; }

        /// <summary>
        /// Navigation property for the claims this user possesses.
        /// </summary>
        public virtual ICollection<IdentityUserClaim<string>> Claims { get; set; }

        /// <summary>
        /// Demo Navigation property for orders this user has processed
        /// </summary>
        // public ICollection<Order> Orders { get; set; }

        public ICollection<SiteInfo> App_SiteInfo_CreatedUser { get; set; }
        public ICollection<SiteInfo> App_SiteInfo_UpdatedUser { get; set; }

        public ICollection<FileRepository> App_Repository_CreatedUser { get; set; }
        public ICollection<FileRepository> App_Repository_UpdatedUser { get; set; }
        public ICollection<TypeCdDmt> App_TypeCdDmt_CreatedUser { get; set; }
        public ICollection<TypeCdDmt> App_TypeCdDmt_UpdatedUser { get; set; }
      
        public ICollection<ClassType> App_ClassType_CreatedUser { get; set; }
        public ICollection<ClassType> App_ClassType_UpdatedUser { get; set; }

        public ICollection<Project> App_Project_CreatedUser { get; set; }
        public ICollection<Project> App_Project_UpdatedUser { get; set; }
        public ICollection<ProjectRepository> App_ProjectRepository_CreatedUser { get; set; }
        public ICollection<ProjectRepository> App_ProjectRepository_UpdatedUser { get; set; }

        public ICollection<LookUp> App_LookUp_CreatedUser { get; set; }
        public ICollection<LookUp> App_LookUp_UpdatedUser { get; set; }

        public ICollection<Location> App_Location_CreatedUser { get; set; }
        public ICollection<Location> App_Location_UpdatedUser { get; set; }

        public ICollection<AssetGroup> App_AssetGroup_CreatedUser { get; set; }
        public ICollection<AssetGroup> App_AssetGroup_UpdatedUser { get; set; }

        public ICollection<AssetLocation> App_AssetLocation_CreatedUser { get; set; }
        public ICollection<AssetLocation> App_AssetLocation_UpdatedUser { get; set; }

        public ICollection<Supplier> App_Supplier_CreatedUser { get; set; }
        public ICollection<Supplier> App_Supplier_UpdatedUser { get; set; }

        public ICollection<AssetFileRepository> App_AssetFileRepository_CreatedUser { get; set; }
        public ICollection<AssetFileRepository> App_AssetFileRepository_UpdatedUser { get; set; }

        public ICollection<Item> App_Item_CreatedUser { get; set; }
        public ICollection<Item> App_Item_UpdatedUser { get; set; }

        public ICollection<PurchageOrder> App_PurchageOrder_CreatedUser { get; set; }
        public ICollection<PurchageOrder> App_PurchageOrder_UpdatedUser { get; set; }

        public ICollection<WorkOrder> App_WorkOrder_CreatedUser { get; set; }
        public ICollection<WorkOrder> App_WorkOrder_UpdatedUser { get; set; }

        public ICollection<UserProjectXref> App_UserProjectXref_UserId { get; set; }
        
        public ICollection<WorkOrderStatusHistory> App_WorkOrderStatusHistory_CreatedUser { get; set; }
        public ICollection<WorkOrderStatusHistory> App_WorkOrderStatusHistory_UpdatedUser { get; set; }

        public ICollection<PreventiveMaintenance> App_PreventiveMaintenance_CreatedUser { get; set; }
        public ICollection<PreventiveMaintenance> App_PreventiveMaintenance_UpdatedUser { get; set; }

        public ICollection<JobPlan> App_JobPlan_CreatedUser { get; set; }
        public ICollection<JobPlan> App_JobPlan_UpdatedUser { get; set; }
    }
}
