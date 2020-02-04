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
using static DAL.RequestResponseModels.RequestResponseModels;

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
        [Route("DeleteFileRepository/{FileRepositoryId}")]
        public ValueDataResponse<FileRepository> DeleteFileRepository(int FileRepositoryId)
        {
            return _unitOfWork.Masters.DeleteFileRepository(FileRepositoryId);
        }

        [HttpGet("GetAllLookUpDetails")]
        public ListDataResponse<LookUp> GetAllLookUpDetails()
        {
            return _unitOfWork.Masters.GetAllLookUpDetails();
        }

        [HttpPost("AddUpLookUpData")]
        public ValueDataResponse<LookUp> AddLookUpData(AddLookUp lookup)
        {
            LookUp LookupDetails = _mapper.Map<LookUp>(lookup);
            return _unitOfWork.Masters.AddLookUpData(LookupDetails);
        }


    }
}