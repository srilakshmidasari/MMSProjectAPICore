using DAL.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DAL.RequestResponseModels
{
    public class RequestResponseModels
    {
        public class UpsertSite : AuditableEntity
        {

            public int Id { get; set; }
            public string SiteReference { get; set; }
            public string Name1 { get; set; }
            public string Name2 { get; set; }
            public string FileName { get; set; }
            public string FileLocation { get; set; }
            public string FileExtention { get; set; }
            public string Address { get; set; }
            public double Latitude { get; set; }
            public double Longitude { get; set; }
        }

        public class UpsertRepository : AuditableEntity
        {
            public int RepositoryId { get; set; }
            public string UserId { get; set; }
            public string FileName { get; set; }
            public string FileLocation { get; set; }
            public string FileExtention { get; set; }
            public int DocumentTypeId { get; set; }


        }

        public class coordinates
        {
            public double Latitude { get; set; }
            public double Longitude { get; set; }

        }

        public class FileRepositoryResposnse 
        {
            public int RepositoryId { get; set; }
            public string UserId { get; set; }
            public string FileName { get; set; }
            public string FileLocation { get; set; }
            public string FileExtention { get; set; }
            public int? DocumentType { get; set; }
            public string FileTypeName { get; set; }
        }
    }
}
