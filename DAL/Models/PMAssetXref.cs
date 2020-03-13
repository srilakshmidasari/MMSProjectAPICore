using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    public class PMAssetXref
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Display(Name = "Asset Id")]
        public int AssetId { get; set; }

        [Required]
        [Display(Name = "Preventive Maintenance Id")]
        public int PreventiveMaintenanceId { get; set; }

        [JsonIgnore]
        public PreventiveMaintenance PreventiveMaintenance_Id { get; set; }

        [JsonIgnore]
        public AssetLocation Asset_Id { get; set; }
    }
}
