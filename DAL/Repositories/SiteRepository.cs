using AutoMapper;
using DAL.Models;
using DAL.Repositories.Interfaces;
using DAL.Response;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.IO;
using static DAL.RequestResponseModels.RequestResponseModels;
using GoogleMaps.LocationServices;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class SiteRepository : Repository<dynamic>, ISiteRepository
    {
        public readonly IOptions<AppSettings> _config;
        public SiteRepository(ApplicationDbContext context, IMapper mapper, IOptions<AppSettings> configuration) : base(context, mapper, configuration)
        {
            _config = configuration;
        }
        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public ListDataResponse<SiteInfo> GetAllSite()
        {
            ListDataResponse<SiteInfo> response = new ListDataResponse<SiteInfo>();
            try
            {
                var result = _appContext.SiteInfos.ToList();
                var FileRepoBaseUrl = _config.Value.FileRepositoryUrl;

                result.ForEach(f => f.FileLocation = string.Format("{0}/{1}/{2}{3}", FileRepoBaseUrl, f.FileLocation, f.FileName, f.FileExtention));

                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All Site Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Site Details Found";
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

        public ValueDataResponse<SiteInfo> InsertSite(SiteInfo sites)
        {
            ValueDataResponse<SiteInfo> response = new ValueDataResponse<SiteInfo>();

            try
            {
                var siteExists = _appContext.SiteInfos.Where(x => x.SiteReference == sites.SiteReference).FirstOrDefault();
                if (siteExists == null)
                {

                    //    if (sites.Address != null)
                    //    {
                    //        coordinates LatLong = GetLatLngByAddress(sites.Address.ToString());
                    //        if (LatLong != null)
                    //        {
                    //            sites.Latitude = (float)(LatLong.Latitude);
                    //            sites.Longitude = (float)LatLong.Longitude;
                    //        }
                    //    }
                    var result = _appContext.SiteInfos.Add(sites);

                    if (sites.FileName != null)
                    {
                        string ModuleName = "Site";
                        var now = DateTime.Now;
                        var yearName = now.ToString("yyyy");
                        var monthName = now.Month.ToString("d2");
                        var dayName = now.ToString("dd");

                        FileUploadService repo = new FileUploadService();

                        //string FolderLocation = _config.Value.FileRepositoryFolder;
                        string FolderLocation = "FileRepository";
                        string ServerRootPath = _config.Value.ServerRootPath;

                        string Location = ServerRootPath + @"\" + FolderLocation + @"\" + yearName + @"\" + monthName + @"\" + dayName + @"\" + ModuleName;

                        byte[] FileBytes = Convert.FromBase64String(sites.FileName);

                        sites.FileName = repo.UploadFile(FileBytes, sites.FileExtention, Location);

                        sites.FileLocation = Path.Combine(yearName, monthName, dayName, ModuleName);
                    }
                    _appContext.SaveChanges();

                    if (result != null)
                    {
                        response.Result = sites;
                        response.IsSuccess = true;
                        response.AffectedRecords = 1;
                        response.EndUserMessage = "Site Added Successfully";
                    }
                    else
                    {
                        response.IsSuccess = true;
                        response.AffectedRecords = 0;
                        response.EndUserMessage = "Site Added Failed";
                    }
                }
                else
                {
                    response.IsSuccess = false;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Site Reference Already Exists";
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

        public ValueDataResponse<SiteInfo> UpdateSite(SiteInfo sites)
        {
            ValueDataResponse<SiteInfo> response = new ValueDataResponse<SiteInfo>();

            try
            {
                var siteExists = _appContext.SiteInfos.Where(x => x.Id != sites.Id && x.SiteReference == sites.SiteReference).FirstOrDefault();
                if (siteExists == null)
                {
                    var result = _appContext.SiteInfos.Where(x => x.Id == sites.Id).FirstOrDefault();
                    if (result != null)
                    {
                        result.SiteReference = sites.SiteReference;
                        result.Name1 = sites.Name1;
                        result.Name2 = sites.Name2;
                        result.Address = sites.Address;
                        result.Latitude = sites.Latitude;
                        result.Longitude = sites.Longitude;
                        result.SiteManager = sites.SiteManager;
                        result.IsActive = sites.IsActive;
                        result.CreatedBy = sites.CreatedBy;
                        result.CreatedDate = sites.CreatedDate;
                        result.UpdatedBy = sites.UpdatedBy;
                        result.UpdatedDate = sites.UpdatedDate;
                        //if (!string.IsNullOrEmpty(sites.Address))
                        //{
                        //    coordinates LatLong = GetLatLngByAddress(sites.Address.ToString());
                        //    if (LatLong != null)
                        //    {
                        //        result.Latitude = (float)(LatLong.Latitude);
                        //        result.Longitude = (float)LatLong.Longitude;
                        //    }
                        //}

                        if (sites.FileName != null)
                        {
                            string ModuleName = "Site";
                            var now = DateTime.Now;
                            var yearName = now.ToString("yyyy");
                            var monthName = now.Month.ToString("d2");
                            var dayName = now.ToString("dd");

                            FileUploadService repo = new FileUploadService();


                            string FolderLocation = _config.Value.FileRepositoryFolder;
                            string ServerRootPath = _config.Value.ServerRootPath;

                            string Location = ServerRootPath + @"\" + FolderLocation + @"\" + yearName + @"\" + monthName + @"\" + dayName + @"\" + ModuleName;

                            byte[] FileBytes = Convert.FromBase64String(sites.FileName);

                            result.FileName = repo.UploadFile(FileBytes, sites.FileExtention, Location);

                            result.FileLocation = Path.Combine(yearName, monthName, dayName, ModuleName);
                            result.FileExtention = sites.FileExtention;
                        }

                        _appContext.SaveChanges();
                        response.Result = result;
                        response.IsSuccess = true;
                        response.AffectedRecords = 1;
                        response.EndUserMessage = "Site Updated Successfully";
                    }
                    else
                    {
                        response.IsSuccess = true;
                        response.AffectedRecords = 0;
                        response.EndUserMessage = "Site Updation Failed";
                    }
                }
                else
                {
                    response.IsSuccess = false;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Site Reference Already Exists";
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
        public coordinates GetLatLngByAddress(string address)
        {
            try
            {
                var googleAPIKey = _config.Value.GoogleAPIKey;
                var locationService = new GoogleLocationService(apikey: googleAPIKey);
                MapPoint point = locationService.GetLatLongFromAddress(address);
                if (point == null)
                {
                    return null;
                }
                else
                {
                    var response = new coordinates
                    {
                        Latitude = point.Latitude,
                        Longitude = point.Longitude
                    };
                    return response;
                }
            }
            catch (Exception ex)
            {
                //return string.Format("Google Maps API Error {0}", ex.Message);
                return null;
            }

        }


        public ValueDataResponse<SiteInfo> DeleteSiteInfo(int SiteId)
        {
            ValueDataResponse<SiteInfo> response = new ValueDataResponse<SiteInfo>();
            try
            {


                var result = _appContext.SiteInfos.Where(x => x.Id == SiteId).FirstOrDefault();
                var projects = _appContext.Projects.Where(p => p.SiteId == SiteId).ToList();

                if (projects != null)
                {

                    var res = _appContext.ProjectRepositories.Where(x => projects.Select(p => p.Id).Contains(x.ProjectId)).ToList();
                    _appContext.ProjectRepositories.RemoveRange(res);

                    var ress = _appContext.LookUpProjectXrefs.Where(x => projects.Select(p => p.Id).Contains(x.ProjectId)).ToList();
                    _appContext.LookUpProjectXrefs.RemoveRange(ress);

                    var resss = _appContext.Locations.Where(x => projects.Select(p => p.Id).Contains(x.ProjectId)).ToList();

                    var alocs = _appContext.AssetLocations.Where(x => resss.Select(al => al.Id).Contains(x.LocationId)).ToList();

                    var assetRepo = _appContext.AssetFileRepositories.Where(x => alocs.Select(ar => ar.Id).Contains(x.AssetId)).ToList();
                    _appContext.AssetFileRepositories.RemoveRange(assetRepo);
                    _appContext.AssetLocations.RemoveRange(alocs);
                    _appContext.Locations.RemoveRange(resss);
                }

                _appContext.Projects.RemoveRange(projects);
                _appContext.SiteInfos.Remove(result);
                _appContext.SaveChanges();

                if (result != null)
                {
                    response.Result = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "SiteInfo Deleted Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No SiteInfo Found";
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
