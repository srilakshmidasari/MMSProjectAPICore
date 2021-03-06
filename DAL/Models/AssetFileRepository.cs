﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    public class AssetFileRepository
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Display(Name = "Asset Id")]
        public int AssetId { get; set; }

        [Display(Name = "File Name")]
        [StringLength(50)]
        public string FileName { get; set; }

        [Display(Name = "File Location")]
        [StringLength(250)]
        public string FileLocation { get; set; }

        [Required]
        [Display(Name = "File Extention")]
        [StringLength(10)]
        public string FileExtention { get; set; }

        [Display(Name = "Document Type")]
        public int? DocumentType { get; set; }

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
        public AssetLocation Asset_Id { get; set; }

        [JsonIgnore]
        public TypeCdDmt Asset_TypeCdDmt { get; set; }
    }
}
 