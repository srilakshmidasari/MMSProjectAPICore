using AutoMapper;
using DAL.Models;
using DAL.Repositories.Interfaces;
using DAL.Response;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.IO;

namespace DAL.Repositories
{
    public class SiteRepository : Repository<Site>, ISiteRepository
    {
        public readonly IOptions<AppSettings> _config;
        public SiteRepository(ApplicationDbContext context, IMapper mapper, IOptions<AppSettings> configuration) : base(context, mapper, configuration)
        {
            _config = configuration;
        }
        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public ListDataResponse<Site> GetAllSite()
        {
            ListDataResponse<Site> response = new ListDataResponse<Site>();
            try
            {
                var result = _appContext.Sites.ToList();
                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All Site Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Site Details Found";
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

        public ValueDataResponse<Site> InsertSite(Site sites)
        {
            ValueDataResponse<Site> response = new ValueDataResponse<Site>();

            try
            {
                var result = _appContext.Sites.Add(sites);
                if (sites.FileName != null)
                {
                    string ModuleName = "Site";
                    var now = DateTime.Now;
                    var yearName = now.ToString("yyyy");
                    var monthName = now.Month.ToString("d2");
                    var dayName = now.ToString("dd");

                    FileUploadService repo = new FileUploadService();

                    string FolderLocation = _config.Value.FileRepositoryFolder;
                    string ServerRootPath = _config.Value.ServerRootPath;

                    string Location = ServerRootPath + @"\" + FolderLocation + @"\" + yearName + @"\" + monthName + @"\" + dayName + @"\" + ModuleName; 

                    byte[] FileBytes = Convert.FromBase64String(sites.FileName);

                    sites.FileName = repo.UploadFile(FileBytes, sites.FileExtention, Location);

                    sites.FileLocation = Path.Combine(yearName, monthName, dayName, ModuleName);
                }
                _appContext.SaveChanges();

                if (result != null)
                {
                    response.Result = sites;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Site Added Successfully";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Site Added Failed";
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
