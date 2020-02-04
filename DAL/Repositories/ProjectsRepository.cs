using AutoMapper;
using DAL.Models;
using DAL.Repositories.Interfaces;
using DAL.Response;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

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
        //        var result = _appContext.Projects.to();
        //        var FileRepoBaseUrl = _config.Value.FileRepositoryUrl;

        //        result.ForEach(f => f.FileLocation = string.Format("{0}/{1}/{2}{3}", FileRepoBaseUrl, f.FileLocation, f.FileName, f.FileExtention));

        //        if (result != null)
        //        {
        //            response.ListResult = result;
        //            response.IsSuccess = true;
        //            response.AffectedRecords = 1;
        //            response.EndUserMessage = "Get All Project Details Successfull";
        //        }
        //        else
        //        {
        //            response.IsSuccess = true;
        //            response.AffectedRecords = 0;
        //            response.EndUserMessage = "No Project Details Found";
        //        }
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
