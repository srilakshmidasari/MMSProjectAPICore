using AutoMapper;
using DAL.Models;
using DAL.Repositories.Interfaces;
using DAL.Response;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using static DAL.RequestResponseModels.RequestResponseModels;
using System.IO;

namespace DAL.Repositories
{
    public class AssetRepository :Repository<dynamic>, IAssetRepository
    {
        public readonly IOptions<AppSettings> _config;
        public AssetRepository(ApplicationDbContext context, IMapper mapper, IOptions<AppSettings> configuration) : base(context, mapper, configuration)
        {
            _config = configuration;
        }
        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public ListDataResponse<AssetGroup> GetAssetGroups()
        {
            ListDataResponse<AssetGroup> response = new ListDataResponse<AssetGroup>();
            try
            {
                var result = _appContext.AssetGroups.ToList();

                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All AssetGroup Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No AssetGroup Details Found";
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

        public ValueDataResponse<AssetGroup> InsertAssetGroup(AssetGroup asset)
        {
            ValueDataResponse<AssetGroup> response = new ValueDataResponse<AssetGroup>();

            try
            {
                    var result = _appContext.AssetGroups.Add(asset);
                    _appContext.SaveChanges();

                    if (result != null)
                    {
                        response.Result = asset;
                        response.IsSuccess = true;
                        response.AffectedRecords = 1;
                        response.EndUserMessage = "AssetGroup Added Successfully";
                    }
                    else
                    {
                        response.IsSuccess = true;
                        response.AffectedRecords = 0;
                        response.EndUserMessage = "AssetGroup Added Failed";
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

        public ValueDataResponse<AssetGroup> UpdateAssetGroup(AssetGroup asset)
        {
            ValueDataResponse<AssetGroup> response = new ValueDataResponse<AssetGroup>();

            try
            {
                    var result = _appContext.AssetGroups.Where(x => x.Id == asset.Id).FirstOrDefault();
                    if (result != null)
                    {
                        result.AssetRef1 = asset.AssetRef1;
                        result.AssetRef2 = asset.AssetRef2;
                        result.Name1 = asset.Name1;
                        result.Name2 = asset.Name2;
                        result.AssetMake = asset.AssetMake;
                        result.AssetModel = asset.AssetModel;
                        result.AssetCapacity = asset.AssetCapacity;
                        result.AssetType = asset.AssetType;
                        result.IsActive = asset.IsActive;
                        result.CreatedBy = asset.CreatedBy;
                        result.CreatedDate = asset.CreatedDate;
                        result.UpdatedBy = asset.UpdatedBy;
                        result.UpdatedDate = asset.UpdatedDate;

                        _appContext.SaveChanges();

                        response.Result = asset;
                        response.IsSuccess = true;
                        response.AffectedRecords = 1;
                        response.EndUserMessage = "AssetGroup Updated Successfully";
                    }
                    else
                    {
                        response.IsSuccess = true;
                        response.AffectedRecords = 0;
                        response.EndUserMessage = "AssetGroup Updated Failed";
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

        public ValueDataResponse<AssetGroup> DeleteAssetGroup(int assetId)
        {
            ValueDataResponse<AssetGroup> response = new ValueDataResponse<AssetGroup>();
            try
            {
                var assetData = _appContext.AssetGroups.Where(x => x.Id == assetId && x.IsActive == true).FirstOrDefault();
                if (assetData != null)
                {
                    assetData.IsActive = false;
                    assetData.UpdatedDate = DateTime.Now;
                    _appContext.SaveChanges();
                }

                if (assetData != null)
                {
                    response.Result = assetData;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "AssetGroup Deleted Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No AssetGroup Found";
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

        // Asset Location Services
        public ListDataResponse<GetAssetLocationResponse> GetAssetLocations()
        {
            ListDataResponse<GetAssetLocationResponse> response = new ListDataResponse<GetAssetLocationResponse>();
            try
            {
                var FileRepoBaseUrl = _config.Value.FileRepositoryUrl;
                var result = (from al in _appContext.AssetLocations
                              join s in _appContext.SiteInfos on al.SiteId equals s.Id
                              join p in _appContext.Projects on al.ProjectId equals p.Id
                              join l in _appContext.Locations on al.LocationId equals l.Id
                              join ag in _appContext.AssetGroups on al.AstGroupId equals ag.Id
                              join at in _appContext.LookUps on al.AstTradeId equals at.Id
                              select new GetAssetLocationResponse
                              {
                                  Id = al.Id,
                                  Name1 = al.Name1,
                                  Name2 = al.Name2,
                                  AssetLocationRef = al.AssetRef,
                                  SiteId = al.SiteId,
                                  SiteName1 = s.Name1,
                                  SiteName2 = s.Name2,
                                  ProjectId = al.ProjectId,
                                  ProjectName1 = p.Name1,
                                  ProjectName2 = p.Name2,
                                  LocationId = al.LocationId,
                                  LocationName1 = l.Name1,
                                  LocationName2 = l.Name2,
                                  AstTradeId = al.AstTradeId,
                                  AstTradeName1 = at.Name1,
                                  AstTradeName2 = at.Name2,
                                  AstGroupId = al.AstGroupId,
                                  AstGroupName1 = ag.Name1,
                                  AstGroupName2 = ag.Name2,
                                  AssetMake = ag.AssetMake,
                                  AssetCapacity = ag.AssetCapacity,
                                  AssetModel = ag.AssetModel,
                                  AssetGroupRef1 = ag.AssetRef1,
                                  AssetGroupRef2 = ag.AssetRef2,
                                  AssetType = ag.AssetType,
                                  AstCounter = al.AstCounter,
                                  AstFixedDate = al.AstFixedDate,
                                  FileName = al.FileName,
                                  FileLocation = al.FileLocation,
                                  FileExtention =al.FileExtention,
                                  IsActive = al.IsActive,
                                  CreatedBy = al.CreatedBy,
                                  CreatedDate = al.CreatedDate,
                                  UpdatedBy = al.UpdatedBy,
                                  UpdatedDate = al.UpdatedDate
                              }).ToList();

                result.ForEach(f => f.FileLocation = string.Format("{0}/{1}/{2}{3}", FileRepoBaseUrl, f.FileLocation, f.FileName, f.FileExtention));
                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All Asset Location Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Asset Location Details Found";
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

        public ValueDataResponse<AssetLocation> InsertAssetLocation(AssetLocation asset)
        {
            ValueDataResponse<AssetLocation> response = new ValueDataResponse<AssetLocation>();

            try
            {
                var siteExists = _appContext.AssetLocations.Where(x => x.AssetRef == asset.AssetRef).FirstOrDefault();
                if (siteExists == null)
                {
                    var result = _appContext.AssetLocations.Add(asset);

                    if (asset.FileName != null)
                    {
                        string ModuleName = "AssetLocation";
                        var now = DateTime.Now;
                        var yearName = now.ToString("yyyy");
                        var monthName = now.Month.ToString("d2");
                        var dayName = now.ToString("dd");

                        FileUploadService repo = new FileUploadService();

                        //string FolderLocation = _config.Value.FileRepositoryFolder;
                        string FolderLocation = "FileRepository";
                        string ServerRootPath = _config.Value.ServerRootPath;

                        string Location = ServerRootPath + @"\" + FolderLocation + @"\" + yearName + @"\" + monthName + @"\" + dayName + @"\" + ModuleName;

                        byte[] FileBytes = Convert.FromBase64String(asset.FileName);

                        asset.FileName = repo.UploadFile(FileBytes, asset.FileExtention, Location);

                        asset.FileLocation = Path.Combine(yearName, monthName, dayName, ModuleName);
                    }
                    _appContext.SaveChanges();

                    if (result != null)
                    {
                        response.Result = asset;
                        response.IsSuccess = true;
                        response.AffectedRecords = 1;
                        response.EndUserMessage = "Asset Location Added Successfully";
                    }
                    else
                    {
                        response.IsSuccess = true;
                        response.AffectedRecords = 0;
                        response.EndUserMessage = "Asset Location Added Failed";
                    }
                }
                else
                {
                    response.IsSuccess = false;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Asset Reference Already Exists";
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
