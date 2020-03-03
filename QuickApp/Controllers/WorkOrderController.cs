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
    public class WorkOrderController : ControllerBase
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public WorkOrderController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ListDataResponse<GetWorkOrderReponse> GetAllWorkOrders()
        {
            return _unitOfWork.WorkOrders.GetAllWorkOrders();
        }

        [HttpPost]
        public ValueDataResponse<WorkOrder> Insert(UpsertWorkOrder workorders)
        {
            return _unitOfWork.WorkOrders.InsertWorkOrder(workorders);
        }

        [HttpPut]
        public ValueDataResponse<WorkOrder> Update(UpsertWorkOrder workorders)
        {
            return _unitOfWork.WorkOrders.UpdateWorkOrder(workorders);
        }

        [HttpGet("GetItemsByWorkOrderId/{WorkOrderId}")]
        public ListDataResponse<GetWorkItemsResponse> GetItemsByWorkOrderId(int WorkOrderId)
        {
            return _unitOfWork.WorkOrders.GetItemsByWorkOrderId(WorkOrderId);
        }
    }
}