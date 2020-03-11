using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
   public class WorkOrderStatusHistory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WorkOrderStatusHistoryId { get; set; }

        [Required]
        [Display(Name = "WorkOrder Id")]
        public int WorkOrderId { get; set; }

        [Required]
        [Display(Name = "Status Type Id")]
        public int StatusTypeId { get; set; }


        [StringLength(1000)]
        [Display(Name = "Comments")]

        public string Comments { get; set; }

        [Required]
        [Display(Name = "CreatedBy")]
        public string CreatedBy { get; set; }

        [Required]
        [Display(Name = "Created Date")]
        public DateTime CreatedDate { get; set; }

        [Required]
        [Display(Name = "UpdatedBy")]
        public string UpdatedBy { get; set; }

        [Required]
        [Display(Name = "Updated Date")]
        public DateTime UpdatedDate { get; set; }

        [JsonIgnore]
        public WorkOrder WorkOrder_Id { get; set; }

        [JsonIgnore]
        public TypeCdDmt TypeCdDmt { get; set; }

        [JsonIgnore]
        public ApplicationUser CreatedUser { get; set; }
        [JsonIgnore]
        public ApplicationUser UpdatedUser { get; set; }
    }
}
