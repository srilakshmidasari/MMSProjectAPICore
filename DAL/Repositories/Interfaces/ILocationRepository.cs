using DAL.Models;
using DAL.Response;
using System;
using System.Collections.Generic;
using System.Text;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace DAL.Repositories.Interfaces
{
   public interface ILocationRepository
    {
        ListDataResponse<LocationDataResponse> GetLocationDetails(); 

        ValueDataResponse<Location> InsertLocation(Location location);

        ValueDataResponse<Location> UpdateLocation(Location location);

        ValueDataResponse<Location> DeleteLocation(int LocationId);

        ListDataResponse<Location> GetLocationsByProjectId(int ProjectId);

        ListDataResponse<Location> GetLocationsBySearch(SearchString search);
    }
}
