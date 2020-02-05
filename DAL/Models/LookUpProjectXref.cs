using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    public class LookUpProjectXref
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Display(Name = "Store Id")]
        public int StoreId { get; set; }

        [Required]
        [Display(Name = "Project Id")]
        public int ProjectId { get; set; }

        [JsonIgnore]
        public LookUp LookUp_Id { get; set; }

        [JsonIgnore]
        public Project Project_Id { get; set; }
    }
}
