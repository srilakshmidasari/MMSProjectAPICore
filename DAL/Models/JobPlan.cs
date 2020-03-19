using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    public class JobPlan
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Job Reference")]
        public string JobReference { get; set; }       

        [Required]
        [StringLength(100)]
        [Display(Name = "Name")]
        public string Name { get; set; }

        [Required]
        [StringLength(500)]
        [Display(Name = "JobDescription")]
        public string JobDescription { get; set; }


        [Display(Name = "Site Id")]
        public int? SiteId { get; set; }

        [Display(Name = "Project Id")]
        public int? ProjectId { get; set; }

        [Required]
        [Display(Name = "Status Type Id")]
        public int StatusTypeId { get; set; }

      
        [Display(Name = "Technician Id")]
        public int? TechnicianId { get; set; }

       
        [Display(Name = "AssetGroup Id")]
        public int? AssetGroupId { get; set; }

        [Required]
        [Display(Name = "Duration")]
        public string Duration { get; set; }

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
        public LookUp Technician_Id { get; set; }

        [JsonIgnore]
        public LookUp AssetGroup_Id { get; set; }

        [JsonIgnore]
        public SiteInfo Site_Id { get; set; }

        [JsonIgnore]
        public Project Project_Id { get; set; }

        [JsonIgnore]
        public TypeCdDmt StatusType_Id { get; set; }

        public ICollection<JobTask> App_JobTask_JobPlanId { get; set; }


        public ICollection<PreventiveMaintenance> App_PreventiveMaintenance_JobPlan_Id { get; set; }



    }
}
