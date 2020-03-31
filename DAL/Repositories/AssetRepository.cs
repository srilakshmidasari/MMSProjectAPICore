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
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class AssetRepository : Repository<dynamic>, IAssetRepository
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
                var assetData = _appContext.AssetGroups.Where(x => x.Id == assetId).FirstOrDefault();

                var assetloc = _appContext.AssetLocations.Where(x => x.AstGroupId == assetId).ToList();
                if (assetloc != null)
                {
                    //assetData.IsActive = false;
                    //assetData.UpdatedDate = DateTime.Now;
                    var alocs = _appContext.AssetFileRepositories.Where(x => assetloc.Select(al => al.Id).Contains(x.AssetId)).ToList();
                    _appContext.AssetFileRepositories.RemoveRange(alocs);
                    _appContext.AssetLocations.RemoveRange(assetloc);
                    _appContext.AssetGroups.RemoveRange(assetData);
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
                              join l in _appContext.Locations on al.LocationId equals l.Id
                              join p in _appContext.Projects on l.ProjectId equals p.Id
                              join s in _appContext.SiteInfos on p.SiteId equals s.Id
                              join ag in _appContext.LookUps on al.AstGroupId equals ag.Id
                              join at in _appContext.LookUps on al.AstTradeId equals at.Id
                              select new GetAssetLocationResponse
                              {
                                  Id = al.Id,
                                  Name1 = al.Name1,
                                  Name2 = al.Name2,
                                  AssetLocationRef = al.AssetRef,
                                  SiteId = p.SiteId,
                                  SiteName1 = s.Name1,
                                  SiteName2 = s.Name2,
                                  ProjectId = l.ProjectId,
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
                                  AssetMake = al.AssetMake,
                                  AssetCapacity = al.AssetCapacity,
                                  AssetModel = al.AssetModel,
                                  AssetSize = al.AssetSize,
                                  AssetType = al.AssetType,
                                  AstCounter = al.AstCounter,
                                  AstFixedDate = al.AstFixedDate,
                                  IsActive = al.IsActive,
                                  CreatedBy = al.CreatedBy,
                                  CreatedDate = al.CreatedDate,
                                  UpdatedBy = al.UpdatedBy,
                                  UpdatedDate = al.UpdatedDate
                              }).ToList();


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

        public ValueDataResponse<AssetLocation> InsertAssetLocation(UpsertAssetLocation asset)
        {
            ValueDataResponse<AssetLocation> response = new ValueDataResponse<AssetLocation>();

            try
            {
                AssetLocation assetInfo = _mapper.Map<AssetLocation>(asset);

                var siteExists = _appContext.AssetLocations.Where(x => x.AssetRef == asset.AssetRef).FirstOrDefault();
                if (siteExists == null)
                {
                    var result = _appContext.AssetLocations.Add(assetInfo);
                    _appContext.SaveChanges();

                    foreach (var req in asset.AssetRepositories)
                    {
                        if (req.FileName != null)
                        {
                            string ModuleName = "Assets";
                            var now = DateTime.Now;
                            var yearName = now.ToString("yyyy");
                            var monthName = now.Month.ToString("d2");
                            var dayName = now.ToString("dd");

                            FileUploadService repo = new FileUploadService();

                            string FolderLocation = "FileRepository";
                            string ServerRootPath = _config.Value.ServerRootPath;

                            string Location = ServerRootPath + @"\" + FolderLocation + @"\" + yearName + @"\" + monthName + @"\" + dayName + @"\" + ModuleName;

                            byte[] FileBytes = Convert.FromBase64String(req.FileName);

                            req.FileName = repo.UploadFile(FileBytes, req.FileExtention, Location);

                            req.FileLocation = Path.Combine(yearName, monthName, dayName, ModuleName);

                            AssetFileRepository pros = new AssetFileRepository();
                            {
                                pros.AssetId = assetInfo.Id;
                                pros.FileName = req.FileName;
                                pros.FileLocation = req.FileLocation;
                                pros.FileExtention = req.FileExtention;
                                pros.DocumentType = req.DocumentTypeId;
                                pros.CreatedBy = req.CreatedBy;
                                pros.CreatedDate = DateTime.Now;
                                pros.UpdatedBy = req.UpdatedBy;
                                pros.UpdatedDate = DateTime.Now;
                            }
                            _appContext.AssetFileRepositories.Add(pros);
                        }
                    }
                    _appContext.SaveChanges();

                    if (result != null)
                    {
                        response.Result = assetInfo;
                        response.IsSuccess = true;
                        response.AffectedRecords = 1;
                        response.EndUserMessage = "Asset Added Successfully";
                    }
                    else
                    {
                        response.IsSuccess = true;
                        response.AffectedRecords = 0;
                        response.EndUserMessage = "Asset Added Failed";
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


        public ValueDataResponse<AssetLocation> UpdateAssetLocation(UpsertAssetLocation asset)
        {
            ValueDataResponse<AssetLocation> response = new ValueDataResponse<AssetLocation>();

            try
            {
                AssetLocation assetInfo = _mapper.Map<AssetLocation>(asset);
                var assetExists = _appContext.AssetLocations.Where(x => x.Id != asset.Id && x.AssetRef == asset.AssetRef).FirstOrDefault();
                if (assetExists == null)
                {
                    var result = _appContext.AssetLocations.Where(x => x.Id == asset.Id).FirstOrDefault();
                    if (result != null)
                    {
                        //result.SiteId = asset.SiteId;
                        //result.ProjectId = asset.ProjectId;
                        result.LocationId = asset.LocationId;
                        result.AstGroupId = asset.AstGroupId;
                        result.AstTradeId = asset.AstTradeId;
                        result.Name1 = asset.Name1;
                        result.Name2 = asset.Name2;
                        result.AssetRef = asset.AssetRef;
                        result.AstCounter = asset.AstCounter;
                        result.AstFixedDate = asset.AstFixedDate;
                        result.AssetSize = asset.AssetSize;
                        result.AssetMake = asset.AssetMake;
                        result.AssetModel = asset.AssetModel;
                        result.AssetType = asset.AssetType;
                        result.AssetCapacity = asset.AssetCapacity;
                        result.IsActive = asset.IsActive;
                        result.CreatedBy = asset.CreatedBy;
                        result.CreatedDate = asset.CreatedDate;
                        result.UpdatedBy = asset.UpdatedBy;
                        result.UpdatedDate = asset.UpdatedDate;
                        foreach (var req in asset.AssetRepositories)
                        {
                            if (req.FileName != null)
                            {
                                string ModuleName = "Assets";
                                var now = DateTime.Now;
                                var yearName = now.ToString("yyyy");
                                var monthName = now.Month.ToString("d2");
                                var dayName = now.ToString("dd");

                                FileUploadService repo = new FileUploadService();

                                string FolderLocation = "FileRepository";
                                string ServerRootPath = _config.Value.ServerRootPath;

                                string Location = ServerRootPath + @"\" + FolderLocation + @"\" + yearName + @"\" + monthName + @"\" + dayName + @"\" + ModuleName;

                                byte[] FileBytes = Convert.FromBase64String(req.FileName);

                                req.FileName = repo.UploadFile(FileBytes, req.FileExtention, Location);

                                req.FileLocation = Path.Combine(yearName, monthName, dayName, ModuleName);

                                AssetFileRepository pros = new AssetFileRepository();
                                {
                                    pros.AssetId = assetInfo.Id;
                                    pros.FileName = req.FileName;
                                    pros.FileLocation = req.FileLocation;
                                    pros.FileExtention = req.FileExtention;
                                    pros.DocumentType = req.DocumentTypeId;
                                    pros.CreatedBy = req.CreatedBy;
                                    pros.CreatedDate = DateTime.Now;
                                    pros.UpdatedBy = req.UpdatedBy;
                                    pros.UpdatedDate = DateTime.Now;
                                }
                                _appContext.AssetFileRepositories.Add(pros);
                            }
                        }
                        _appContext.SaveChanges();
                        response.Result = result;
                        response.IsSuccess = true;
                        response.AffectedRecords = 1;
                        response.EndUserMessage = "Asset Updated Successfully";
                    }
                    else
                    {
                        response.IsSuccess = true;
                        response.AffectedRecords = 0;
                        response.EndUserMessage = "Asset Updation Failed";
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

        public ValueDataResponse<AssetLocation> DeleteAssetLocation(int assetId)
        {
            ValueDataResponse<AssetLocation> response = new ValueDataResponse<AssetLocation>();
            try
            {
                var assetData = _appContext.AssetLocations.Where(x => x.Id == assetId).FirstOrDefault();

                var workOrders = _appContext.WorkOrders.Where(x => x.AssetId == assetId).ToList();

                if (assetData != null)
                {
                    //assetData.IsActive = false;
                    //assetData.UpdatedDate = DateTime.Now;

                    var assetFiles = _appContext.AssetFileRepositories.Where(x => x.AssetId == assetId).ToList();
                    var resss = _appContext.WorkOrderItemXrefs.Where(x => workOrders.Select(p => p.Id).Contains(x.WorkOrderId)).ToList();

                    _appContext.AssetFileRepositories.RemoveRange(assetFiles);
                    _appContext.WorkOrderItemXrefs.RemoveRange(resss);
                    _appContext.WorkOrders.RemoveRange(workOrders);
                    _appContext.AssetLocations.Remove(assetData);
                    _appContext.SaveChanges();
                }

                if (assetData != null)
                {
                    response.Result = assetData;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "AssetLocation Deleted Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No AssetLocation Found";
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

        //public ListDataResponse<AssetGroup> GetAssetGroupDetilasById(int assetId)
        //{
        //    ListDataResponse<AssetGroup> response = new ListDataResponse<AssetGroup>();
        //    try
        //    {
        //        var assetData = _appContext.AssetGroups.Where(x => x.Id == assetId && x.IsActive == true).FirstOrDefault();
        //        if (assetData != null)
        //        {
        //            response.Result = assetData;
        //            response.IsSuccess = true;
        //            response.AffectedRecords = 1;
        //            response.EndUserMessage = " Get AssetGroup Details Successfull";
        //        }

        //        else
        //        {
        //            response.IsSuccess = true;
        //            response.AffectedRecords = 0;
        //            response.EndUserMessage = "No AssetGroup Found";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.AffectedRecords = 0;
        //        response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
        //        response.Exception = ex;
        //    }

        //    return response;
        //}

        public ListDataResponse<AssetRepositoryResposnse> GetRepositoryByAsset(int AssetId)
        {
            ListDataResponse<AssetRepositoryResposnse> response = new ListDataResponse<AssetRepositoryResposnse>();
            try
            {
                var result = (from p in _appContext.AssetFileRepositories
                              join t in _appContext.TypeCdDmts
                               on p.DocumentType equals t.TypeCdDmtId

                              select new AssetRepositoryResposnse
                              {
                                  RepositoryId = p.Id,
                                  AssetId = p.AssetId,
                                  FileName = p.FileName,
                                  FileLocation = p.FileLocation,
                                  FileExtention = p.FileExtention,
                                  DocumentType = p.DocumentType,
                                  FileTypeName = t.Description
                              }).Where(x => x.AssetId == AssetId).ToList();

                var FileRepoBaseUrl = _config.Value.FileRepositoryUrl;

                result.ForEach(f => f.FileLocation = string.Format("{0}/{1}/{2}{3}", FileRepoBaseUrl, f.FileLocation, f.FileName, f.FileExtention));

                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All Repositories Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Repositories Details Found";
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


        public ValueDataResponse<AssetFileRepository> DeleteFileRepository(int RepositoryId)
        {
            ValueDataResponse<AssetFileRepository> response = new ValueDataResponse<AssetFileRepository>();
            try
            {
                var repository = _appContext.AssetFileRepositories.Where(x => x.Id == RepositoryId).FirstOrDefault();

                if (repository != null)
                {
                    _appContext.AssetFileRepositories.Remove(repository);

                    _appContext.SaveChanges();
                }

                if (repository != null)
                {
                    response.Result = repository;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "File Deleted Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No File Found";
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

        public ListDataResponse<AssetLocation> GetAssetsByLocationId(int LocationId)
        {
            ListDataResponse<AssetLocation> response = new ListDataResponse<AssetLocation>();
            try
            {
                var result = _appContext.AssetLocations.Where(x => x.LocationId == LocationId).ToList();

                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = result.Count();
                    response.EndUserMessage = "Get Asstes Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Asstes Details Found";
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


        public ListDataResponse<AssetLocation> GetAssetsBySearch(SearchAsset search)
        {

            ListDataResponse<AssetLocation> response = new ListDataResponse<AssetLocation>();
            try
            {
                var result = _appContext.AssetLocations.Where(x => x.LocationId == search.LocationId &&
                               (x.Name1.ToLower().Contains(search.searchValue.ToLower()) || x.AssetRef.Contains(search.searchValue))).ToList();



                if (result.Count > 0)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = result.Count;
                    response.EndUserMessage = "Get Asset Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Asset Details Found";
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


        public ListDataResponse<AssetLocation> GetAssetsByProject(int projectId, int AstGroupId)
        {
            ListDataResponse<AssetLocation> response = new ListDataResponse<AssetLocation>();
            try
            {
                var result = (from a in _appContext.AssetLocations.Include(x=>x.Location_Id)
                              join x in _appContext.Locations on a.LocationId equals x.Id
                              where x.ProjectId == projectId && a.AstGroupId == AstGroupId
                              select new AssetLocation
                              {
                                  Id = a.Id,
                                  Name1 = a.Name1,
                                  Name2 = a.Name2,
                                  AssetRef = a.AssetRef,
                                  AstCounter= a.AstCounter,
                                  AstFixedDate=a.AstFixedDate,
                                  CreatedBy = a.CreatedBy,
                                  CreatedDate = a.CreatedDate,
                                  UpdatedBy = a.UpdatedBy,
                                  UpdatedDate = a.UpdatedDate,

                              }).Distinct().ToList();

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
    }
}
