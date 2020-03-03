using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    public class Item
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Display(Name = "ItemReference")]
        [StringLength(50)]
        public string ItemReference { get; set; }

        [Required]
        [Display(Name = "ItemCategory")]
        public int ItemCategory { get; set; }
        
        [Display(Name = "Description")]
        public string Description { get; set; }

        [Required]
        [Display(Name = "ItemType")]
        public int ItemType { get; set; }

        [Required]
        [Display(Name = "Name1")]
        [StringLength(100)]
        public string Name1 { get; set; }

        [Required]
        [Display(Name = "Name2")]
        [StringLength(100)]
        public string Name2 { get; set; }

        [Display(Name = "AverageCost")]
        public int AverageCost { get; set; }

        [Display(Name = "UOMId")]
        public int UOMId { get; set; }


        [Display(Name = "UnitOfConversion")]
        [StringLength(100)]
        public string UnitOfConversion { get; set; }


        [Display(Name = "Units")]
        [StringLength(100)]
        public string Units { get; set; }

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
        public LookUp UOM_Id { get; set; }

        [JsonIgnore]
        public LookUp ItemCategory_Id { get; set; }

        [JsonIgnore]
        public TypeCdDmt  ItemType_Id { get; set; }

        public ICollection<PurchageItemXref> Purchage_ItemXref_Id { get; set; }

        public ICollection<WorkOrderItemXref> App_WorkOrderItemIdXref_Id { get; set; }


    }
}


