using AutoMapper;
using DAL.Models;
using DAL.Repositories.Interfaces;
using DAL.Response;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace DAL.Repositories
{
  public  class SupplierRepository:Repository<dynamic>,ISupplierRepository
    {
        public readonly IOptions<AppSettings> _config;
        public SupplierRepository(ApplicationDbContext context, IMapper mapper, IOptions<AppSettings> configuration) : base(context, mapper, configuration)
        {
            _config = configuration;
        }
        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public ListDataResponse<Supplier> GetAllSupplier()
        {
            ListDataResponse<Supplier> response = new ListDataResponse<Supplier>();
            try
            {
                var result = _appContext.Suppliers.ToList();
                var FileRepoBaseUrl = _config.Value.FileRepositoryUrl;

                result.ForEach(f => f.FileLocation = string.Format("{0}/{1}/{2}{3}", FileRepoBaseUrl, f.FileLocation, f.FileName, f.FileExtention));

                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All Supplier Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Supplier Details Found";
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

        public ValueDataResponse<Supplier> AddSupplierDetials(Supplier suppliers)
        {
            ValueDataResponse<Supplier> response = new ValueDataResponse<Supplier>();


            try
            {
                    var result = _appContext.Suppliers.Add(suppliers);

                    if (suppliers.FileName != null)
                    {
                        string ModuleName = "Supplier";
                        var now = DateTime.Now;
                        var yearName = now.ToString("yyyy");
                        var monthName = now.Month.ToString("d2");
                        var dayName = now.ToString("dd");

                        FileUploadService repo = new FileUploadService();

                        //string FolderLocation = _config.Value.FileRepositoryFolder;
                        string FolderLocation = "FileRepository";
                        string ServerRootPath = _config.Value.ServerRootPath;

                        string Location = ServerRootPath + @"\" + FolderLocation + @"\" + yearName + @"\" + monthName + @"\" + dayName + @"\" + ModuleName;

                        byte[] FileBytes = Convert.FromBase64String(suppliers.FileName);

                        suppliers.FileName = repo.UploadFile(FileBytes, suppliers.FileExtention, Location);

                        suppliers.FileLocation = Path.Combine(yearName, monthName, dayName, ModuleName);
                    }
                    _appContext.SaveChanges();

                    if (result != null)
                    {
                        response.Result = suppliers;
                        response.IsSuccess = true;
                        response.AffectedRecords = 1;
                        response.EndUserMessage = "Supplier Added Successfully";
                    }
                    else
                    {
                        response.IsSuccess = true;
                        response.AffectedRecords = 0;
                        response.EndUserMessage = "Supplier Added Failed";
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
