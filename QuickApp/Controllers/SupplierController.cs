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
    public class SupplierController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public SupplierController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet("GetAllSupplier")]
        public ListDataResponse<Supplier> Get()
        {
            return _unitOfWork.Suppliers.GetAllSupplier();
        }

        [HttpPost("AddSupplierDetials")]
        public ValueDataResponse<Supplier> AddSupplierDetials(Supplier suppliers)
        {
            Supplier SupplierDetails = _mapper.Map<Supplier>(suppliers);
            return _unitOfWork.Suppliers.AddSupplierDetials(SupplierDetails);
        }

    }
}