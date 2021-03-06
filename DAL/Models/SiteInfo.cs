﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
   public class SiteInfo
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Display(Name = "SiteReference")]
        [StringLength(50)]
        public string SiteReference { get; set; }

        [Required]
        [Display(Name = "Name1")]
        [StringLength(100)]
        public string Name1 { get; set; }

        [Required]
        [Display(Name = "Name2")]
        [StringLength(100)]
        public string Name2 { get; set; }

        [Display(Name = "File Name")]
        [StringLength(50)]
        public string FileName { get; set; }

        [Display(Name = "File Location")]
        [StringLength(250)]
        public string FileLocation { get; set; }
        
        [Display(Name = "File Extention")]
        [StringLength(10)]
        public string FileExtention { get; set; }

        [Required]
        [Display(Name = "Address")]
        [StringLength(500)]
        public string Address { get; set; }

        [Display(Name = "Latitude")]
        public double Latitude { get; set; }

        [Display(Name = "Longitude")]
        public double Longitude { get; set; }

        [Required]
        [Display(Name = "SiteManager")]
        [StringLength(30)]
        public string SiteManager { get; set; }

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

        public ICollection<Project> App_Project_SiteId { get; set; }

        // public ICollection<Location> App_Location_SiteId { get; set; }

        // public ICollection<AssetLocation> App_AssetLocation_SiteId { get; set; }

        public ICollection<JobPlan> App_JobPlan_SiteId { get; set; }



    }
}
