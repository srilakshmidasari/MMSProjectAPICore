using DAL.Models;
using DAL.Response;
using System;
using System.Collections.Generic;
using System.Text;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace DAL.Repositories.Interfaces
{
   public interface ISiteRepository
    {
        ListDataResponse<SiteInfo> GetAllSite();
        ValueDataResponse<SiteInfo> InsertSite(SiteInfo sites);
        coordinates GetLatLngByAddress(string address);
    }
}
