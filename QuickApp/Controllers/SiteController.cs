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
    public class SiteController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public SiteController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ListDataResponse<Site> Get()
        {
            return _unitOfWork.Sites.GetAllSite();
        }

        [HttpPost]
        public ValueDataResponse<Site> Insert(UpsertSite sites)
        {
            Site siteInfo = _mapper.Map<Site>(sites);
            return _unitOfWork.Sites.InsertEvent(siteInfo);
        }
    }
}