using AutoMapper;
using DAL.Models;
using DAL.Repositories.Interfaces;
using DAL.Response;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace DAL.Repositories
{
    public class JobPlanRepository : Repository<dynamic>, IJobPlanRepository
    {
        public readonly IOptions<AppSettings> _config;
        public JobPlanRepository(ApplicationDbContext context, IMapper mapper, IOptions<AppSettings> configuration) : base(context, mapper, configuration)
        {
            _config = configuration;
        }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;


        public ListDataResponse<GetJobPlanResponse> GetJobPlans()
        {
            ListDataResponse<GetJobPlanResponse> response = new ListDataResponse<GetJobPlanResponse>();
            try
            {

                var result = (from jp in _appContext.JobPlans
                              join p in _appContext.Projects on jp.ProjectId equals p.Id into pr
                              from ps in pr.DefaultIfEmpty()
                              join s in _appContext.SiteInfos on ps.SiteId equals s.Id into si
                              from so in si.DefaultIfEmpty()
                              join t in _appContext.LookUps on jp.TechnicianId equals t.Id
                              join a in _appContext.LookUps on jp.AssetGroupId equals a.Id
                              join st in _appContext.TypeCdDmts on jp.StatusTypeId equals st.TypeCdDmtId

                              select new GetJobPlanResponse
                              {
                                  Id = jp.Id,
                                  SiteId = jp.SiteId,
                                  SiteName = so.Name1,
                                  ProjectId = jp.ProjectId,
                                  ProjectName = ps.Name1,
                                  Name = jp.Name,
                                  JobReference = jp.JobReference,
                                  JobDescription = jp.JobDescription,
                                  TechnicianId = jp.TechnicianId,
                                  TechinicianName = t.Name1,
                                  Tasks = _appContext.JobTasks.Where(x => x.JobPlanId == jp.Id).ToList(),
                                  Duration = jp.Duration,
                                  AssetGroupId = jp.AssetGroupId,
                                  AssetGroupName = a.Name1,
                                  StatusTypeId = jp.StatusTypeId,
                                  StatusName = st.Description,
                                  CreatedBy = jp.CreatedBy,
                                  CreatedDate = jp.CreatedDate,
                                  UpdatedBy = jp.UpdatedBy,
                                  UpdatedDate = jp.UpdatedDate,
                                  IsActive = jp.IsActive,

                              }).ToList();
                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All JobPlan Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Job Plan Details Found";

                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.AffectedRecords = 0;
                response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                response.Exception = ex;
            }

            return response;
        }

        public ValueDataResponse<JobPlan> AddJobPlan(UpsertJobPlan jobPlans)
        {
            ValueDataResponse<JobPlan> response = new ValueDataResponse<JobPlan>();

            try
            {
                JobPlan job = _mapper.Map<JobPlan>(jobPlans);
                var result = _appContext.JobPlans.Add(job);
                _appContext.SaveChanges();

                foreach (var jtask in jobPlans.JobPlanTasks)
                {
                    _appContext.JobTasks.Add(new JobTask { Id = jtask.Id, JobPlanId = job.Id, Name = jtask.Name, Duration = jtask.Duration, AstTradeId = jtask.AstTradeId });
                }
                _appContext.SaveChanges();

                if (job != null)
                {
                    response.Result = job;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Job Plan Added Successfully";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Job Plan Added Failed";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.AffectedRecords = 0;
                response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                response.Exception = ex;
            }
            return response;
        }

        public ValueDataResponse<JobPlan> UpdateJobPlan(UpsertJobPlan jobPlans)
        {
            ValueDataResponse<JobPlan> response = new ValueDataResponse<JobPlan>();

            try
            {
                JobPlan job = _mapper.Map<JobPlan>(jobPlans);
                var result = _appContext.JobPlans.Where(x => x.Id == job.Id).FirstOrDefault();
                var jobtakss = _appContext.JobTasks.Where(x => x.JobPlanId == job.Id).ToList();
                _appContext.JobTasks.RemoveRange(jobtakss);
                _appContext.SaveChanges();

                foreach (var jtask in jobPlans.JobPlanTasks)
                {
                    _appContext.JobTasks.Add(new JobTask { Id = jtask.Id, JobPlanId = job.Id, Name = jtask.Name, Duration = jtask.Duration, AstTradeId = jtask.AstTradeId });
                }

                if (result != null)
                {
                    result.Name = jobPlans.Name;
                    result.JobDescription = jobPlans.JobDescription;
                    result.JobReference = jobPlans.JobReference;
                    result.Duration = jobPlans.Duration;
                    result.SiteId = jobPlans.SiteId;
                    result.ProjectId = jobPlans.ProjectId;
                    result.TechnicianId = jobPlans.TechnicianId;
                    result.AssetGroupId = jobPlans.AssetGroupId;
                    result.StatusTypeId = jobPlans.StatusTypeId;
                    result.CreatedBy = jobPlans.CreatedBy;
                    result.CreatedDate = jobPlans.CreatedDate;
                    result.UpdatedBy = jobPlans.UpdatedBy;
                    result.UpdatedDate = jobPlans.UpdatedDate;
                    result.IsActive = jobPlans.IsActive;
                }
                _appContext.SaveChanges();

                if (job != null)
                {
                    response.Result = job;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Job Plan Updated Successfully";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Job Plan Updation Failed";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.AffectedRecords = 0;
                response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                response.Exception = ex;
            }
            return response;
        }

        public ListDataResponse<GetJobTaskResponse> GetJobTaskByJobPlanId(int JobPlanId)
        {
            ListDataResponse<GetJobTaskResponse> response = new ListDataResponse<GetJobTaskResponse>();
            try
            {
                var result = (from jp in _appContext.JobTasks
                              join l in _appContext.LookUps on jp.AstTradeId equals l.Id
                              select new GetJobTaskResponse
                              {
                                  Id = jp.Id,
                                  JobPlanId = jp.JobPlanId,
                                  Name=jp.Name,
                                  AstTradeName = l.Name1,
                                  AstTradeId = jp.AstTradeId,
                                  Duration = jp.Duration,
                              }).Where(x=>x.JobPlanId== JobPlanId).ToList();


                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All JobTask Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No JobTask Details Found";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.AffectedRecords = 0;
                response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                response.Exception = ex;
            }

            return response;
        }

        public ValueDataResponse<JobPlan> DeleteJobPlan(int JobPlanId)
        {
            ValueDataResponse<JobPlan> response = new ValueDataResponse<JobPlan>();
            try
            {
                var JobPlanData = _appContext.JobPlans.Where(x => x.Id == JobPlanId).FirstOrDefault();

                if (JobPlanData != null)
                {
                    var jobTasks = _appContext.JobTasks.Where(x => x.JobPlanId == JobPlanId).ToList();

                    var pmPro = _appContext.PreventiveMaintenances.Where(x => x.JobPlanId == JobPlanId).ToList();

                    var res = _appContext.PMAssetXrefs.Where(x => pmPro.Select(p => p.Id).Contains(x.PreventiveMaintenanceId)).ToList();

                    var stspm =_appContext.PMStatusHistories.Where(x=> pmPro.Select(p => p.Id).Contains(x.PreventiveMaintenanceId)).ToList();

                    var work = _appContext.WorkOrders.Where(x=> pmPro.Select(p => p.Id).Contains(x.PMProcedureId.Value)).ToList();

                    var statusData = _appContext.WorkOrderStatusHistories.Where(x => work.Select(p => p.Id).Contains(x.WorkOrderId)).ToList();
                  
                    var ast = _appContext.WorkOrderItemXrefs.Where(x => work.Select(p => p.Id).Contains(x.WorkOrderId)).ToList();

                    _appContext.WorkOrderStatusHistories.RemoveRange(statusData);
                    _appContext.WorkOrderItemXrefs.RemoveRange(ast);
                    _appContext.WorkOrders.RemoveRange(work);
                    _appContext.PMStatusHistories.RemoveRange(stspm);
                    _appContext.PMAssetXrefs.RemoveRange(res);
                    _appContext.PreventiveMaintenances.RemoveRange(pmPro);
                    _appContext.JobTasks.RemoveRange(jobTasks);
                    _appContext.JobPlans.Remove(JobPlanData);

                    _appContext.SaveChanges();
                }

                if (JobPlanData != null)
                {
                    response.Result = JobPlanData;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Job Plan Deleted Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Job Plan Found";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.AffectedRecords = 0;
                response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                response.Exception = ex;
            }

            return response;
        }


        public ListDataResponse<GetJobPlanResponse> GetJobPlansByProject(int ProjectId)
        {
            ListDataResponse<GetJobPlanResponse> response = new ListDataResponse<GetJobPlanResponse>();
            try
            {

                var result = (from jp in _appContext.JobPlans.Where(x => x.ProjectId == ProjectId || x.ProjectId == null).ToList()

                              select new GetJobPlanResponse
                              {
                                  Id = jp.Id,
                                  SiteId = jp.SiteId,
                                  ProjectId = jp.ProjectId,
                                  Name = jp.Name,
                                  JobReference = jp.JobReference,
                                  JobDescription = jp.JobDescription,
                                  TechnicianId = jp.TechnicianId,
                                  Tasks = _appContext.JobTasks.Where(x => x.JobPlanId == jp.Id).ToList(),
                                  Duration = jp.Duration,
                                  AssetGroupId = jp.AssetGroupId,
                                  StatusTypeId = jp.StatusTypeId,
                                  CreatedBy = jp.CreatedBy,
                                  CreatedDate = jp.CreatedDate,
                                  UpdatedBy = jp.UpdatedBy,
                                  UpdatedDate = jp.UpdatedDate,
                                  IsActive = jp.IsActive,

                              }).ToList();
                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All JobPlan Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Job Plan Details Found";

                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.AffectedRecords = 0;
                response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                response.Exception = ex;
            }

            return response;
        }
    }
}
