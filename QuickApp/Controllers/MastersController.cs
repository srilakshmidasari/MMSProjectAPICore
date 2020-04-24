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
    public class MastersController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public MastersController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet("GetTypecddmtDetails/{ClassTypeId}")]
        public ListDataResponse<TypeCdDmt> GetTypecddmtDetails(int ClassTypeId)
        {
            return _unitOfWork.Masters.GetAllTypeCddmtdetails(ClassTypeId);
        }

        [HttpDelete]
        [Route("DeleteFileRepository/{FileRepositoryId}")]
        public ValueDataResponse<FileRepository> DeleteFileRepository(int FileRepositoryId)
        {
            return _unitOfWork.Masters.DeleteFileRepository(FileRepositoryId);
        }

        [HttpGet("GetAllLookUpDetails")]
        public ListDataResponse<LookupDataResponse> GetAllLookUpDetails()
        {
            return _unitOfWork.Masters.GetAllLookUpDetails();
        }

        [HttpPost("AddLookUpData")]
        public ValueDataResponse<LookUp> AddLookUpData(AddLookUp lookup)
        {
            LookUp LookupDetails = _mapper.Map<LookUp>(lookup);
            return _unitOfWork.Masters.AddLookUpData(LookupDetails);
        }

        [HttpPut("UpdateLookUpData")]
        public ValueDataResponse<LookUp> UpdateLookUpData(AddLookUp lookup)
        {
            LookUp LookupResult = _mapper.Map<LookUp>(lookup);
            return _unitOfWork.Masters.UpdateLookUpData(LookupResult);
        }



        [HttpGet("GetLookUpDetilas/{TypeId}")]
        public ListDataResponse<LookUp> GetLookUpDetilas(int TypeId)
        {
            return _unitOfWork.Masters.GetLookUpDetilas(TypeId);
        }

        [HttpDelete]
        [Route("DeleteLooKUp/{LookupId}")]
        public ValueDataResponse<LookUp> DeleteLooKUp(int LookupId)
        {
            return _unitOfWork.Masters.DeleteLooKUp(LookupId);
        }

        [HttpPost("ExportMaster")]
        public IActionResult ExportMaster(List<LookupDataResponse> res)
        {
            Stream stream = null;
            byte[] fileContents = null;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {
                var iRowCnt = 2;
                using (ExcelPackage excelPackage = new ExcelPackage(stream ?? new MemoryStream()))
                {
                    excelPackage.Workbook.Properties.Title = "LookUp Details";

                    excelPackage.Workbook.Worksheets.Add("LookUp Details");

                    var worksheet = excelPackage.Workbook.Worksheets.First();

                    using (var range = worksheet.Cells["A1:J1"])
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

                    worksheet.Cells[iRowCnt - 1, 1].Value = "Id";
                    worksheet.Cells[iRowCnt - 1, 2].Value = "Category Name";
                    worksheet.Cells[iRowCnt - 1, 3].Value = "Name 1";
                    worksheet.Cells[iRowCnt - 1, 4].Value = "Name 2";
                    worksheet.Cells[iRowCnt - 1, 5].Value = "Remarks";
                    worksheet.Cells[iRowCnt - 1, 6].Value = "Is Active";
                    worksheet.Cells[iRowCnt - 1, 7].Value = "Created By";
                    worksheet.Cells[iRowCnt - 1, 8].Value = "Created Date";
                    worksheet.Cells[iRowCnt - 1, 9].Value = "Updated By";
                    worksheet.Cells[iRowCnt - 1, 10].Value = "Updated Date";

                    int i;
                    for (i = 0; i <= res.Count - 1; i++)
                    {
                        worksheet.Cells[iRowCnt, 1].Value = res[i].Id;
                        worksheet.Cells[iRowCnt, 2].Value = res[i].Description;
                        worksheet.Cells[iRowCnt, 3].Value = res[i].Name1;
                        worksheet.Cells[iRowCnt, 4].Value = res[i].Name2;
                        worksheet.Cells[iRowCnt, 5].Value = res[i].Remarks;
                        worksheet.Cells[iRowCnt, 6].Value = res[i].IsActive;
                        worksheet.Cells[iRowCnt, 7].Value = res[i].CreatedByUser;
                        worksheet.Cells[iRowCnt, 8].Value = res[i].CreatedDate;
                        worksheet.Cells[iRowCnt, 8].Style.Numberformat.Format = @"dd-MM-yyyy";
                        worksheet.Cells[iRowCnt, 9].Value = res[i].UpdatedByUser;
                        worksheet.Cells[iRowCnt, 10].Value = res[i].UpdatedDate;
                        worksheet.Cells[iRowCnt, 10].Style.Numberformat.Format = @"dd-MM-yyyy";

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
