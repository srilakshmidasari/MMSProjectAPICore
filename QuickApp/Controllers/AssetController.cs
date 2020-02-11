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
            return _unitOfWork.Assets.GetAssetRepositories();
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

    }
}