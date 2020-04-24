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
    public class ProjectController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public ProjectController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ListDataResponse<GetProjectResponse> Get()
        {
            return _unitOfWork.Projects.GetAllProject();
        }

        [HttpGet("GetStoresByProjectId/{ProjectId}")]
        public ListDataResponse<GetLoopUpResponse> GetStoresByProjectId(int ProjectId)
        {
            return _unitOfWork.Projects.GetStoresByProjectId(ProjectId);
        }


        [HttpPost]
        public ValueDataResponse<Project> Insert(UpsertProject project)
        {
           // Project pro = _mapper.Map<Project>(project);
            return _unitOfWork.Projects.InsertProject(project);
        }

        [HttpGet("GetRepositoryByProject/{ProjectId}")]
        public ListDataResponse<ProjectRepositoryResposnse> GetRepositoryByProject(int ProjectId)
        {
            return _unitOfWork.Projects.GetRepositoryByProject(ProjectId);
        }

        [HttpDelete]
        [Route("DeleteProjectRepository/{ProjectRepositoryId}")]
        public ValueDataResponse<ProjectRepository> DeleteFileRepository(int ProjectRepositoryId)
        {
            return _unitOfWork.Projects.DeleteFileRepository(ProjectRepositoryId);
        }

        [HttpPut]
        public ValueDataResponse<Project> Update(UpsertProject project)
        {
            // Project pro = _mapper.Map<Project>(project);

            return _unitOfWork.Projects.UpdateProject(project);
        }

        [HttpDelete]
        public ValueDataResponse<Project> DeleteProject(int ProjectId)
        {
            return _unitOfWork.Projects.DeleteProject(ProjectId);
        }


        [HttpGet("GetProjectsBySiteId/{SiteId}")]
        public ListDataResponse<Project> GetProjectsBySiteId(int SiteId)
        {
            return _unitOfWork.Projects.GetProjectsBySiteId(SiteId);
        }

        [HttpGet("GetProjectsByUserId/{UserId}")]
        public ListDataResponse<GetUserProjects> GetProjectsByUserId(string UserId)
        {
            return _unitOfWork.Projects.GetProjectsByUserId(UserId);
        }

        [HttpPost("GetProjectsByUserIdandSiteId")]
        public ListDataResponse<GetUserProjects> GetProjectsByUserIdandSiteId(GetProjectsByUserIdandSiteIdRequest request)
        {
            return _unitOfWork.Projects.GetProjectsByUserIdandSiteId(request.UserId, request.SiteId);
        }

        [HttpPost("ExportProject")]
        public IActionResult ExportProject(List<GetProjectResponse> res)
        {
            Stream stream = null;
            byte[] fileContents = null;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {
                var iRowCnt = 2;
                using (ExcelPackage excelPackage = new ExcelPackage(stream ?? new MemoryStream()))
                {
                    excelPackage.Workbook.Properties.Title = "Project Details";

                    excelPackage.Workbook.Worksheets.Add("Project Details");

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

                    worksheet.Cells[iRowCnt - 1, 1].Value = "ProjectId";
                    worksheet.Cells[iRowCnt - 1, 2].Value = "Project Reference";
                    worksheet.Cells[iRowCnt - 1, 3].Value = "Name 1";
                    worksheet.Cells[iRowCnt - 1, 4].Value = "Name 2";
                    worksheet.Cells[iRowCnt - 1, 5].Value = "Site Name";
                    worksheet.Cells[iRowCnt - 1, 6].Value = "Project Details";
                    worksheet.Cells[iRowCnt - 1, 7].Value = "Is Active";
                    worksheet.Cells[iRowCnt - 1, 8].Value = "Updated Date";

                    int i;
                    for (i = 0; i <= res.Count - 1; i++)
                    {
                        worksheet.Cells[iRowCnt, 1].Value = res[i].Id;
                        worksheet.Cells[iRowCnt, 2].Value = res[i].ProjectReference;
                        worksheet.Cells[iRowCnt, 3].Value = res[i].Name1;
                        worksheet.Cells[iRowCnt, 4].Value = res[i].Name2;
                        worksheet.Cells[iRowCnt, 5].Value = res[i].SiteName1;
                        worksheet.Cells[iRowCnt, 6].Value = res[i].ProjectDetails;
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