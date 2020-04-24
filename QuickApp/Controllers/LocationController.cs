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
    public class LocationController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public LocationController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ListDataResponse<LocationDataResponse> Get()
        {
            return _unitOfWork.Locations.GetLocationDetails();
        }

        [HttpPost]
        public ValueDataResponse<Location> Insert(AddLocation location)
        {
            Location LocationInfo = _mapper.Map<Location>(location);
            return _unitOfWork.Locations.InsertLocation(LocationInfo);
        }

        [HttpPut]
        public ValueDataResponse<Location> Update(AddLocation location)
        {
            Location LocationInfo = _mapper.Map<Location>(location);
            return _unitOfWork.Locations.UpdateLocation(LocationInfo);
        }

        [HttpDelete]
        public ValueDataResponse<Location> Delete(int LocationId)
        {
            return _unitOfWork.Locations.DeleteLocation(LocationId);
        }

        [HttpGet("GetLocationsByProjectId/{ProjectId}")]
        public ListDataResponse<Location> GetLocationsByProjectId(int ProjectId)
        {
            return _unitOfWork.Locations.GetLocationsByProjectId(ProjectId);
        }

        [HttpPost("GetLocationsBySearch")]
        public ListDataResponse<Location> GetLocationsBySearch(SearchString search)
        {
            return _unitOfWork.Locations.GetLocationsBySearch(search);
        }

        [HttpPost("ExportLocation")]
        public IActionResult ExportLocation(List<LocationDataResponse> res)
        {
            Stream stream = null;
            byte[] fileContents = null;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {
                var iRowCnt = 2;
                using (ExcelPackage excelPackage = new ExcelPackage(stream ?? new MemoryStream()))
                {
                    excelPackage.Workbook.Properties.Title = "Location Details";

                    excelPackage.Workbook.Worksheets.Add("Location Details");

                    var worksheet = excelPackage.Workbook.Worksheets.First();

                    using (var range = worksheet.Cells["A1:H1"])
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

                    worksheet.Cells[iRowCnt - 1, 1].Value = "LocationId";
                    worksheet.Cells[iRowCnt - 1, 2].Value = "Location Reference";
                    worksheet.Cells[iRowCnt - 1, 3].Value = "Name 1";
                    worksheet.Cells[iRowCnt - 1, 4].Value = "Name 2";
                    worksheet.Cells[iRowCnt - 1, 5].Value = "Site Name";
                    worksheet.Cells[iRowCnt - 1, 6].Value = "Project Name";
                    worksheet.Cells[iRowCnt - 1, 7].Value = "Is Active";
                    worksheet.Cells[iRowCnt - 1, 8].Value = "Updated Date";

                    int i;
                    for (i = 0; i <= res.Count - 1; i++)
                    {
                        worksheet.Cells[iRowCnt, 1].Value = res[i].Id;
                        worksheet.Cells[iRowCnt, 2].Value = res[i].LocationReference;
                        worksheet.Cells[iRowCnt, 3].Value = res[i].Name1;
                        worksheet.Cells[iRowCnt, 4].Value = res[i].Name2;
                        worksheet.Cells[iRowCnt, 5].Value = res[i].SiteName1;
                        worksheet.Cells[iRowCnt, 6].Value = res[i].ProjectName1;
                        worksheet.Cells[iRowCnt, 7].Value = res[i].IsActive;
                        worksheet.Cells[iRowCnt, 8].Value = res[i].UpdatedDate;
                        worksheet.Cells[iRowCnt, 8].Style.Numberformat.Format = @"dd-MM-yyyy";

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