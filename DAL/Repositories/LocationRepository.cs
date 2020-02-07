using AutoMapper;
using DAL.Models;
using DAL.Repositories.Interfaces;
using DAL.Response;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace DAL.Repositories
{
   public class LocationRepository:Repository<dynamic>, ILocationRepository
    {
        public readonly IOptions<AppSettings> _config;
        public LocationRepository(ApplicationDbContext context, IMapper mapper, IOptions<AppSettings> configuration) : base(context, mapper, configuration)
        {
            _config = configuration;
        }
        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public ListDataResponse<Location> GetLocationDetails()
        {
            ListDataResponse<Location> response = new ListDataResponse<Location>();
            try
            {
                var result = _appContext.Locations.ToList();
                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All Location Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Location Details Found";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.AffectedRecords = 0;
                response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                response.Exception = ex;
            }

            return response;
        }

        public ValueDataResponse<Location> InsertLocation(Location location)
        {
            ValueDataResponse<Location> response = new ValueDataResponse<Location>();

            try
            {
                var locationExists = _appContext.Locations.Where(x => x.LocationReference == location.LocationReference).FirstOrDefault();
                if (locationExists == null)
                {
                    var result = _appContext.Locations.Add(location);
                    
                    _appContext.SaveChanges();

                    if (result != null)
                    {
                        response.Result = location;
                        response.IsSuccess = true;
                        response.AffectedRecords = 1;
                        response.EndUserMessage = "Location Added Successfully";
                    }
                    else
                    {
                        response.IsSuccess = true;
                        response.AffectedRecords = 0;
                        response.EndUserMessage = "Location Added Failed";
                    }
                }
                else
                {
                    response.IsSuccess = false;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Location Reference Already Exists";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.AffectedRecords = 0;
                response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                response.Exception = ex;
            }

            return response;
        }
    }
}
