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
    public class PurchaseOrderController : ControllerBase
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public PurchaseOrderController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ListDataResponse<GetPurchageResponse> GetAllPurchases()
        {
            return _unitOfWork.Purchages.GetAllPurchases();
        }

        [HttpPost]
        public ValueDataResponse<string> Insert(UpsertPurchaseOrder purchases)
        {
            return _unitOfWork.Purchages.InsertPurchaseOrder(purchases);
        }

        [HttpPut]
        public ValueDataResponse<string> Update(UpsertPurchaseOrder purchases)
        {
            return _unitOfWork.Purchages.UpdatePurchaseOrder(purchases);
        }

        [HttpDelete]
        public ValueDataResponse<PurchageOrder> DeleteProject(int PurchaseId)
        {
            return _unitOfWork.Purchages.DeletePurchaseOrder(PurchaseId);
        }

        [HttpGet("GetItemsByPurchaseId/{PurchaseId}")]
        public ListDataResponse<GetItemsResponse> GetItemsByPurchaseId(int PurchaseId)
        {
            return _unitOfWork.Purchages.GetItemsByPurchaseId(PurchaseId);
        }

        [HttpGet("AcceptOrder/{PurchaseId}")]
        public ValueDataResponse<PurchageOrder> AcceptOrder(int PurchaseId)
        {
            return _unitOfWork.Purchages.AcceptOrder(PurchaseId);
        }

        [HttpGet("RejectOrder/{PurchaseId}")]
        public ValueDataResponse<PurchageOrder> RejectOrder(int PurchaseId)
        {
            return _unitOfWork.Purchages.RejectOrder(PurchaseId);
        }


        [HttpPost("UpdateInventory")]
        public ValueDataResponse<List<Inventory>> UpdateInventory(List<UpsertInventory> inventory)
        {
            List<Inventory> inventoryInfo =  _mapper.Map<List<Inventory>>(inventory);
            
            return _unitOfWork.Purchages.UpdateInventory(inventoryInfo);
        }

        [HttpGet("GetAllInventories")]
        public ListDataResponse<GetInventoryItemsResponse> GetAllInventories()
        {
            return _unitOfWork.Purchages.GetAllInventories();
        }

        [HttpPost("ExportPurchaseOrders")]
        public IActionResult ExportPurchaseOrders(List<GetPurchageResponse> res)
        {
            Stream stream = null;
            byte[] fileContents = null;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

          

            try
            {
                var iRowCnt = 2;
                using (ExcelPackage excelPackage = new ExcelPackage(stream ?? new MemoryStream()))
                {
                    excelPackage.Workbook.Properties.Title = "Purchase Order Details";


                    excelPackage.Workbook.Worksheets.Add("Purchase Order Details");
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
                    worksheet.Cells[iRowCnt - 1, 1].Value = "PurchaseId";
                    worksheet.Cells[iRowCnt - 1, 2].Value = "Purchase Reference";
                    worksheet.Cells[iRowCnt - 1, 3].Value = "Supplier Name";
                    worksheet.Cells[iRowCnt - 1, 4].Value = "Supplier Address";
                    worksheet.Cells[iRowCnt - 1, 5].Value = "Project Name";
                    worksheet.Cells[iRowCnt - 1, 6].Value = "Store Name";
                    worksheet.Cells[iRowCnt - 1, 7].Value = "Arriving Date";
                    worksheet.Cells[iRowCnt - 1, 8].Value = "Status Name";
                    worksheet.Cells[iRowCnt - 1, 9].Value = "Remarks";
                    worksheet.Cells[iRowCnt - 1, 10].Value = "Is Active";
                    worksheet.Cells[iRowCnt - 1, 11].Value = "Created Date";
                    worksheet.Cells[iRowCnt - 1, 12].Value = "Updated Date";

                    int i;
                    for (i = 0; i <= res.Count - 1; i++)
                    {
                        worksheet.Cells[iRowCnt, 1].Value = res[i].Id;
                        worksheet.Cells[iRowCnt, 2].Value = res[i].PurchaseReference;
                        worksheet.Cells[iRowCnt, 3].Value = res[i].SupplierName;
                        worksheet.Cells[iRowCnt, 4].Value = res[i].SupplierAddress;
                        worksheet.Cells[iRowCnt, 5].Value = res[i].ProjectName;
                        worksheet.Cells[iRowCnt, 6].Value = res[i].StoreName;
                        worksheet.Cells[iRowCnt, 7].Value = res[i].ArrivingDate;
                        worksheet.Cells[iRowCnt, 7].Style.Numberformat.Format = @"dd-MM-yyyy";
                        worksheet.Cells[iRowCnt, 8].Value = res[i].StatusName;
                        worksheet.Cells[iRowCnt, 9].Value = res[i].Remarks;
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

        [HttpPost("ExportInventory")]
        public IActionResult ExportInventory(List<GetInventoryItemsResponse> res)
        {
            Stream stream = null;
            byte[] fileContents = null;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {
                var iRowCnt = 2;
                using (ExcelPackage excelPackage = new ExcelPackage(stream ?? new MemoryStream()))
                {
                    excelPackage.Workbook.Properties.Title = "Inventory Details";

                    excelPackage.Workbook.Worksheets.Add("Inventory Details");

                    var worksheet = excelPackage.Workbook.Worksheets.First();

                    using (var range = worksheet.Cells["A1:E1"])
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
                    worksheet.Cells[iRowCnt - 1, 2].Value = "Item Name";
                    worksheet.Cells[iRowCnt - 1, 3].Value = "Quantity";
                    worksheet.Cells[iRowCnt - 1, 4].Value = "Store Name";
                    worksheet.Cells[iRowCnt - 1, 5].Value = "Project Name";
                   

                    int i;
                    for (i = 0; i <= res.Count - 1; i++)
                    {
                        worksheet.Cells[iRowCnt, 1].Value = res[i].ItemId;
                        worksheet.Cells[iRowCnt, 2].Value = res[i].ItemName;
                        worksheet.Cells[iRowCnt, 3].Value = res[i].Quantity;
                        worksheet.Cells[iRowCnt, 4].Value = res[i].StoreName;
                        worksheet.Cells[iRowCnt, 5].Value = res[i].ProjectName;

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