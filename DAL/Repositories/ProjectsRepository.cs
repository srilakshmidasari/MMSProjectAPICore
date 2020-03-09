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
                List<GetProjectResponse> finalResilt = new List<GetProjectResponse>();

                var result = (from p in _appContext.Projects
                              join s in _appContext.SiteInfos on p.SiteId equals s.Id
                              join lp in _appContext.LookUpProjectXrefs on p.Id equals lp.ProjectId into pl
                              from pdata in pl.DefaultIfEmpty()
                              join l in _appContext.LookUps on pdata.StoreId equals l.Id
                              select new GetProjectResponse
                              {
                                  Id = p.Id,
                                  Name1 = p.Name1,
                                  Name2 = p.Name2,

                                  ProjectReference = p.ProjectReference,
                                  SiteId = s.Id,
                                  SiteName1 = s.Name1,
                                  SiteName2 = s.Name2,
                                  StoreId = _appContext.LookUpProjectXrefs.Where(S => S.ProjectId == p.Id).ToList(),
                                  //StoreName1 = l.Name1,
                                  //StoreName2 = l.Name2,
                                  ProjectDetails = p.ProjectDetails,
                                  IsActive = p.IsActive,
                                  CreatedBy = p.CreatedBy,
                                  CreatedDate = p.CreatedDate,
                                  UpdatedBy = p.UpdatedBy,
                                  UpdatedDate = p.UpdatedDate,
                              }).Where(x => x.IsActive == true).ToList();
                foreach (var item in result)
                {
                    var responce = finalResilt.Where(s => s.Id == item.Id).FirstOrDefault();
                    if (responce == null)
                    {
                        finalResilt.Add(item);
                    }

                }

                if (finalResilt != null)

                {
                    response.ListResult = finalResilt;
                    response.IsSuccess = true;
                    response.AffectedRecords = finalResilt.Count();
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

        public ListDataResponse<GetLoopUpResponse> GetStoresByProjectId(int ProjectId)
        {
            ListDataResponse<GetLoopUpResponse> response = new ListDataResponse<GetLoopUpResponse>();
            try
            {
                var result = (from lp in _appContext.LookUpProjectXrefs.Where(x => x.ProjectId == ProjectId).ToList()
                              join l in _appContext.LookUps on lp.StoreId equals l.Id
                              select new GetLoopUpResponse
                              {
                                  Id = l.Id,
                                  Name1 = l.Name1,
                                  Name2 = l.Name2,
                                  LookUpTypeId = l.LookUpTypeId,
                                  Remarks = l.Remarks,
                                  IsActive = l.IsActive,
                                  CreatedBy = l.CreatedBy,
                                  CreatedDate = l.CreatedDate,
                                  UpdatedBy = l.UpdatedBy,
                                  UpdatedDate = l.UpdatedDate,
                              }).ToList();

                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All Store Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Store Details Found";
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
                var projectExists = _appContext.Projects.Where(x => x.ProjectReference == project.ProjectReference).FirstOrDefault();
                if (projectExists == null)
                {
                    Project pro = _mapper.Map<Project>(project);
                    var result = _appContext.Projects.Add(pro);
                    _appContext.SaveChanges();
                    foreach (var sId in project.StoreIds)
                    {
                        _appContext.LookUpProjectXrefs.Add(new LookUpProjectXref { StoreId = sId, ProjectId = pro.Id });
                    }

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
                    }

                    if (pro != null)
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
                else
                {
                    response.IsSuccess = false;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Project Reference is Already Exists";
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

        public ValueDataResponse<Project> UpdateProject(UpsertProject project)
        {
            ValueDataResponse<Project> response = new ValueDataResponse<Project>();

            try
            {
                var projectsExists = _appContext.Projects.Where(x => x.Id != project.Id && x.ProjectReference == project.ProjectReference).FirstOrDefault();

                if (projectsExists == null)
                {
                    Project pro = _mapper.Map<Project>(project);
                    var result = _appContext.Projects.Where(x => x.Id == project.Id).FirstOrDefault();
                    var projectList = _appContext.LookUpProjectXrefs.Where(x => x.ProjectId == project.Id).ToList();
                    _appContext.LookUpProjectXrefs.RemoveRange(projectList);
                    _appContext.SaveChanges();
                    foreach (var sId in project.StoreIds)
                    {
                        _appContext.LookUpProjectXrefs.Add(new LookUpProjectXref { StoreId = sId, ProjectId = pro.Id });
                    }

                    if (result != null)
                    {

                        result.SiteId = project.SiteId;
                        result.ProjectReference = project.ProjectReference;
                        result.Name1 = project.Name1;
                        result.Name2 = project.Name2;
                        result.ProjectDetails = project.ProjectDetails;
                        result.IsActive = project.IsActive;
                        result.CreatedBy = project.CreatedBy;
                        result.CreatedDate = project.CreatedDate;
                        result.UpdatedBy = project.UpdatedBy;
                        result.UpdatedDate = project.UpdatedDate;

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
                        }
                        _appContext.SaveChanges();
                        if (pro != null)
                        {
                            response.Result = pro;
                            response.IsSuccess = true;
                            response.AffectedRecords = 1;
                            response.EndUserMessage = "Project Updated Successfully";
                        }
                        else
                        {
                            response.IsSuccess = true;
                            response.AffectedRecords = 0;
                            response.EndUserMessage = "Project Update Failed";
                        }
                    }
                }
                else
                {
                    response.IsSuccess = false;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Project Reference is Already Exists";
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

        public ValueDataResponse<Project> DeleteProject(int ProjectId)
        {
            ValueDataResponse<Project> response = new ValueDataResponse<Project>();
            try
            {
                var projects = _appContext.Projects.Where(x => x.Id == ProjectId).FirstOrDefault();

                var locations = _appContext.Locations.Where(x => x.ProjectId == ProjectId).ToList();

                if (locations != null)
                {
                    projects.IsActive = false;
                    projects.UpdatedDate = DateTime.Now;
                    //var res = _appContext.ProjectRepositories.Where(x => x.ProjectId == ProjectId).ToList();
                    //_appContext.ProjectRepositories.RemoveRange(res);

                    //var ress = _appContext.LookUpProjectXrefs.Where(x => x.ProjectId == ProjectId).ToList();
                    //_appContext.LookUpProjectXrefs.RemoveRange(ress);

                    //var alocs = _appContext.AssetLocations.Where(x => locations.Select(al => al.Id).Contains(x.LocationId)).ToList();

                    //var assetRepo = _appContext.AssetFileRepositories.Where(x => alocs.Select(ar => ar.Id).Contains(x.AssetId)).ToList();
                    //_appContext.AssetFileRepositories.RemoveRange(assetRepo);
                    //_appContext.AssetLocations.RemoveRange(alocs);
                    //_appContext.Locations.RemoveRange(locations);
                    //_appContext.Projects.RemoveRange(projects);
                    _appContext.SaveChanges();
                }

                if (projects != null)
                {
                    response.Result = projects;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Project Deleted Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Project Found";
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

        public ListDataResponse<ProjectRepositoryResposnse> GetRepositoryByProject(int ProjectId)
        {
            ListDataResponse<ProjectRepositoryResposnse> response = new ListDataResponse<ProjectRepositoryResposnse>();
            try
            {

                var result = (from p in _appContext.ProjectRepositories
                              join t in _appContext.TypeCdDmts
                               on p.DocumentType equals t.TypeCdDmtId

                              select new ProjectRepositoryResposnse
                              {
                                  RepositoryId = p.ProjectRepositoryId,
                                  ProjectId = p.ProjectId,
                                  FileName = p.FileName,
                                  FileLocation = p.FileLocation,
                                  FileExtention = p.FileExtention,
                                  DocumentType = p.DocumentType,
                                  FileTypeName = t.Description
                              }).Where(x => x.ProjectId == ProjectId).ToList();

                var FileRepoBaseUrl = _config.Value.FileRepositoryUrl;

                result.ForEach(f => f.FileLocation = string.Format("{0}/{1}/{2}{3}", FileRepoBaseUrl, f.FileLocation, f.FileName, f.FileExtention));



                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All Repositories Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Repositories Details Found";
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


        public ValueDataResponse<ProjectRepository> DeleteFileRepository(int RepositoryId)
        {
            ValueDataResponse<ProjectRepository> response = new ValueDataResponse<ProjectRepository>();
            try
            {
                var projectRepository = _appContext.ProjectRepositories.Where(x => x.ProjectRepositoryId == RepositoryId).FirstOrDefault();

                if (projectRepository != null)
                {
                    _appContext.ProjectRepositories.Remove(projectRepository);

                    _appContext.SaveChanges();
                }

                if (projectRepository != null)
                {
                    response.Result = projectRepository;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "File Deleted Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No File Found";
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


        public ListDataResponse<Project> GetProjectsBySiteId(int SiteId)
        {
            ListDataResponse<Project> response = new ListDataResponse<Project>();
            try
            {
                var result = _appContext.Projects.Where(x => x.SiteId == SiteId).ToList();

                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = result.Count();
                    response.EndUserMessage = "Get Project Details Successfull";
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

        public ListDataResponse<GetUserProjects> GetProjectsByUserId(string UserId)
        {
            ListDataResponse<GetUserProjects> response = new ListDataResponse<GetUserProjects>();
            try
            {
                var result = (from up in _appContext.UserProjectXrefs.Where(x => x.UserId == UserId).ToList()
                              join p in _appContext.Projects on up.ProjectId equals p.Id
                              select new GetUserProjects
                              {
                                  Id = up.ProjectId,
                                  Name1 = p.Name1,
                                  Name2 = p.Name2,
                                  ProjectReference = p.ProjectReference
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

    }
}
