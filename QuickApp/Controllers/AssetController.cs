using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DAL;
using DAL.Models;
using DAL.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using OfficeOpenXml.Style;
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

        //[HttpGet("GetAssetGroupDetilasById")]
        //public ListDataResponse<AssetGroup> Get(int assetId)
        //{
        //    return _unitOfWork.Assets.GetAssetGroupDetilasById(assetId);
        //}

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

        [HttpPost("GetAssetsByProject")]
        public ListDataResponse<AssetLocation> GetAssetsByProject(AssetProjectReq req)
        {
            return _unitOfWork.Assets.GetAssetsByProject(req.ProjectId, req.AstGroupId);
        }

        [HttpPost("ExportAsset")]
        public IActionResult ExportAsset(List<GetAssetLocationResponse> res)
        {
            Stream stream = null;
            byte[] fileContents = null;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {
                var iRowCnt = 2;
                using (ExcelPackage excelPackage = new ExcelPackage(stream ?? new MemoryStream()))
                {
                    excelPackage.Workbook.Properties.Title = "Asset Details";

                    excelPackage.Workbook.Worksheets.Add("Asset Details");

                    var worksheet = excelPackage.Workbook.Worksheets.First();

                    using (var range = worksheet.Cells["A1:S1"])
                    {
                        range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        range.Style.Fill.BackgroundColor.SetColor(Color.Orange);
                        range.Style.Border.Left.Style = ExcelBorderStyle.Thick;
                        range.Style.Border.Left.Color.SetColor(Color.Black);
                        range.Style.Border.Right.Style = ExcelBorderStyle.Thick;
                        range.Style.Border.Right.Color.SetColor(Color.Black);
                        range.Style.Border.Bottom.Style = ExcelBorderStyle.Thick;
                        range.Style.Border.Bottom.Color.SetColor(Color.Black);
                        range.Style.Font.Color.SetColor(Color.Black);
                        range.Style.Font.SetFromFont(new System.Drawing.Font("Calibri", 12));
                        range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        range.Style.Font.Bold = true;
                    }
                    worksheet.Cells[iRowCnt - 1, 1].Value = "AssetId";
                    worksheet.Cells[iRowCnt - 1, 2].Value = "Asset Reference";
                    worksheet.Cells[iRowCnt - 1, 3].Value = "Name 1";
                    worksheet.Cells[iRowCnt - 1, 4].Value = "Name 2";
                    worksheet.Cells[iRowCnt - 1, 5].Value = "Site Name";
                    worksheet.Cells[iRowCnt - 1, 6].Value = "Project Name";
                    worksheet.Cells[iRowCnt - 1, 7].Value = "Location Name";
                    worksheet.Cells[iRowCnt - 1, 8].Value = "Asset Group Name";
                    worksheet.Cells[iRowCnt - 1, 9].Value = "Asset Trade Name";
                    worksheet.Cells[iRowCnt - 1, 10].Value = "Days Applicable";
                    worksheet.Cells[iRowCnt - 1, 11].Value = "Asset Size";
                    worksheet.Cells[iRowCnt - 1, 12].Value = "Asset Capacity";
                    worksheet.Cells[iRowCnt - 1, 13].Value = "Asset Make";
                    worksheet.Cells[iRowCnt - 1, 14].Value = "Asset Type";
                    worksheet.Cells[iRowCnt - 1, 15].Value = "Asset Model";
                    worksheet.Cells[iRowCnt - 1, 16].Value = "Asset FixedDate";
                    worksheet.Cells[iRowCnt - 1, 17].Value = "Is Active";
                    worksheet.Cells[iRowCnt - 1, 18].Value = "Created Date";
                    worksheet.Cells[iRowCnt - 1, 19].Value = "Updated Date";
                    int i;
                    for (i = 0; i <= res.Count - 1; i++)
                    {
                        worksheet.Cells[iRowCnt, 1].Value = res[i].Id;
                        worksheet.Cells[iRowCnt, 2].Value = res[i].AssetLocationRef;
                        worksheet.Cells[iRowCnt, 3].Value = res[i].Name1;
                        worksheet.Cells[iRowCnt, 4].Value = res[i].Name2;
                        worksheet.Cells[iRowCnt, 5].Value = res[i].SiteName1;
                        worksheet.Cells[iRowCnt, 6].Value = res[i].ProjectName1;
                        worksheet.Cells[iRowCnt, 7].Value = res[i].LocationName1;
                        worksheet.Cells[iRowCnt, 8].Value = res[i].AstGroupName1;
                        worksheet.Cells[iRowCnt, 9].Value = res[i].AstTradeName1;
                        worksheet.Cells[iRowCnt, 10].Value = res[i].DaysApplicable;
                        worksheet.Cells[iRowCnt, 11].Value = res[i].AssetSize;
                        worksheet.Cells[iRowCnt, 12].Value = res[i].AssetCapacity;
                        worksheet.Cells[iRowCnt, 13].Value = res[i].AssetMake;
                        worksheet.Cells[iRowCnt, 14].Value = res[i].AssetType;
                        worksheet.Cells[iRowCnt, 15].Value = res[i].AssetModel;
                        worksheet.Cells[iRowCnt, 16].Value = res[i].AstFixedDate;
                        worksheet.Cells[iRowCnt, 16].Style.Numberformat.Format = @"dd-MM-yyyy";
                        worksheet.Cells[iRowCnt, 17].Value = res[i].IsActive;
                        worksheet.Cells[iRowCnt, 18].Value = res[i].CreatedDate;
                        worksheet.Cells[iRowCnt, 18].Style.Numberformat.Format = @"dd-MM-yyyy";
                        worksheet.Cells[iRowCnt, 19].Value = res[i].UpdatedDate;
                        worksheet.Cells[iRowCnt, 19].Style.Numberformat.Format = @"dd-MM-yyyy";

                        iRowCnt = iRowCnt + 1;
                    }
                    fileContents = excelPackage.GetAsByteArray();
                }
            }
            catch (Exception ex)
            {

            }
            return Ok(fileContents);
        }
    }
}