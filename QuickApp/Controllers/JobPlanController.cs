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
    public class JobPlanController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public JobPlanController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ListDataResponse<GetJobPlanResponse> GetJobPlans()
        {
            return _unitOfWork.JobPlans.GetJobPlans();
        }

        [HttpPost]
        public ValueDataResponse<JobPlan> AddJobPlan(UpsertJobPlan jobPlans)
        {
            return _unitOfWork.JobPlans.AddJobPlan(jobPlans);
        }

        [HttpPut]
        public ValueDataResponse<JobPlan> UpdateJobPlan(UpsertJobPlan jobPlans)
        {
            return _unitOfWork.JobPlans.UpdateJobPlan(jobPlans);
        }

        [HttpDelete]
        public ValueDataResponse<JobPlan> DeleteJobPlan(int JobPlanId)
        {
            return _unitOfWork.JobPlans.DeleteJobPlan(JobPlanId);
        }

        [HttpGet("GetJobTaskByJobPlanId/{JobPlanId}")]
        public ListDataResponse<GetJobTaskResponse> GetJobTaskByJobPlanId(int JobPlanId)
        {
            return _unitOfWork.JobPlans.GetJobTaskByJobPlanId(JobPlanId);
        }

        [HttpGet("GetJobPlansByProject/{ProjectId}")]
        public ListDataResponse<GetJobPlanResponse> GetJobPlansByProject(int ProjectId)
        {
            return _unitOfWork.JobPlans.GetJobPlansByProject(ProjectId);
        }
    }
}