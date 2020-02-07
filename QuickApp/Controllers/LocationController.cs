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
    public class LocationController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public LocationController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ListDataResponse<Location> Get()
        {
            return _unitOfWork.Locations.GetLocationDetails();
        }

        [HttpPost]
        public ValueDataResponse<Location> Insert(AddLocation location)
        {
            Location LocationInfo = _mapper.Map<Location>(location);
            return _unitOfWork.Locations.InsertLocation(LocationInfo);
        }
    }
}