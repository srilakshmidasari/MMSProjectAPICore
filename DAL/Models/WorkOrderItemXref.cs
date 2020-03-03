using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    public class WorkOrderItemXref
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Display(Name = "Work Order Id")]
        public int WorkOrderId { get; set; }

        [Required]
        [Display(Name = "Item Id")]
        public int ItemId { get; set; }

        [Required]
        [Display(Name = "Quantity")]
        public int Quantity { get; set; }
        

        [JsonIgnore]
        public Item Item_Id { get; set; }

        [JsonIgnore]
        public WorkOrder WorkOrder_Id { get; set; }
    }
}
