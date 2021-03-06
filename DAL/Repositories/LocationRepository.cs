﻿using AutoMapper;
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

        public ListDataResponse<LocationDataResponse> GetLocationDetails()
        {
            ListDataResponse<LocationDataResponse> response = new ListDataResponse<LocationDataResponse>();
            try
            {
                //var result = _appContext.Locations.ToList();
                var result = (from l in _appContext.Locations
                              join p in _appContext.Projects on l.ProjectId equals p.Id
                              join s in _appContext.SiteInfos on p.SiteId equals s.Id

                              select new LocationDataResponse
                              {
                                  Id = l.Id,
                                  SiteId = p.SiteId,
                                  ProjectId=l.ProjectId,
                                  Name1 = l.Name1,
                                  Name2 = l.Name2,
                                  LocationReference = l.LocationReference,
                                  CreatedBy = l.CreatedBy,
                                  CreatedDate = l.CreatedDate,
                                  UpdatedBy = l.UpdatedBy,
                                  UpdatedDate = l.UpdatedDate,
                                  IsActive = l.IsActive,
                                  SiteName1=s.Name1,
                                  SiteName2=s.Name2,
                                  ProjectName1=p.Name1,
                                  ProjectName2=p.Name2

                              }).ToList();
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

        public ValueDataResponse<Location> UpdateLocation(Location location)
        {
            ValueDataResponse<Location> response = new ValueDataResponse<Location>();

            try
            {
                var locationExists = _appContext.Locations.Where(x =>x.Id!=location.Id && x.LocationReference == location.LocationReference).FirstOrDefault();
                if (locationExists == null)
                {
                    //var result = _appContext.Locations.Add(location);

                    var result = _appContext.Locations.Where(x => x.Id == location.Id).FirstOrDefault();
                    if (result != null)
                    {
                        //result.SiteId = location.SiteId;
                        result.ProjectId = location.ProjectId;
                        result.LocationReference = location.LocationReference;
                        result.Name1 = location.Name1;
                        result.Name2 = location.Name2;
                        result.IsActive = location.IsActive;
                        result.CreatedBy = location.CreatedBy;
                        result.CreatedDate = location.CreatedDate;
                        result.UpdatedBy = location.UpdatedBy;
                        result.UpdatedDate = location.UpdatedDate;

                        _appContext.SaveChanges();
                            response.Result = location;
                            response.IsSuccess = true;
                            response.AffectedRecords = 1;
                            response.EndUserMessage = "Location Updated Successfully";
                        }
                        else
                        {
                            response.IsSuccess = true;
                            response.AffectedRecords = 0;
                            response.EndUserMessage = "Location Updated Failed";
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

        public ValueDataResponse<Location> DeleteLocation(int LocationId)
        {
            ValueDataResponse<Location> response = new ValueDataResponse<Location>();
            try
            {
                var LocationData = _appContext.Locations.Where(x => x.Id == LocationId).FirstOrDefault();

                var ast = _appContext.AssetLocations.Where(x => x.LocationId == LocationId).ToList();
                if (ast != null)
                {
                    var assetRepo = _appContext.AssetFileRepositories.Where(x => ast.Select(ar => ar.Id).Contains(x.AssetId)).ToList();
                    var workOrders = _appContext.WorkOrders.Where(x => ast.Select(p => p.Id).Contains(x.AssetId)).ToList();

                    var resss = _appContext.WorkOrderItemXrefs.Where(x => workOrders.Select(p => p.Id).Contains(x.WorkOrderId)).ToList();
                    var sts = _appContext.WorkOrderStatusHistories.Where(x => workOrders.Select(p => p.Id).Contains(x.WorkOrderId)).ToList();
                    var pmast =_appContext.PMAssetXrefs.Where(x=> ast.Select(ar => ar.Id).Contains(x.AssetId)).ToList();

                    _appContext.AssetFileRepositories.RemoveRange(assetRepo);
                    _appContext.WorkOrderItemXrefs.RemoveRange(resss);
                    _appContext.WorkOrderStatusHistories.RemoveRange(sts);
                    _appContext.WorkOrders.RemoveRange(workOrders);
                    _appContext.PMAssetXrefs.RemoveRange(pmast);
                    _appContext.AssetLocations.RemoveRange(ast);
                    _appContext.Locations.RemoveRange(LocationData);
                    _appContext.SaveChanges();
                }
                _appContext.SaveChanges();

                if (LocationData != null)
                {
                   
                    response.Result = LocationData;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Location Deleted Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Location Found";
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

        public ListDataResponse<Location> GetLocationsByProjectId(int ProjectId)
        {
            ListDataResponse<Location> response = new ListDataResponse<Location>();
            try
            {
                var result = _appContext.Locations.Where(x => x.ProjectId == ProjectId).ToList();

                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = result.Count();
                    response.EndUserMessage = "Get Location Details Successfull";
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

        public ListDataResponse<Location> GetLocationsBySearch(SearchString search)
        {

            ListDataResponse<Location> response = new ListDataResponse<Location>();
            try
            {
                var result = _appContext.Locations.Where(x=> x.ProjectId == search.ProjectId &&
                               (x.Name1.ToLower().Contains(search.searchValue.ToLower()) || x.LocationReference.Contains(search.searchValue))).ToList();



                if (result.Count > 0)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = result.Count;
                    response.EndUserMessage = "Get Location Details Successfull";
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
    }
}
