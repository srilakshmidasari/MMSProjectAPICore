using DAL.Models;
using DAL.Response;
using System;
using System.Collections.Generic;
using System.Text;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace DAL.Repositories.Interfaces
{
    public interface IJobPlanRepository
    {
        ListDataResponse<GetJobPlanResponse> GetJobPlans();

        ValueDataResponse<JobPlan> AddJobPlan(UpsertJobPlan jobPlans);

        ValueDataResponse<JobPlan> UpdateJobPlan(UpsertJobPlan jobPlans);

        ListDataResponse<JobTask> GetJobTaskByJobPlanId(int JobPlanId);

        ValueDataResponse<JobPlan> DeleteJobPlan(int JobPlanId);

    }
}


