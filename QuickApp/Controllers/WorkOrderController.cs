using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net.Http;
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
    public class WorkOrderController : ControllerBase
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public WorkOrderController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ListDataResponse<GetWorkOrderReponse> GetAllWorkOrders()
        {
            return _unitOfWork.WorkOrders.GetAllWorkOrders();
        }

        [HttpPost]
        public ValueDataResponse<WorkOrder> Insert(UpsertWorkOrder workorders)
        {
            return _unitOfWork.WorkOrders.InsertWorkOrder(workorders);
        }

        [HttpPut]
        public ValueDataResponse<WorkOrder> Update(UpsertWorkOrder workorders)
        {
            return _unitOfWork.WorkOrders.UpdateWorkOrder(workorders);
        }

        [HttpGet("GetItemsByWorkOrderId/{WorkOrderId}")]
        public ListDataResponse<GetWorkItemsResponse> GetItemsByWorkOrderId(int WorkOrderId)
        {
            return _unitOfWork.WorkOrders.GetItemsByWorkOrderId(WorkOrderId);
        }

        [HttpDelete]
        public ValueDataResponse<WorkOrder> DeleteWorkOrder(int WorkOrderId)
        {
            return _unitOfWork.WorkOrders.DeleteWorkOrder(WorkOrderId);
        }


        [HttpPost("AcceptWorkOrder")]
        public ValueDataResponse<WorkOrder> AcceptWorkOrder(AcceptWorkOrderRequest request)
        {
            return _unitOfWork.WorkOrders.AcceptWorkOrder(request.WorkOrderId, request.StatusTypeId);
        }

        [HttpPost("RejectWorkOrder")]
        public ValueDataResponse<WorkOrder> RejectWorkOrder(AcceptWorkOrderRequest request)
        {
            return _unitOfWork.WorkOrders.RejectWorkOrder(request.WorkOrderId, request.StatusTypeId);
        }

        [HttpPost("CloseWorkOrder")]
        public ValueDataResponse<WorkOrder> CloseWorkOrder(CloseWorkOrderRequest request)
        {
            return _unitOfWork.WorkOrders.CloseWorkOrder(request.WorkOrderId, request.StatusTypeId,request.Comments);
        }


        [HttpGet("GetPMOrders")]
        public ListDataResponse<GetWorkOrderReponse> GetPMOrders()
        {
            return _unitOfWork.WorkOrders.GetPMOrders();
        }

        [HttpPost("AddPMOrder")]
        public ValueDataResponse<List<UpsertWorkOrder>> InsertPMOrder(List<UpsertWorkOrder> workorder)
        {
            return _unitOfWork.WorkOrders.InsertPMOrder(workorder);
        }



        [HttpPost("ExportWorkOrders")]
        public IActionResult ExportWorkOrders(List<GetWorkOrderReponse> res)
        {
            Stream stream = null;
            byte[] fileContents = null;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

          //   excelPackage = new ExcelPackage();

            try
            {
                var iRowCnt = 2;
                using (ExcelPackage excelPackage = new ExcelPackage(stream ?? new MemoryStream()))
                {
                    excelPackage.Workbook.Properties.Title = "Work Order Details";

                
                    excelPackage.Workbook.Worksheets.Add("Work Order Details");
                    var worksheet = excelPackage.Workbook.Worksheets.First();
                    using (var range = worksheet.Cells["A1:N1"])
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
                    worksheet.Cells[iRowCnt - 1, 1].Value = "Reference 1";
                    worksheet.Cells[iRowCnt - 1, 2].Value = "Start Date";
                    worksheet.Cells[iRowCnt - 1, 3].Value = "End Date";
                    worksheet.Cells[iRowCnt - 1, 4].Value = "Asset Name";
                    worksheet.Cells[iRowCnt - 1, 5].Value = "Location Name";
                    worksheet.Cells[iRowCnt - 1, 6].Value = "Project Name";
                    worksheet.Cells[iRowCnt - 1, 7].Value = "Site Name";
                    worksheet.Cells[iRowCnt - 1, 8].Value = "Store Name";
                    worksheet.Cells[iRowCnt - 1, 9].Value = "Issue";
                    worksheet.Cells[iRowCnt - 1, 10].Value = "Resolution";
                    worksheet.Cells[iRowCnt - 1, 11].Value = "Work Type Name";
                    worksheet.Cells[iRowCnt - 1, 12].Value = "Work Status Name";
                    worksheet.Cells[iRowCnt - 1, 13].Value = "Work Fault Name";
                    worksheet.Cells[iRowCnt - 1, 14].Value = "Work Technician Name";

                    int i;
                    for (i = 0; i <= res.Count - 1; i++)
                    {
                        worksheet.Cells[iRowCnt, 1].Value = res[i].Reference1;
                        worksheet.Cells[iRowCnt, 2].Value = res[i].StartDate;
                        worksheet.Cells[iRowCnt, 2].Style.Numberformat.Format = @"MM-dd-yyyy";
                        worksheet.Cells[iRowCnt, 3].Value = res[i].EndDate;
                        worksheet.Cells[iRowCnt, 3].Style.Numberformat.Format = @"MM-dd-yyyy";
                        worksheet.Cells[iRowCnt, 4].Value = res[i].AssetName;
                        worksheet.Cells[iRowCnt, 5].Value = res[i].LocationName;
                        worksheet.Cells[iRowCnt, 6].Value = res[i].ProjectName;
                        worksheet.Cells[iRowCnt, 7].Value = res[i].SiteName;
                        worksheet.Cells[iRowCnt, 8].Value = res[i].StoreName;
                        worksheet.Cells[iRowCnt, 9].Value = res[i].Issue;
                        worksheet.Cells[iRowCnt, 10].Value = res[i].Resolution;
                        worksheet.Cells[iRowCnt, 11].Value = res[i].WorkTypeName;
                        worksheet.Cells[iRowCnt, 12].Value = res[i].WorkStatusName; 
                        worksheet.Cells[iRowCnt, 13].Value = res[i].WorkFaultName;
                        worksheet.Cells[iRowCnt, 14].Value = res[i].WorkTechnicianName;
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

        [HttpPost("ExportPMOrders")]
        public IActionResult ExportPMOrders(List<GetWorkOrderReponse> res)
        {
            Stream stream = null;
            byte[] fileContents = null;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            //   excelPackage = new ExcelPackage();
            try
            {
                var iRowCnt = 2;
                using (ExcelPackage excelPackage = new ExcelPackage(stream ?? new MemoryStream()))
                {
                    excelPackage.Workbook.Properties.Title = "PM Order Details";


                    excelPackage.Workbook.Worksheets.Add("PM Order Details");
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
                    worksheet.Cells[iRowCnt - 1, 1].Value = "PMOrderId";
                    worksheet.Cells[iRowCnt - 1, 2].Value = "Reference";
                    worksheet.Cells[iRowCnt - 1, 3].Value = "Start Date";
                    worksheet.Cells[iRowCnt - 1, 4].Value = "End Date";
                    worksheet.Cells[iRowCnt - 1, 5].Value = "PMProcedure Name";

                    worksheet.Cells[iRowCnt - 1, 6].Value = "Asset Name";
                    worksheet.Cells[iRowCnt - 1, 7].Value = "Status Name";
                    worksheet.Cells[iRowCnt - 1, 8].Value = "Issue";
                    worksheet.Cells[iRowCnt - 1, 9].Value = "Resolution";
                    worksheet.Cells[iRowCnt - 1, 10].Value = "Work Type Name";

                    worksheet.Cells[iRowCnt - 1, 11].Value = "Work Status Name";
                    worksheet.Cells[iRowCnt - 1, 12].Value = "Work Technician Name";

                    int i;
                    for (i = 0; i <= res.Count - 1; i++)
                    {
                        worksheet.Cells[iRowCnt, 1].Value = res[i].Id;
                        worksheet.Cells[iRowCnt, 2].Value = res[i].Reference1;
                        worksheet.Cells[iRowCnt, 3].Value = res[i].StartDate;
                        worksheet.Cells[iRowCnt, 3].Style.Numberformat.Format = @"MM-dd-yyyy";
                        worksheet.Cells[iRowCnt, 4].Value = res[i].EndDate;
                        worksheet.Cells[iRowCnt, 4].Style.Numberformat.Format = @"MM-dd-yyyy";
                        worksheet.Cells[iRowCnt, 5].Value = res[i].PMProcedureName;

                        worksheet.Cells[iRowCnt, 6].Value = res[i].AssetName;
                        worksheet.Cells[iRowCnt, 7].Value = res[i].StatusTypeName;
                        worksheet.Cells[iRowCnt, 8].Value = res[i].Issue;
                        worksheet.Cells[iRowCnt, 9].Value = res[i].Resolution;
                       
                        worksheet.Cells[iRowCnt, 10].Value = res[i].WorkTypeName;
                        worksheet.Cells[iRowCnt, 11].Value = res[i].WorkStatusName;
                        worksheet.Cells[iRowCnt, 12].Value = res[i].WorkFaultName;
                       
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