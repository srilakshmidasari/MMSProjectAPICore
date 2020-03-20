using AutoMapper;
using DAL.Repositories.Interfaces;
using DAL.Response;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using static DAL.RequestResponseModels.RequestResponseModels;
using DAL.Models;
using System.IO;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;

namespace DAL.Repositories
{
    public class WorkOrderRepository : Repository<dynamic>, IWorkOrderRepository
    {

        public readonly IOptions<AppSettings> _config;
        public WorkOrderRepository(ApplicationDbContext context, IMapper mapper, IOptions<AppSettings> configuration) : base(context, mapper, configuration)
        {
            _config = configuration;
        }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public ListDataResponse<GetWorkOrderReponse> GetAllWorkOrders()
        {
            ListDataResponse<GetWorkOrderReponse> response = new ListDataResponse<GetWorkOrderReponse>();
            try
            {
                var result = (from wo in _appContext.WorkOrders
                              join a in _appContext.AssetLocations on wo.AssetId equals a.Id
                              join l in _appContext.Locations on a.LocationId equals l.Id
                              join p in _appContext.Projects on l.ProjectId equals p.Id
                              join s in _appContext.SiteInfos on p.SiteId equals s.Id
                              join st in _appContext.LookUps on wo.StoreId equals st.Id
                              join wty in _appContext.LookUps on wo.WorkTypeId equals wty.Id
                              join ws in _appContext.LookUps on wo.WorkStatusId equals ws.Id
                              join wf in _appContext.LookUps on wo.WorkFaultId equals wf.Id
                              join wt in _appContext.LookUps on wo.WorkTechnicianId equals wt.Id
                              join sta in _appContext.TypeCdDmts on wo.StatusTypeId equals sta.TypeCdDmtId
                              select new GetWorkOrderReponse
                              {
                                  Id = wo.Id,
                                  StartDate = wo.StartDate,
                                  EndDate = wo.EndDate,
                                  Reference1 = wo.Reference1,
                                  ExtraDetails = wo.ExtraDetails,
                                  OrderTypeId =wo.OrderTypeId,
                                  Issue = wo.Issue,
                                  Resolution = wo.Resolution,
                                  StatusTypeId = wo.StatusTypeId,
                                  StatusTypeName = sta.Description,
                                  AssetId = wo.AssetId,
                                  AssetName = a.Name1,
                                  SiteId = s.Id,
                                  SiteName = s.Name1,
                                  ProjectId = p.Id,
                                  ProjectName = p.Name1,
                                  LocationId = l.Id,
                                  LocationName = l.Name1,
                                  StoreId = wo.StoreId,
                                  StoreName = st.Name1,
                                  WorkStatusId = wo.WorkStatusId,
                                  WorkStatusName = ws.Name1,
                                  WorkTypeId = wo.WorkTypeId,
                                  WorkTypeName = wty.Name1,
                                  WorkFaultId = wo.WorkFaultId,
                                  WorkFaultName = wf.Name1,
                                  WorkTechnicianId = wo.WorkTechnicianId,
                                  WorkTechnicianName = wt.Name1,
                                  IsActive = wo.IsActive,
                                  CreatedBy = wo.CreatedBy,
                                  CreatedDate = wo.CreatedDate,
                                  UpdatedBy = wo.UpdatedBy,
                                  UpdatedDate = wo.UpdatedDate,
                              }).ToList();

                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All Work Order Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Work Order Details Found";
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

        public ValueDataResponse<WorkOrder> InsertWorkOrder(UpsertWorkOrder workorders)
        {
            ValueDataResponse<WorkOrder> response = new ValueDataResponse<WorkOrder>();
            try
            {
                var orderExists = _appContext.WorkOrders.Where(x => x.Reference1 == workorders.Reference1).FirstOrDefault();
                if (orderExists == null)
                {

                    WorkOrder Wro = _mapper.Map<WorkOrder>(workorders);
                    var result = _appContext.WorkOrders.Add(Wro);
                    _appContext.SaveChanges();
                    if(workorders.WorkOrderItems != null)
                    {
                        foreach (var it in workorders.WorkOrderItems)
                        {
                            _appContext.WorkOrderItemXrefs.Add(new WorkOrderItemXref
                            {
                                ItemId = it.ItemId,
                                WorkOrderId = Wro.Id,
                                Quantity = it.Quantity,
                            });
                        }
                        _appContext.SaveChanges();
                    }

                    
                    if (Wro != null)
                    {
                        response.Result = Wro;
                        response.IsSuccess = true;
                        
                        
                        response.AffectedRecords = 1;
                        response.EndUserMessage = "Work Order Added Successfully";
                    }
                    else
                    {
                        response.IsSuccess = true;
                        response.AffectedRecords = 0;
                        response.EndUserMessage = "Work Order Added Failed";
                    }
                }
                else
                {
                    response.IsSuccess = false;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Work Order Reference is Already Exists";
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

        public ValueDataResponse<WorkOrder> UpdateWorkOrder(UpsertWorkOrder workorders)
        {
            ValueDataResponse<WorkOrder> response = new ValueDataResponse<WorkOrder>();
            try
            {
                var orderExists = _appContext.WorkOrders.Where(x => x.Id != workorders.Id && x.Reference1 == workorders.Reference1).FirstOrDefault();
                if (orderExists == null)
                {

                    WorkOrder Wro = _mapper.Map<WorkOrder>(workorders);
                    var result = _appContext.WorkOrders.Where(x => x.Id == workorders.Id).FirstOrDefault();
                    var workOrderItemList = _appContext.WorkOrderItemXrefs.Where(x => x.WorkOrderId == workorders.Id).ToList();
                    _appContext.WorkOrderItemXrefs.RemoveRange(workOrderItemList);
                    _appContext.SaveChanges();

                    foreach (var it in workorders.WorkOrderItems)
                    {
                        _appContext.WorkOrderItemXrefs.Add(new WorkOrderItemXref
                        {
                            ItemId = it.ItemId,
                            WorkOrderId = Wro.Id,
                            Quantity = it.Quantity,
                        });
                    }

                    if (result != null)
                    {
                        result.AssetId = workorders.AssetId;
                        result.OrderTypeId = workorders.OrderTypeId;
                        result.StartDate = workorders.StartDate;
                        result.EndDate = workorders.EndDate;
                        result.WorkTypeId = workorders.WorkTypeId;
                        result.StatusTypeId = workorders.StatusTypeId;
                        result.WorkTechnicianId = workorders.WorkTechnicianId;
                        result.WorkStatusId = workorders.WorkStatusId;
                        result.WorkFaultId = workorders.WorkFaultId;
                        result.StoreId = workorders.StoreId;
                        result.Reference1 = workorders.Reference1;
                        result.ExtraDetails = workorders.Extradetails;
                        result.Issue = workorders.Issue;
                        result.Resolution = workorders.Resolution;
                        result.CreatedBy = workorders.CreatedBy;
                        result.CreatedDate = workorders.CreatedDate;
                        result.UpdatedBy = workorders.UpdatedBy;
                        result.UpdatedDate = workorders.UpdatedDate;
                        result.IsActive = workorders.IsActive;
                    }
                    _appContext.SaveChanges();

                    if (Wro != null)
                    {
                        response.Result = Wro;
                        response.IsSuccess = true;
                        response.AffectedRecords = 1;
                        response.EndUserMessage = "Work Order Update Successfully";
                    }
                    else
                    {
                        response.IsSuccess = true;
                        response.AffectedRecords = 0;
                        response.EndUserMessage = "Work Order Updation Failed";
                    }
                }
                else
                {
                    response.IsSuccess = false;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Work Order Reference is Already Exists";
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

        public ListDataResponse<GetWorkItemsResponse> GetItemsByWorkOrderId(int workOrderId)
        {
            ListDataResponse<GetWorkItemsResponse> response = new ListDataResponse<GetWorkItemsResponse>();
            try
            {
                var result = (from wi in _appContext.WorkOrderItemXrefs
                              join i in _appContext.Items on wi.ItemId equals i.Id
                              join w in _appContext.WorkOrders on wi.WorkOrderId equals w.Id
                              select new GetWorkItemsResponse
                              {
                                  Id = wi.Id,
                                  WorkOrderId = wi.WorkOrderId,
                                  ItemReference = i.ItemReference,
                                  ItemId = wi.ItemId,
                                  ItemName = i.Name1,
                                  Quantity = wi.Quantity,


                              }).Where(x => x.WorkOrderId == workOrderId).ToList();

                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All Item Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Item Details Found";
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

        public ValueDataResponse<WorkOrder> DeleteWorkOrder(int WorkOrderId)
        {
            ValueDataResponse<WorkOrder> response = new ValueDataResponse<WorkOrder>();
            try
            {
                var orderData = _appContext.WorkOrders.Where(x => x.Id == WorkOrderId).FirstOrDefault();

                var ast = _appContext.WorkOrderItemXrefs.Where(x => x.WorkOrderId == WorkOrderId).ToList();
                if (ast != null)
                {
                    var statusData = _appContext.WorkOrderStatusHistories.Where(x => x.WorkOrderId == WorkOrderId).ToList();
                    _appContext.WorkOrderStatusHistories.RemoveRange(statusData);
                    _appContext.WorkOrderItemXrefs.RemoveRange(ast);
                    _appContext.WorkOrders.Remove(orderData);
                    _appContext.SaveChanges();
                }

                if (orderData != null)
                {
                    response.Result = orderData;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Work Order Deleted Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Work Order Found";
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


        public ValueDataResponse<WorkOrder> AcceptWorkOrder(int WorkOrderId, int StatusTypeId)
            
        {
            ValueDataResponse<WorkOrder> response = new ValueDataResponse<WorkOrder>();
            try
            {
                var orderData = _appContext.WorkOrders.Where(x => x.Id == WorkOrderId).FirstOrDefault();


                if (orderData != null)
                {
                    orderData.StatusTypeId = StatusTypeId;
                    WorkOrderStatusHistory request = new WorkOrderStatusHistory()
                    {
                        WorkOrderId = orderData.Id,
                        StatusTypeId = StatusTypeId,
                        CreatedBy = orderData.CreatedBy,
                        UpdatedBy = orderData.UpdatedBy,
                        CreatedDate = orderData.CreatedDate,
                        UpdatedDate = orderData.UpdatedDate,

                    };
                    _appContext.WorkOrderStatusHistories.Add(request);
                    _appContext.SaveChanges();
                    response.Result = orderData;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Work Order Accepted Successfully";
                }
               
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Work Order Found";
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


        public ValueDataResponse<WorkOrder> RejectWorkOrder(int WorkOrderId, int StatusTypeId)
        {
            ValueDataResponse<WorkOrder> response = new ValueDataResponse<WorkOrder>();
            try
            {
                var orderData = _appContext.WorkOrders.Where(x => x.Id == WorkOrderId).FirstOrDefault();


                if (orderData != null)
                {
                    orderData.StatusTypeId = StatusTypeId;
                    WorkOrderStatusHistory request = new WorkOrderStatusHistory()
                    {
                        WorkOrderId = orderData.Id,
                        StatusTypeId = StatusTypeId,
                        CreatedBy = orderData.CreatedBy,
                        UpdatedBy = orderData.UpdatedBy,
                        CreatedDate = orderData.CreatedDate,
                        UpdatedDate = DateTime.Now,

                    };
                    _appContext.WorkOrderStatusHistories.Add(request);
                    _appContext.SaveChanges();
                    response.Result = orderData;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Work Order Accepted Successfully";
                }

                
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Work Order Found";
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


        public ValueDataResponse<WorkOrder> CloseWorkOrder(int WorkOrderId, int StatusTypeId, string Comments)
        {
            ValueDataResponse<WorkOrder> response = new ValueDataResponse<WorkOrder>();
            try
            {
                var orderData = _appContext.WorkOrders.Where(x => x.Id == WorkOrderId).FirstOrDefault();


                if (orderData != null)
                {
                    orderData.StatusTypeId = StatusTypeId;
                    WorkOrderStatusHistory request = new WorkOrderStatusHistory()
                    {
                        WorkOrderId = orderData.Id,
                        StatusTypeId = StatusTypeId,
                        Comments = Comments,
                        CreatedBy = orderData.CreatedBy,
                        UpdatedBy = orderData.UpdatedBy,
                        CreatedDate = orderData.CreatedDate,
                        UpdatedDate = DateTime.Now,

                    };
                    _appContext.WorkOrderStatusHistories.Add(request);
                    _appContext.SaveChanges();
                    response.Result = orderData;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Work Order Accepted Successfully";
                }


                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Work Order Found";
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
