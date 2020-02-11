using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    public class AssetGroup
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Display(Name = "SiteId")]
        public int SiteId { get; set; }

        [Required]
        [Display(Name = "ProjectId")]
        public int ProjectId { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "AssetReference1")]
        public string AssetRef1 { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "AssetReference2")]
        public string AssetRef2 { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Name1")]
        public string Name1 { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Name2")]
        public string Name2 { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "AssetMake")]
        public string AssetMake { get; set; }
       
        [Required]
        [StringLength(100)]
        [Display(Name = "AssetModel")]
        public string AssetModel { get; set; }
       
        [Required]
        [StringLength(100)]
        [Display(Name = "AssetType")]
        public string AssetType { get; set; }
      
        [Required]
        [StringLength(100)]
        [Display(Name = "AssetCapacity")]
        public string AssetCapacity { get; set; }


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

        public ICollection<AssetLocation> App_AssetLocation_AstGroup_Id { get; set; }
        


    }
}
