using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    public class PreventiveMaintenance
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        [Display(Name = "Preventive Ref Id")]
        public string PreventiveRefId { get; set; }

        [Display(Name = "Days Applicable")]
        public string DaysApplicable { get; set; }
       
        [Display(Name = "Start Date")]
        public DateTime? StartDate { get; set; }

        [Required]
        [Display(Name = "Duration In Hours")]
        public string DurationinHours  { get; set; }

        [Required]
        [Display(Name = "Type Of Maintenance")]
        public int TypeOfMaintenance { get; set; }

        [Required]
        [Display(Name = "Work Technician Id")]
        public int WorkTechnicianId { get; set; }

        [Display(Name = "Details")]
        public string Details { get; set; }


        [Display(Name = "Is Active")]
        public bool IsActive { get; set; }

        [Display(Name = "Status Type Id")]
        public int StatusTypeId { get; set; }

        [Display(Name = "Job Plan Id")]
        public int? JobPlanId { get; set; }

        [Display(Name = "Priority")]
        public int? Priority { get; set; }

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
        public LookUp WorkTechnician_Id { get; set; }

        //[JsonIgnore]
        //public AssetLocation Asset_Id { get; set; }

        [JsonIgnore]
        public TypeCdDmt StatusType_Id { get; set; }

        [JsonIgnore]
        public TypeCdDmt TypeOfMaintenance_Id { get; set; }

        [JsonIgnore]
        public JobPlan JobPlan_Id { get; set; }


        public ICollection<PMAssetXref> App_PreventiveMaintenance_AssetXref_Id { get; set; }

        public ICollection<PMStatusHistory> App_PMStatusHistory_PMtStatus_Id { get; set; }

        public ICollection<WorkOrder> App_WorkOrder_PMProcedure_Id { get; set; }

    }
}
