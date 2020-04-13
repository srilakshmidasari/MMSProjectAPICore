using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using DAL.Repositories.Interfaces;
using Microsoft.Extensions.Options;
using AutoMapper;
using static DAL.RequestResponseModels.RequestResponseModels;
using DAL.Response;
using DAL.Models;

namespace DAL.Repositories
{
    public class PreventiveMaintenanceRepository : Repository<dynamic>, IPreventiveMaintenanceRepository
    {

        public readonly IOptions<AppSettings> _config;
        public PreventiveMaintenanceRepository(ApplicationDbContext context, IMapper mapper, IOptions<AppSettings> configuration) : base(context, mapper, configuration)
        {
            _config = configuration;
        }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public ListDataResponse<GetPreventiveMaintenanceResponse> GetAllPreventiveMaintenances()
        {
            ListDataResponse<GetPreventiveMaintenanceResponse> response = new ListDataResponse<GetPreventiveMaintenanceResponse> ();
            try
            {
                var result = (from pm in _appContext.PreventiveMaintenances                            
                              join wt in _appContext.LookUps on pm.WorkTechnicianId equals wt.Id
                              join sta in _appContext.TypeCdDmts on pm.StatusTypeId equals sta.TypeCdDmtId
                              join ty in _appContext.TypeCdDmts on pm.TypeOfMaintenance equals ty.TypeCdDmtId
                              select new GetPreventiveMaintenanceResponse
                              {
                                  Id = pm.Id,
                                  PreventiveRefId =pm.PreventiveRefId,
                                  StartDate = pm.StartDate,
                                  DurationInHours = pm.DurationinHours,
                                  DaysApplicable =pm.DaysApplicable,
                                  Details = pm.Details,
                                  JobPlanId= pm.JobPlanId,
                                  Priority=pm.Priority,
                                  AssetId = _appContext.PMAssetXrefs.Where(S => S.PreventiveMaintenanceId == pm.Id).ToList(),
                                  TechnicianId = pm.WorkTechnicianId,
                                  TechnicianName = wt.Name1,
                                  TypeOfMaintainanceId = pm.TypeOfMaintenance,
                                  TypeOfMaintainanceName = ty.Description,
                                  StatusTypeId = pm.StatusTypeId,
                                  StatusTypeName = sta.Description,
                                  IsActive = pm.IsActive,
                                  CreatedBy = pm.CreatedBy,
                                  CreatedDate = pm.CreatedDate,
                                  UpdatedBy = pm.UpdatedBy,
                                  UpdatedDate = pm.UpdatedDate

                              }).ToList();

                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All Preventive Maintenances Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Preventive Maintenances Found";
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

        public ListDataResponse<GetPMAssetResponse> GetPMAssetsbyPMId(int Id)
        {
            ListDataResponse<GetPMAssetResponse> response = new ListDataResponse<GetPMAssetResponse>();
            try
            {
                var result = (from pma in _appContext.PMAssetXrefs.Where(x => x.PreventiveMaintenanceId == Id).ToList()
                              join pm in _appContext.PreventiveMaintenances on pma.PreventiveMaintenanceId equals pm.Id
                              join a in _appContext.AssetLocations on pma.AssetId equals a.Id
                              join l in _appContext.Locations on a.LocationId equals l.Id
                              join p in _appContext.Projects on l.ProjectId equals p.Id
                              join s in _appContext.SiteInfos on p.SiteId equals s.Id

                              select new GetPMAssetResponse
                              {
                                  AssetId = pma.AssetId,
                                  AssetReference = a.AssetRef,
                                  AssetFixedDate = a.AstFixedDate,
                                  AssetName = a.Name1,
                                  LocationId = a.LocationId,
                                  LocationName = l.Name1,
                                  ProjectId = l.ProjectId,
                                  ProjectName = p.Name1,
                                  SiteId = p.SiteId,
                                  SiteName = s.Name1,
                                  DaysApplicable = pma.DaysApplicable,

                              }).ToList();

                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All Assets Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Assets Found";
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


        public ValueDataResponse<PreventiveMaintenance> InsertPreventiveMaintenance(UpsertPreventiveMaintenance PmOrders)
        {
            ValueDataResponse<PreventiveMaintenance> response = new ValueDataResponse<PreventiveMaintenance>();
            try
            {
                PreventiveMaintenance PM = _mapper.Map<PreventiveMaintenance>(PmOrders);
                var result = _appContext.PreventiveMaintenances.Add(PM);
                _appContext.SaveChanges();

                foreach (var sId in PmOrders.pmAssets)
                {
                    _appContext.PMAssetXrefs.Add(new PMAssetXref { AssetId = sId.AssetId, PreventiveMaintenanceId = PM.Id , DaysApplicable = sId.DaysApplicable, AstFixedDate= sId.AstFixedDate});
                }
                _appContext.SaveChanges();

                if (PmOrders != null)
                {
                    response.Result = PM;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Preventive Maintenance Added Successfully";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Preventive Maintenance Added Failed";
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


        public ValueDataResponse<PreventiveMaintenance> UpdatePreventiveMaintenance(UpsertPreventiveMaintenance PmOrder)
        {
            ValueDataResponse<PreventiveMaintenance> response = new ValueDataResponse<PreventiveMaintenance>();
            try
            {
                PreventiveMaintenance PM = _mapper.Map<PreventiveMaintenance>(PmOrder);
                var result = _appContext.PreventiveMaintenances.Where(x => x.Id == PmOrder.Id).FirstOrDefault();

                var List = _appContext.PMAssetXrefs.Where(x => x.PreventiveMaintenanceId == result.Id).ToList();
                _appContext.PMAssetXrefs.RemoveRange(List);
                _appContext.SaveChanges();
                foreach (var sId in PmOrder.pmAssets)
                {
                    _appContext.PMAssetXrefs.Add(new PMAssetXref { AssetId = sId.AssetId, PreventiveMaintenanceId = PM.Id, DaysApplicable = sId.DaysApplicable, AstFixedDate = sId.AstFixedDate });
                }
                _appContext.SaveChanges();

                if (result != null)
                {
                    result.PreventiveRefId = PmOrder.PreventiveRefId;
                    result.StartDate = PmOrder.StartDate;
                    result.JobPlanId = PmOrder.JobPlanId;
                    result.Priority = PmOrder.Priority;
                    result.DurationinHours = PmOrder.DurationInHours;
                    result.DaysApplicable = PmOrder.DaysApplicable;
                    result.StatusTypeId = PmOrder.StatusTypeId;
                    result.WorkTechnicianId = PmOrder.WorkTechnicianId;
                    result.TypeOfMaintenance = PmOrder.TypeOfMaintenance;
                    result.Details = PmOrder.Details;
                    result.CreatedBy = PmOrder.CreatedBy;
                    result.CreatedDate = PmOrder.CreatedDate;
                    result.UpdatedBy = PmOrder.UpdatedBy;
                    result.UpdatedDate = PmOrder.UpdatedDate;
                    result.IsActive = PmOrder.IsActive;
                }
                _appContext.SaveChanges();

                if (PM != null)
                {
                    response.Result = PM;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Preventive Maintenance Updated Successfully";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Preventive Maintenance Updation Failed";
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


        public ValueDataResponse<PreventiveMaintenance> DeletePreventiveMaintenance(int PmId)
        {
            ValueDataResponse<PreventiveMaintenance> response = new ValueDataResponse<PreventiveMaintenance>();
            try
            {
                var LocationData = _appContext.PreventiveMaintenances.Where(x => x.Id == PmId).FirstOrDefault();

                var ast = _appContext.PMAssetXrefs.Where(x => x.PreventiveMaintenanceId == PmId).ToList();
                if (ast != null)
                {
                    var assetRepo = _appContext.PMStatusHistories.Where(x => ast.Select(ar => ar.Id).Contains(x.PreventiveMaintenanceId)).ToList();
                   
                    _appContext.PMAssetXrefs.RemoveRange(ast);
                    _appContext.PMStatusHistories.RemoveRange(assetRepo);
                    _appContext.PreventiveMaintenances.Remove(LocationData);
                    _appContext.SaveChanges();
                }
                _appContext.SaveChanges();

                if (LocationData != null)
                {

                    response.Result = LocationData;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Preventive Maintenance Deleted Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Preventive Maintenance Found";
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
        //public ListDataResponse<GetPMAssetResponse> getAssetsByPM(int PmId)
        //{
        //    ListDataResponse<GetPMAssetResponse> response = new ListDataResponse<GetPMAssetResponse>();
        //    try
        //    {
        //        var result = (from pma in _appContext.PMAssetXrefs.Where(x => x.PreventiveMaintenanceId == PmId).ToList()
        //                      join a in _appContext.AssetLocations on pma.AssetId equals a.Id
                              
        //                      join l in _appContext.Locations on a.LocationId equals l.Id
        //                      join p in _appContext.Projects on l.ProjectId equals p.Id
                             

        //                      select new GetPMAssetResponse
        //                      {
        //                          AssetId = pma.AssetId,
        //                          AssetReference = a.AssetRef,
        //                          AssetFixedDate = a.AstFixedDate,
        //                          AssetName = a.Name1,
        //                          LocationId = a.LocationId,
        //                          LocationName = l.Name1,
        //                          ProjectId = l.ProjectId,
        //                          ProjectName = p.Name1,
                                 

        //                      }).ToList();

        //        if (result != null)
        //        {
        //            response.ListResult = result;
        //            response.IsSuccess = true;
        //            response.AffectedRecords = 1;
        //            response.EndUserMessage = "Get All Assets Details Successfull";
        //        }
        //        else
        //        {
        //            response.IsSuccess = true;
        //            response.AffectedRecords = 0;
        //            response.EndUserMessage = "No Assets Found";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.AffectedRecords = 0;
        //        response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
        //        response.Exception = ex;
        //    }

        //    return response;
        //}


    }
}
