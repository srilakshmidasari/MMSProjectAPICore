using AutoMapper;
using DAL.Models;
using DAL.Repositories.Interfaces;
using DAL.Response;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;

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

        public ListDataResponse<AssetGroup> GetAssetRepositories()
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
    }
}
