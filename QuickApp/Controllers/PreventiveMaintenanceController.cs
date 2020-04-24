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
    public class PreventiveMaintenanceController : ControllerBase
    {


        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public PreventiveMaintenanceController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ListDataResponse<GetPreventiveMaintenanceResponse> GetAllPreventiveMaintenances()
        {
            return _unitOfWork.PreventiveMaintenances.GetAllPreventiveMaintenances();
        }

        [HttpGet("GetPMAssetsbyPMId/{Id}")]
        public ListDataResponse<GetPMAssetResponse> GetPMAssetsbyPMId(int Id)
        {
            return _unitOfWork.PreventiveMaintenances.GetPMAssetsbyPMId(Id);
        }

        [HttpPost]
        public ValueDataResponse<PreventiveMaintenance> InsertPreventiveMaintenance(UpsertPreventiveMaintenance PmOrder)
        {
            return _unitOfWork.PreventiveMaintenances.InsertPreventiveMaintenance(PmOrder);
        }

        [HttpPut]
        public ValueDataResponse<PreventiveMaintenance> UpdatePreventiveMaintenance(UpsertPreventiveMaintenance PmOrder)
        {
            return _unitOfWork.PreventiveMaintenances.UpdatePreventiveMaintenance(PmOrder);
        }

        [HttpDelete]
        public ValueDataResponse<PreventiveMaintenance> DeletePreventiveMaintenance(int PmId)
        {
            return _unitOfWork.PreventiveMaintenances.DeletePreventiveMaintenance(PmId);
        }

        [HttpPost("ExportPMProcedure")]
        public IActionResult ExportPMProcedure(List<GetPreventiveMaintenanceResponse> res)
        {
            Stream stream = null;
            byte[] fileContents = null;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {
                var iRowCnt = 2;
                using (ExcelPackage excelPackage = new ExcelPackage(stream ?? new MemoryStream()))
                {
                    excelPackage.Workbook.Properties.Title = "PM Procedure Details";

                    excelPackage.Workbook.Worksheets.Add("PM Procedure Details");

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

                    worksheet.Cells[iRowCnt - 1, 1].Value = "PMId";
                    worksheet.Cells[iRowCnt - 1, 2].Value = "PM Reference";
                    worksheet.Cells[iRowCnt - 1, 3].Value = "Type of Maintenance";
                    worksheet.Cells[iRowCnt - 1, 4].Value = "Duration in Hours";
                    worksheet.Cells[iRowCnt - 1, 5].Value = "Technician Name";
                    worksheet.Cells[iRowCnt - 1, 6].Value = "Status Name";
                    worksheet.Cells[iRowCnt - 1, 7].Value = "Details";
                    worksheet.Cells[iRowCnt - 1, 8].Value = "Is Active";
                    worksheet.Cells[iRowCnt - 1, 9].Value = "Created Date";
                    worksheet.Cells[iRowCnt - 1, 10].Value = "Updated Date";

                    int i;
                    for (i = 0; i <= res.Count - 1; i++)
                    {
                        worksheet.Cells[iRowCnt, 1].Value = res[i].Id;
                        worksheet.Cells[iRowCnt, 2].Value = res[i].PreventiveRefId;
                        worksheet.Cells[iRowCnt, 3].Value = res[i].TypeOfMaintainanceName;
                        worksheet.Cells[iRowCnt, 4].Value = res[i].DurationInHours;
                        worksheet.Cells[iRowCnt, 5].Value = res[i].TechnicianName;
                        worksheet.Cells[iRowCnt, 6].Value = res[i].StatusTypeName;
                        worksheet.Cells[iRowCnt, 7].Value = res[i].Details;
                        worksheet.Cells[iRowCnt, 8].Value = res[i].IsActive;
                        worksheet.Cells[iRowCnt, 9].Value = res[i].CreatedDate;
                        worksheet.Cells[iRowCnt, 9].Style.Numberformat.Format = @"dd-MM-yyyy";
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