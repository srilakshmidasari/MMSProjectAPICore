using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DAL;
using DAL.Models;
using DAL.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace MMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssetController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public AssetController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet("GetAllAssetGroup")]
        public ListDataResponse<AssetGroup> Get()

        {
            return _unitOfWork.Assets.GetAssetGroups();
        }

        [HttpPost("AddAssetGroup")]
        public ValueDataResponse<AssetGroup> Insert(UpsertAssetGroup asset)
        {
            AssetGroup assetInfo = _mapper.Map<AssetGroup>(asset);
            return _unitOfWork.Assets.InsertAssetGroup(assetInfo);
        }

        [HttpPut("UpdateAssetGroup")]
        public ValueDataResponse<AssetGroup> Update(UpsertAssetGroup asset)
        {
            AssetGroup assetInfo = _mapper.Map<AssetGroup>(asset);
            return _unitOfWork.Assets.UpdateAssetGroup(assetInfo);
        }

        [HttpDelete("DeleteAssetGroup/{Id}")]
        public ValueDataResponse<AssetGroup> Delete(int Id)
        {
            return _unitOfWork.Assets.DeleteAssetGroup(Id);
        }

        [HttpGet("GetAllAssetLocation")]
        public ListDataResponse<GetAssetLocationResponse> GetAllAssetLocation()
        {
            return _unitOfWork.Assets.GetAssetLocations();
        }

        [HttpPost("AddAssetLocation")]
        public ValueDataResponse<AssetLocation> InsertAssetLocation(UpsertAssetLocation asset)
        {
            
            return _unitOfWork.Assets.InsertAssetLocation(asset);
        }

        [HttpGet("GetAssetGroupDetilasById")]
        public ListDataResponse<AssetGroup> Get(int assetId)
        {
            return _unitOfWork.Assets.GetAssetGroupDetilasById(assetId);
        }

        [HttpPut("UpdateAssetLocation")]
        public ValueDataResponse<AssetLocation> UpdateAssetLocation(UpsertAssetLocation asset)
        {
           // AssetLocation assetInfo = _mapper.Map<AssetLocation>(asset);
            return _unitOfWork.Assets.UpdateAssetLocation(asset);
        }

        [HttpDelete("DeleteAssetLocation/{Id}")]
        public ValueDataResponse<AssetLocation> DeleteAssetLocation(int Id)
        {
            return _unitOfWork.Assets.DeleteAssetLocation(Id);
        }

        [HttpGet("GetRepositoryByAsset/{AssetId}")]
        public ListDataResponse<AssetRepositoryResposnse> GetRepositoryByAsset(int AssetId)
        {
            return _unitOfWork.Assets.GetRepositoryByAsset(AssetId);
        }

        [HttpDelete]
        [Route("DeleteProjectRepository/{RepositoryId}")]
        public ValueDataResponse<AssetFileRepository> DeleteFileRepository(int RepositoryId)
        {
            return _unitOfWork.Assets.DeleteFileRepository(RepositoryId);
        }

        [HttpGet("GetAssetsByLocationId/{LocationId}")]
        public ListDataResponse<AssetLocation> GetAssetsByLocationId(int LocationId)
        {
            return _unitOfWork.Assets.GetAssetsByLocationId(LocationId);
        }

        [HttpPost("GetAssetsBySearch")]
        public ListDataResponse<AssetLocation> GetAssetsBySearch(SearchAsset search)
        {
            return _unitOfWork.Assets.GetAssetsBySearch(search);
        }

    }
}