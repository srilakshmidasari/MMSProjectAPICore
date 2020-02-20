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
    public class PurchaseOrderController : ControllerBase
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public PurchaseOrderController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ListDataResponse<GetPurchageResponse> GetAllPurchases()
        {
            return _unitOfWork.Purchages.GetAllPurchases();
        }

        [HttpPost]
        public ValueDataResponse<PurchageOrder> Insert(UpsertPurchaseOrder purchases)
        {
            // Project pro = _mapper.Map<Project>(project);
            return _unitOfWork.Purchages.InsertPurchaseOrder(purchases);
        }
    }
}