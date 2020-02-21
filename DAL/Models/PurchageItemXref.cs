using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    public class PurchageItemXref
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Display(Name = "Purchage Id")]
        public int PurchageId { get; set; }

        [Required]
        [Display(Name = "Item Id")]
        public int ItemId { get; set; }

        [Required]
        [Display(Name = "Quantity")]
        public int Quantity { get; set; }

        [Required]
        [Display(Name = "Expectd Cost")]
        public int ExpectdCost { get; set; }

        [JsonIgnore]
        public Item Item_Id { get; set; }

        [JsonIgnore]
        public PurchageOrder Purchage_Id { get; set; }
    }
}
