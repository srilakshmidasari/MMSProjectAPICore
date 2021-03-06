﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    public class LookUp
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Display(Name = "LookUp TypeId")]
        public int LookUpTypeId { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Name1")]
        public string Name1 { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Name2")]
        public string Name2 { get; set; }

        [StringLength(500)]
        [Display(Name = "Remarks")]
        public string Remarks { get; set; }

        [Display(Name = "IsActive")]
        public bool IsActive { get; set; }

        [Required]
        [Display(Name = "Created By")]
        public string CreatedBy { get; set; }

        [Required]
        [Display(Name = "Created Date")]
        public DateTime CreatedDate { get; set; }

        [Required]
        [Display(Name = "Updated By")]
        public string UpdatedBy { get; set; }

        [Required]
        [Display(Name = "Updated Date")]
        public DateTime UpdatedDate { get; set; }

        [JsonIgnore]
        public ApplicationUser CreatedUser { get; set; }
        [JsonIgnore]
        public ApplicationUser UpdatedUser { get; set; }

        [JsonIgnore]
        public TypeCdDmt TypecdId { get; set; }

        public ICollection<LookUpProjectXref> StorexrefId { get; set; }

        public ICollection<AssetLocation> App_AssetLocation_AstTrade_Id { get; set; }

        public ICollection<AssetLocation> App_AssetLocation_AstGroup_Id { get; set; }

        public ICollection<Item> App_Item_UOM_Id { get; set; }

        public ICollection<Item> App_Item_ItemCategory_Id { get; set; }

        public ICollection<PurchageOrder> App_PurchageOrder_Store_Id { get; set; }

        public ICollection<WorkOrder> App_WorkOrder_WorkType_Id { get; set; }

        public ICollection<WorkOrder> App_WorkOrder_Store_Id { get; set; }

        public ICollection<WorkOrder> App_WorkOrder_WorkSatus_Id { get; set; }
        public ICollection<WorkOrder> App_WorkOrder_WorkTechinician_Id { get; set; }
        public ICollection<WorkOrder> App_WorkOrder_WorkFault_Id { get; set; }

        public ICollection<PreventiveMaintenance> App_PreventiveMaintenance_WorkTechinician_Id { get; set; }

        public ICollection<JobPlan> App_JobPlan_Techinician_Id { get; set; }

        public ICollection<JobPlan> App_JobPlan_AssetGroup_Id { get; set; }

        public ICollection<JobTask> App_JobTask_AstTrade_Id { get; set; }



    }
}
 