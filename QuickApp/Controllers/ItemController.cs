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
    public class ItemController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public ItemController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet("GetAllItems")]
        public ListDataResponse<Item> Get()
        {
            return _unitOfWork.Items.GetAllItems();
        }

        [HttpPost("AddItemDetials")]
        public ValueDataResponse<Item> AddItemDetials(UpsertItem items)
        {
            Item ItemDetails = _mapper.Map<Item>(items);
            return _unitOfWork.Items.AddItemDetials(ItemDetails);
        }
    }
}