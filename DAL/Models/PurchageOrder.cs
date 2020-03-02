using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    public class PurchageOrder
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Display(Name = "SupplierId")]
        [StringLength(50)]
        public int SupplierId { get; set; }

        [Required]
        [Display(Name = "Arriving Date")]
        public DateTime ArrivingDate { get; set; }

        [Required]
        [Display(Name = "Purchase Reference")]
        [StringLength(50)]
        public string PurchaseReference { get; set; }

        [Required]
        [Display(Name = "Project Id")]
        public int ProjectId { get; set; }

        [Required]
        [Display(Name = "Store Id")]
        public int StoreId { get; set; }

        [Display(Name = "File Name")]
        [StringLength(50)]
        public string FileName { get; set; }

        [Display(Name = "File Location")]
        [StringLength(250)]
        public string FileLocation { get; set; }

        [Display(Name = "File Extention")]
        [StringLength(10)]
        public string FileExtention { get; set; }

        [Display(Name = "Status Type Id")]
        public int StatusTypeId { get; set; }

        [Display(Name = "Remarks")]
        [StringLength(200)]
        public string Remarks { get; set; }

        
        [Display(Name = "Billing Address")]
        [StringLength(500)]
        public string BillingAddress { get; set; }

        [Display(Name = "Shipping Address")]
        [StringLength(500)]
        public string ShippingAddress { get; set; }

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
        public Supplier Supplier_Id { get; set; }


        [JsonIgnore]
        public TypeCdDmt StatusType_Id { get; set; }

        [JsonIgnore]
        public Project Project_Id { get; set; }

        [JsonIgnore]
        public LookUp Store_Id { get; set; }

        public ICollection<PurchageItemXref> Purchage_OrderXref_Id { get; set; }

    }
}
