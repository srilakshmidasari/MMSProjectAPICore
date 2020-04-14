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


        [HttpPost("GetWorkOrdersCount")]
        public ValueDataResponse<OrdersCount> GetWorkOrdersCount(OrderReq req)
        {
            return _unitOfWork.Dashboard.GetWorkOrdersCount(req.ProjectId, req.FromDate, req.ToDate);
        }

        [HttpPost("GetWorkOrderDashboardCount")]
        public ValueDataResponse<OrdersTypeCount> GetWorkOrderDashboardCount(Dashboardreq req)
        {
            return _unitOfWork.Dashboard.GetWorkOrderDashboardCount(req.ProjectId, req.FromDate, req.ToDate, req.WorkTypeId);
        }

        [HttpPost("GetWorkOrdersByTradeCount")]
        public ValueDataResponse<TradeOrdersCount> GetWorkOrdersByTradeCount(TradeOrderreq req)
        {
            return _unitOfWork.Dashboard.GetWorkOrdersByTradeCount(req.ProjectId, req.FromDate, req.ToDate, req.WorkTypeId, req.StatusTypeId);
        }
    }
}