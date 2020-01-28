using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DAL;
using DAL.Models;
using DAL.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MastersController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public MastersController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet("GetTypecddmtDetails/{ClassTypeId}")]
        public ListDataResponse<TypeCdDmt> GetTypecddmtDetails(int ClassTypeId)
        {
            return _unitOfWork.Masters.GetAllTypeCddmtdetails(ClassTypeId);
        }

        [HttpDelete]
        [Route("DeleteFileRepository")]
        public ValueDataResponse<FileRepository> DeleteFileRepository(int FileRepositoryId)
        {
            return _unitOfWork.Masters.DeleteFileRepository(FileRepositoryId);
        }


    }
}