using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Json.Serialization;

namespace DAL.Models
{
    public class TypeCdDmt
    {
        [Key]
        public int TypeCdDmtId { get; set; }

        [Required]
        [Display(Name = "Class TypeId")]
        public int ClassTypeId { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Description")]
        public string Description { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Table Name")]
        public string TableName { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Column Name")]
        public string ColumnName { get; set; }

        [Required]
        [Display(Name = "Sort Order")]
        public int SortOrder { get; set; }

        [Required]
        //[DefaultValue(true)]
        [Display(Name = "IsActive")]
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
        public ClassType ClassType { get; set; }

        [JsonIgnore]
        public ApplicationUser CreatedUser { get; set; }
        [JsonIgnore]
        public ApplicationUser UpdatedUser { get; set; }
        //[JsonIgnore]
        public ICollection<FileRepository> FileRepository_DocumentTypeId { get; set; }

        public ICollection<ProjectRepository> ProjectRepository_DocumentTypeId { get; set; }

        public ICollection<LookUp> LookUP_TypeId { get; set; }

        public ICollection<AssetFileRepository> Asset_DocumnetId { get; set; }

    }
}
