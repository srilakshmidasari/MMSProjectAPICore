using AutoMapper;
using DAL.Models;
using DAL.Repositories.Interfaces;
using DAL.Response;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DAL.Repositories
{
    public class MasterRepository: Repository<dynamic>, IMasterRepository
    {
        public readonly IOptions<AppSettings> _config;
    public MasterRepository(ApplicationDbContext context, IMapper mapper, IOptions<AppSettings> configuration) : base(context, mapper, configuration)
    {
        _config = configuration;
    }
    private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

    public ListDataResponse<TypeCdDmt> GetAllTypeCddmtdetails( int ClassTypeId)
    {
        ListDataResponse<TypeCdDmt> response = new ListDataResponse<TypeCdDmt>();
        try
        {
            var result = _appContext.TypeCdDmts.Where(x=>x.ClassTypeId == ClassTypeId).ToList();
            if (result != null)
            {
                response.ListResult = result;
                response.IsSuccess = true;
                response.AffectedRecords = 1;
                response.EndUserMessage = "Get All Typecddmt Details Successfull";
            }
            else
            {
                response.IsSuccess = true;
                response.AffectedRecords = 0;
                response.EndUserMessage = "No Typecddmt Details Found";
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

        public ValueDataResponse<FileRepository> DeleteFileRepository(int FileRepositoryId)
        {
            ValueDataResponse<FileRepository> response = new ValueDataResponse<FileRepository>();
            try
            {
                var fileRepository = _appContext.FileRepositories.Where(x => x.RepositoryId == FileRepositoryId).FirstOrDefault();
                if (fileRepository != null)
                {
                    _appContext.FileRepositories.Remove(fileRepository);

                    _appContext.SaveChanges();
                }

                if (fileRepository != null)
                {
                    response.Result = fileRepository;
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

    }
}

