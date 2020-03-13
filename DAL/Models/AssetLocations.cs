using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    public class AssetLocation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Display(Name = "LocationId")]
        public int LocationId { get; set; }

        [Required]
        [Display(Name = "AstGroupId")]
        public int AstGroupId { get; set; }

        [Required]
        [Display(Name = "AstTradeId")]
        public int AstTradeId { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "AssetReference")]
        public string AssetRef { get; set; }
      
        [StringLength(100)]
        [Display(Name = "Asset Size")]
        public string AssetSize { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Name1")]
        public string Name1 { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Name2")]

        public string Name2 { get; set; }
       
        [StringLength(100)]
        [Display(Name = "Asset Make")]
        public string AssetMake { get; set; }

        
        [StringLength(100)]
        [Display(Name = "Asset Model")]
        public string AssetModel { get; set; }

        
        [StringLength(100)]
        [Display(Name = "Asset Type")]
        public string AssetType { get; set; }
       
        [StringLength(100)]
        [Display(Name = "Asset Capacity")]
        public string AssetCapacity { get; set; }

        [Display(Name = "IsActive")]
        public bool IsActive { get; set; }

        [Required]
        [Display(Name = "Ast Counter")]
        public int AstCounter { get; set; }

        [Required]
        [Display(Name = "AstFixed Date")]
        public DateTime AstFixedDate { get; set; }

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
        public LookUp AstGroup_Id { get; set; }

        [JsonIgnore]
        public LookUp AstTrade_Id { get; set; }

        [JsonIgnore]
        public Location Location_Id { get; set; }

        [JsonIgnore]
        public ApplicationUser CreatedUser { get; set; }
        [JsonIgnore]
        public ApplicationUser UpdatedUser { get; set; }
        public ICollection<AssetFileRepository> App_Repository_Id { get; set; }

        public ICollection<WorkOrder> App_WorkOrderAsset_Id { get; set; }

        public ICollection<PreventiveMaintenance> App_PreventiveMaintenance_Asset_Id { get; set; }


    }
}
