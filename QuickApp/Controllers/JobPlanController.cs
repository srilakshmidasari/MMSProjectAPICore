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
    public class JobPlanController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public JobPlanController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ListDataResponse<GetJobPlanResponse> GetJobPlans()
        {
            return _unitOfWork.JobPlans.GetJobPlans();
        }

        [HttpPost]
        public ValueDataResponse<JobPlan> AddJobPlan(UpsertJobPlan jobPlans)
        {
            return _unitOfWork.JobPlans.AddJobPlan(jobPlans);
        }

        [HttpPut]
        public ValueDataResponse<JobPlan> UpdateJobPlan(UpsertJobPlan jobPlans)
        {
            return _unitOfWork.JobPlans.UpdateJobPlan(jobPlans);
        }

        [HttpDelete]
        public ValueDataResponse<JobPlan> DeleteJobPlan(int JobPlanId)
        {
            return _unitOfWork.JobPlans.DeleteJobPlan(JobPlanId);
        }

        [HttpGet("GetJobTaskByJobPlanId/{JobPlanId}")]
        public ListDataResponse<GetJobTaskResponse> GetJobTaskByJobPlanId(int JobPlanId)
        {
            return _unitOfWork.JobPlans.GetJobTaskByJobPlanId(JobPlanId);
        }

        [HttpGet("GetJobPlansByProject/{ProjectId}")]
        public ListDataResponse<GetJobPlanResponse> GetJobPlansByProject(int ProjectId)
        {
            return _unitOfWork.JobPlans.GetJobPlansByProject(ProjectId);
        }

        [HttpPost("ExportJob")]
        public IActionResult ExportJob(List<GetJobPlanResponse> res)
        {
            Stream stream = null;
            byte[] fileContents = null;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {
                var iRowCnt = 2;
                using (ExcelPackage excelPackage = new ExcelPackage(stream ?? new MemoryStream()))
                {
                    excelPackage.Workbook.Properties.Title = "Job Plan Details";

                    excelPackage.Workbook.Worksheets.Add("Job Plan Details");

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

                    worksheet.Cells[iRowCnt - 1, 1].Value = "JobId";
                    worksheet.Cells[iRowCnt - 1, 2].Value = "Job Reference";
                    worksheet.Cells[iRowCnt - 1, 3].Value = "Job Name";
                    worksheet.Cells[iRowCnt - 1, 4].Value = "Job Description";
                    worksheet.Cells[iRowCnt - 1, 5].Value = "Site Name";
                    worksheet.Cells[iRowCnt - 1, 6].Value = "Project Name";
                    worksheet.Cells[iRowCnt - 1, 7].Value = "Technician Name";
                    worksheet.Cells[iRowCnt - 1, 8].Value = "Asset Group Name";
                    worksheet.Cells[iRowCnt - 1, 9].Value = "Duration in Hours";
                    worksheet.Cells[iRowCnt - 1, 10].Value = "Is Active";
                    worksheet.Cells[iRowCnt - 1, 11].Value = "Created Date";
                    worksheet.Cells[iRowCnt - 1, 12].Value = "Updated Date";

                    int i;
                    for (i = 0; i <= res.Count - 1; i++)
                    {
                        worksheet.Cells[iRowCnt, 1].Value = res[i].Id;
                        worksheet.Cells[iRowCnt, 2].Value = res[i].JobReference;
                        worksheet.Cells[iRowCnt, 3].Value = res[i].Name;
                        worksheet.Cells[iRowCnt, 4].Value = res[i].JobDescription;
                        worksheet.Cells[iRowCnt, 5].Value = res[i].SiteName;
                        worksheet.Cells[iRowCnt, 6].Value = res[i].ProjectName;
                        worksheet.Cells[iRowCnt, 7].Value = res[i].TechinicianName;
                        worksheet.Cells[iRowCnt, 8].Value = res[i].AssetGroupName;
                        worksheet.Cells[iRowCnt, 9].Value = res[i].Duration;
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