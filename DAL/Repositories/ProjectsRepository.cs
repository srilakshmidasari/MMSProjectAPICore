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
        //public ListDataResponse<Project> GetAllProject()
        //{
        //    ListDataResponse<Project> response = new ListDataResponse<Project>();
        //    try
        //    {

        //        var result = (from p in _appContext.Projects
        //                      join s in _appContext.SiteInfos on p.SiteId equals s.Id
        //                      join l in _appContext.LookUps on p.StoreId equals l.Id
        //                      join pr in _appContext.ProjectRepositories on p.Id equals pr.ProjectId

        //                      select new GetProjectResponse
        //                      {
        //                          Id = p.Id,
        //                          ProjectReference = p.ProjectReference,
        //                          SiteId = s.Id,
        //                          SiteName = s.Name1
        //                      }



        //        //var result = _appContext.Projects.To();
        //        //var FileRepoBaseUrl = _config.Value.FileRepositoryUrl;

        //                      //result.ForEach(f => f.FileLocation = string.Format("{0}/{1}/{2}{3}", FileRepoBaseUrl, f.FileLocation, f.FileName, f.FileExtention));

        //                      //if (result != null)
        //                      //{
        //                      //    response.ListResult = result;
        //                      //    response.IsSuccess = true;
        //                      //    response.AffectedRecords = 1;
        //                      //    response.EndUserMessage = "Get All Project Details Successfull";
        //                      //}
        //                      //else
        //                      //{
        //                      //    response.IsSuccess = true;
        //                      //    response.AffectedRecords = 0;
        //                      //    response.EndUserMessage = "No Project Details Found";
        //                      //}
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.AffectedRecords = 0;
        //        response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
        //        response.Exception = ex;
        //    }

        //    return response;
        //}
    }
}
