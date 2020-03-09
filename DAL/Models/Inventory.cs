using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    public class Inventory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
      
        [Display(Name = "Purchase Order Id")]
        public int PurchaseOrderId { get; set; }
      
        [Display(Name = "Item Id")]
        public int ItemId { get; set; }

        [Display(Name = "Quantity")]
        public int Quantity { get; set; }

        
        [Display(Name = "Received Cost")]
        public double ReceivedCost { get; set; }

        [JsonIgnore]
        public PurchageOrder PurchaseOrder_Id { get; set; }

        [JsonIgnore]
        public Item Item_Id { get; set; }

    }

}
