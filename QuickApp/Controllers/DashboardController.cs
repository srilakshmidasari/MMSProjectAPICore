using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DAL;
using DAL.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace MMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public DashboardController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }


        [HttpPost("GetWorkOrderStatusCount")]
        public ListDataResponse<dynamic> GetWorkOrderStatusCount(Dashboardreq req)
        {
            return _unitOfWork.Dashboard.GetWorkOrderStatusCount(req.ProjectId, req.FromDate, req.ToDate, req.WorkTypeId);
        }

        [HttpPost("GetWorkOrderDashboardCount")]
        public ListDataResponse<dynamic> GetWorkOrderDashboardCount(Dashboardreq req)
        {
            return _unitOfWork.Dashboard.GetWorkOrderDashboardCount(req.ProjectId, req.FromDate, req.ToDate, req.WorkTypeId);
        }

        [HttpPost("GetWorkOrdersByTradeCount")]
        public ListDataResponse<dynamic> GetWorkOrderByTradesCount(TradeOrderreq req)
        {
            return _unitOfWork.Dashboard.GetWorkOrderByTradesCount(req.ProjectId, req.FromDate, req.ToDate, req.WorkTypeId, req.StatusTypeId);
        }
    }
}