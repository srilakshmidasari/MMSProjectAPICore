using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    public class Project
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Display(Name = "Site Id")]
        public int SiteId { get; set; }

        //[Required]
        //[Display(Name = "Store Id")]
        //public int StoreId { get; set; }

        [Required]
        [Display(Name = "Project  ")]
        [StringLength(50)]
        public string ProjectReference { get; set; }

        [Required]
        [Display(Name = "Name1")]
        [StringLength(100)]
        public string Name1 { get; set; }

        [Required]
        [Display(Name = "Name2")]
        [StringLength(100)]
        public string Name2 { get; set; }

        [Required]
        [Display(Name = "ProjectDetails")]
        [StringLength(500)]
        public string ProjectDetails { get; set; }

        [Display(Name = "Is Active")]
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
        public SiteInfo SiteInfo_Id { get; set; }

        //[JsonIgnore]
        //public LookUp LookUp_Id { get; set; }

        [JsonIgnore]
        public ICollection<ProjectRepository> App_ProjectRepository_ProjectId { get; set; }

        public ICollection<LookUpProjectXref> ProjectxrefId { get; set; }

        public ICollection<Location> Location_ProjectId { get; set; }

        public ICollection<PurchageOrder> App_PurchageOrder_ProjectId { get; set; }

        public ICollection<UserProjectXref> App_UserProjectXref_ProjectId { get; set; }

        public ICollection<JobPlan> App_JobPlan_ProjectId { get; set; }

    }
}
