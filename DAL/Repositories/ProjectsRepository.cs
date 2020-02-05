using AutoMapper;
using DAL.Models;
using DAL.Repositories.Interfaces;
using DAL.Response;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using static DAL.RequestResponseModels.RequestResponseModels;
using System.IO;

namespace DAL.Repositories
{
    public class ProjectsRepository : Repository<dynamic>, IProjectRepository
    {
        public readonly IOptions<AppSettings> _config;
        public ProjectsRepository(ApplicationDbContext context, IMapper mapper, IOptions<AppSettings> configuration) : base(context, mapper, configuration)
        {
            _config = configuration;
        }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
        public ListDataResponse<GetProjectResponse> GetAllProject()
        {
            ListDataResponse<GetProjectResponse> response = new ListDataResponse<GetProjectResponse>();
            try
            {
                var FileRepoBaseUrl = _config.Value.FileRepositoryUrl;

                var result = (from p in _appContext.Projects
                              join s in _appContext.SiteInfos on p.SiteId equals s.Id
                              join lp in _appContext.LookUpProjectXrefs on p.Id equals lp.ProjectId
                              join l in _appContext.LookUps on lp.StoreId equals l.Id
                              select new GetProjectResponse
                              {
                                  Id = p.Id,
                                  Name2 = p.Name1,
                                  Name1 = p.Name1,
                                  ProjectReference = p.ProjectReference,
                                  SiteId = s.Id,
                                  SiteName1 = s.Name1,
                                  SiteName2 = s.Name2,
                                  StoreId = l.Id,
                                  StoreName1 = l.Name1,
                                  StoreName2 = l.Name2,
                                  ProjectDetails = p.ProjectDetails,
                                  IsActive = p.IsActive,
                                  CreatedBy = p.CreatedBy,
                                  CreatedDate = p.CreatedDate,
                                  UpdatedBy = p.UpdatedBy,
                                  UpdatedDate = p.UpdatedDate,

                              }).ToList();

                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All Project Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Project Details Found";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.AffectedRecords = 0;
                response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                response.Exception = ex;
            }

            return response;
        }

        public ValueDataResponse<Project> InsertProject(UpsertProject project)
        {
            ValueDataResponse<Project> response = new ValueDataResponse<Project>();

            try
            {
                Project pro = _mapper.Map<Project>(project);
                 
                var result = _appContext.Projects.Add(pro);
                _appContext.SaveChanges();
                foreach (var req in project.ProjectRepositories)
                {
                    if (req.FileName != null)
                    {
                        string ModuleName = "Project";
                        var now = DateTime.Now;
                        var yearName = now.ToString("yyyy");
                        var monthName = now.Month.ToString("d2");
                        var dayName = now.ToString("dd");

                        FileUploadService repo = new FileUploadService();

                        string FolderLocation = "FileRepository";
                        string ServerRootPath = _config.Value.ServerRootPath;

                        string Location = ServerRootPath + @"\" + FolderLocation + @"\" + yearName + @"\" + monthName + @"\" + dayName + @"\" + ModuleName;

                        byte[] FileBytes = Convert.FromBase64String(req.FileName);

                        req.FileName = repo.UploadFile(FileBytes, req.FileExtention, Location);

                        req.FileLocation = Path.Combine(yearName, monthName, dayName, ModuleName);

                        ProjectRepository pros = new ProjectRepository();
                        {
                            pros.ProjectId = pro.Id;
                            pros.FileName = req.FileName;
                            pros.FileLocation = req.FileLocation;
                            pros.FileExtention = req.FileExtention;
                            pros.DocumentType = req.DocumentTypeId;
                            pros.CreatedBy = req.CreatedBy;
                            pros.CreatedDate = DateTime.Now;
                            pros.UpdatedBy = req.UpdatedBy;
                            pros.UpdatedDate = DateTime.Now;
                        }
                        _appContext.ProjectRepositories.Add(pros);
                    }
                    _appContext.SaveChanges();
                    if (result != null)
                    {
                        response.Result = pro;
                        response.IsSuccess = true;
                        response.AffectedRecords = 1;
                        response.EndUserMessage = "Project Added Successfully";
                    }
                    else
                    {
                        response.IsSuccess = true;
                        response.AffectedRecords = 0;
                        response.EndUserMessage = "Project Added Failed";
                    }
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.AffectedRecords = 0;
                response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                response.Exception = ex;
            }
            return response;
        }
    }
}
