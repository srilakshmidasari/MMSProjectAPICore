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
    public class PreventiveMaintenanceController : ControllerBase
    {


        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public PreventiveMaintenanceController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ListDataResponse<GetPreventiveMaintenanceResponse> GetAllPreventiveMaintenances()
        {
            return _unitOfWork.PreventiveMaintenances.GetAllPreventiveMaintenances();
        }

        [HttpPost]
        public ValueDataResponse<PreventiveMaintenance> InsertPreventiveMaintenance(UpsertPreventiveMaintenance PmOrder)
        {
            return _unitOfWork.PreventiveMaintenances.InsertPreventiveMaintenance(PmOrder);
        }

        [HttpPut]
        public ValueDataResponse<PreventiveMaintenance> UpdatePreventiveMaintenance(UpsertPreventiveMaintenance PmOrder)
        {
            return _unitOfWork.PreventiveMaintenances.UpdatePreventiveMaintenance(PmOrder);
        }
    }
}