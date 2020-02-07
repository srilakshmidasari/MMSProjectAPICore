using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
   public class Location
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Display(Name = "SiteId")]
        public int SiteId { get; set; }

        [Required]
        [Display(Name = "ProjectId")]
        public int ProjectId { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "LocationReference")]
        public string LocationReference { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Name1")]
        public string Name1 { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Name2")]
        public string Name2 { get; set; }

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
        public SiteInfo SiteInfo_Id { get; set; }

        [JsonIgnore]
        public Project Project_Id { get; set; }

        [JsonIgnore]
        public ApplicationUser CreatedUser { get; set; }
        [JsonIgnore]
        public ApplicationUser UpdatedUser { get; set; }


    }
}
