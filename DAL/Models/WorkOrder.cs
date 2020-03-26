using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    public class WorkOrder
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Display(Name = "Asset Id")]
        public int AssetId { get; set; }

        [Required]
        [Display(Name = "Order Type Id")]
        public int OrderTypeId { get; set; }

        [Required]
        [Display(Name = "Start Date")]
        public DateTime StartDate { get; set; }

        [Required]
        [Display(Name = "End Date")]
        public DateTime EndDate { get; set; }

        [Required]
        [Display(Name = "Reference1")]
        public string Reference1 { get; set; }

       
        [Display(Name = "Extra Details")]
        public string ExtraDetails { get; set; }

        
        [Display(Name = "Issue")]
        public string Issue { get; set; }

        
        [Display(Name = "Resolution")]
        public string Resolution { get; set; }

       
        [Display(Name = "Work Type Id")]
        public int? WorkTypeId { get; set; }

       
        [Display(Name = "Work Status Id")]
        public int? WorkStatusId { get; set; }

       
        [Display(Name = "Work Technician Id")]
        public int? WorkTechnicianId { get; set; }

        
        [Display(Name = "Store_Id")]
        public int? StoreId { get; set; }

        
        [Display(Name = "Work Fault Id")]
        public int? WorkFaultId { get; set; }

        [Display(Name = "Is Active")]
        public bool IsActive { get; set; }

        [Display(Name = "Status Type Id")]
        public int StatusTypeId { get; set; }

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
        public LookUp WorkType_Id { get; set; }

        [JsonIgnore]
        public LookUp Store_Id { get; set; }

        [JsonIgnore]
        public LookUp WorkStatus_Id { get; set; }

        [JsonIgnore]
        public LookUp WorkTechnician_Id { get; set; }

        [JsonIgnore]
        public LookUp WorkFault_Id { get; set; }

        [JsonIgnore]
        public AssetLocation Asset_Id { get; set; }

        [JsonIgnore]
        public TypeCdDmt StatusType_Id { get; set; }

        [JsonIgnore]
        public TypeCdDmt OrderType_Id { get; set; }

        public ICollection<WorkOrderItemXref> App_WorkOrderItemxref_Id { get; set; }

        public ICollection<WorkOrderStatusHistory> App_WorkOrderStatusHistory_Id { get; set; }


    }
}
