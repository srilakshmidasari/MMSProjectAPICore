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
            return _unitOfWork.Purchages.InsertPurchaseOrder(purchases);
        }

        [HttpPut]
        public ValueDataResponse<PurchageOrder> Update(UpsertPurchaseOrder purchases)
        {
            return _unitOfWork.Purchages.UpdatePurchaseOrder(purchases);
        }

        [HttpDelete]
        public ValueDataResponse<PurchageOrder> DeleteProject(int PurchaseId)
        {
            return _unitOfWork.Purchages.DeletePurchaseOrder(PurchaseId);
        }

        [HttpGet("GetItemsByPurchaseId/{PurchaseId}")]
        public ListDataResponse<GetItemsResponse> GetItemsByPurchaseId(int PurchaseId)
        {
            return _unitOfWork.Purchages.GetItemsByPurchaseId(PurchaseId);
        }
    }
}