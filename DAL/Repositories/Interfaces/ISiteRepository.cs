using DAL.Models;
using DAL.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.Interfaces
{
   public interface ISiteRepository
    {
        ListDataResponse<Site> GetAllSite();

        ValueDataResponse<Site> InsertEvent(Site sites);
    }
}
