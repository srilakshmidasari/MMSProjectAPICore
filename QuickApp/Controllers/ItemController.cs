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
    public class ItemController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public ItemController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet("GetAllItems")]
        public ListDataResponse<GetItemResponse> Get()
        {
            return _unitOfWork.Items.GetAllItems();
        }

        [HttpPost("AddItemDetials")]
        public ValueDataResponse<Item> AddItemDetials(UpsertItem items)
        {
            Item ItemDetails = _mapper.Map<Item>(items);
            return _unitOfWork.Items.AddItemDetials(ItemDetails);
        }

        [HttpPut("UpdateItem")]
        public ValueDataResponse<Item> UpdateItem(UpsertItem items)
        {
            Item ItemDetails = _mapper.Map<Item>(items);
            return _unitOfWork.Items.UpdateItem(ItemDetails);
        }

        [HttpDelete("DeleteItem")]
        public ValueDataResponse<Item> DeleteItem(int ItemId)
        {
            return _unitOfWork.Items.DeleteItem(ItemId);
        }

        [HttpPost("ExportItem")]
        public IActionResult ExportItem(List<GetItemResponse> res)
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

                    using (var range = worksheet.Cells["A1:L1"])
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

                    worksheet.Cells[iRowCnt - 1, 1].Value = "ItemId";
                    worksheet.Cells[iRowCnt - 1, 2].Value = "Item Reference";
                    worksheet.Cells[iRowCnt - 1, 3].Value = "Category Name";
                    worksheet.Cells[iRowCnt - 1, 4].Value = "Item Type";
                    worksheet.Cells[iRowCnt - 1, 5].Value = "Name 1";
                    worksheet.Cells[iRowCnt - 1, 6].Value = "Name 2";
                    worksheet.Cells[iRowCnt - 1, 7].Value = "Item Description";
                    worksheet.Cells[iRowCnt - 1, 8].Value = "UOM";
                    worksheet.Cells[iRowCnt - 1, 9].Value = "Average Cost";
                    worksheet.Cells[iRowCnt - 1, 10].Value = "Is Active";
                    worksheet.Cells[iRowCnt - 1, 11].Value = "Created Date";
                    worksheet.Cells[iRowCnt - 1, 12].Value = "Updated Date";

                    int i;
                    for (i = 0; i <= res.Count - 1; i++)
                    {
                        worksheet.Cells[iRowCnt, 1].Value = res[i].Id;
                        worksheet.Cells[iRowCnt, 2].Value = res[i].ItemReference;
                        worksheet.Cells[iRowCnt, 3].Value = res[i].ItemCategory;
                        worksheet.Cells[iRowCnt, 4].Value = res[i].ItemTypeName;
                        worksheet.Cells[iRowCnt, 5].Value = res[i].Name1;
                        worksheet.Cells[iRowCnt, 6].Value = res[i].Name2;
                        worksheet.Cells[iRowCnt, 7].Value = res[i].Description;
                        worksheet.Cells[iRowCnt, 8].Value = res[i].UOMName;
                        worksheet.Cells[iRowCnt, 9].Value = res[i].AverageCost;
                        worksheet.Cells[iRowCnt, 10].Value = res[i].IsActive;
                        worksheet.Cells[iRowCnt, 11].Value = res[i].CreatedDate;
                        worksheet.Cells[iRowCnt, 11].Style.Numberformat.Format = @"dd-MM-yyyy";
                        worksheet.Cells[iRowCnt, 12].Value = res[i].UpdatedDate;
                        worksheet.Cells[iRowCnt, 12].Style.Numberformat.Format = @"dd-MM-yyyy";

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