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
        }

    }
}
