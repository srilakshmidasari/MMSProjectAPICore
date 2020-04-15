using AutoMapper;
using DAL.Repositories.Interfaces;
using DAL.Response;
using System.Linq;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using static DAL.RequestResponseModels.RequestResponseModels;
using Microsoft.EntityFrameworkCore;
using static DAL.EnumType;

namespace DAL.Repositories
{
   public class DashboardRepository : Repository<dynamic>, IDashboardRepository
    {
        public readonly IOptions<AppSettings> _config;
        public DashboardRepository(ApplicationDbContext context, IMapper mapper, IOptions<AppSettings> configuration) : base(context, mapper, configuration)
        {
            _config = configuration;
        }
        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        //public ValueDataResponse<OrdersCount> GetWorkOrdersCount(int projectId, DateTime fromDate, DateTime toDate)
        //{
        //    ValueDataResponse<OrdersCount> response = new ValueDataResponse<OrdersCount>();
           
        //    try
        //    {

        //        var orders = (from w in _appContext.WorkOrders.Include(s => s.Asset_Id).ThenInclude(b => b.Location_Id).ThenInclude(x => x.Project)
        //                      .ThenInclude(s => s.SiteInfo_Id)
        //                      where w.Asset_Id.Location_Id.ProjectId == projectId && w.CreatedDate.Date >= Convert.ToDateTime(fromDate).Date && w.CreatedDate.Date <= Convert.ToDateTime(toDate).Date
        //                      select new
        //                      {
        //                          orders = w

        //                      }).ToList();

        //        var dashboardData = new OrdersCount
        //        {
        //            NormalrdersCount = orders.Where(s => s.orders.OrderTypeId == (int)PMOrderTypes.WorkType).Count(),
        //            PMOrdersCount = orders.Where(s => s.orders.OrderTypeId == (int)PMOrderTypes.OrderType).Count(),
        //        };

        //        response.Result = dashboardData;
        //        response.IsSuccess = true;
        //        response.AffectedRecords = 0;
        //        response.EndUserMessage = "Get All Work Orders Count Successfull";

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

        public ListDataResponse<dynamic> GetWorkOrderDashboardCount(int projectId, DateTime fromDate, DateTime toDate, int WorkType)
        {
            ListDataResponse<dynamic> response = new ListDataResponse<dynamic>();
         
            try
            {
                //    var orders = (from w in _appContext.WorkOrders.Include(l => l.OrderType_Id).Include(s => s.Asset_Id).ThenInclude(b => b.Location_Id).ThenInclude(x => x.Project)
                //                      // join l in _appContext.LookUps on w.StatusTypeId equals l.Id 

                //                       where w.Asset_Id.Location_Id.ProjectId == projectId 
                //                       && w.CreatedDate.Date >= Convert.ToDateTime(fromDate).Date && w.CreatedDate.Date <= Convert.ToDateTime(toDate).Date
                //                  group w by new
                //                  {
                //                      w.OrderTypeId,
                //                      w.OrderType_Id.Description
                //                  } into grp
                //                  select new
                //                  {
                //                      Id = grp.Key.OrderTypeId,
                //                      OrderType = grp.Key.Description,
                //                      OrdersCount = grp.Count()
                //                  }
                //                 ).ToList();

                var orders = (from l in _appContext.LookUps.Where(tcd => tcd.LookUpTypeId == (int)LookUP.WorkType)
                              join ws in (from wo in _appContext.WorkOrders
                                          join a in _appContext.AssetLocations on wo.AssetId equals a.Id
                                          join lo in _appContext.Locations on a.LocationId equals lo.Id
                                          where lo.ProjectId == projectId
                                          && wo.CreatedDate.Date >= Convert.ToDateTime(fromDate).Date && wo.CreatedDate.Date <= Convert.ToDateTime(toDate).Date
                                          group wo by new
                                          {
                                              wo.WorkTypeId
                                          } into grps
                                          select new
                                          {
                                              WorkTypeId = grps.Key.WorkTypeId,
                                              OrdersCount = grps.Count()
                                          }
                              ) on l.Id equals ws.WorkTypeId into wl
                              from wo in wl.DefaultIfEmpty()
                              group wo by new
                              {
                                  l.Id,
                                  l.Name1,
                              } into grp
                              select new
                              {
                                  Id = grp.Key.Id,
                                  Description = grp.Key.Name1,
                                  OrdersCount = grp.Max(s => s.OrdersCount)
                              }
                             ).ToList(); 
              
                             
                             //var orders = (from w in _appContext.WorkOrders.Include(s => s.Asset_Id).ThenInclude(b => b.Location_Id).ThenInclude(x => x.Project)
                             // .ThenInclude(s => s.SiteInfo_Id)
                             // where w.Asset_Id.Location_Id.ProjectId == projectId && w.OrderTypeId == WorkType 
                             // && w.CreatedDate.Date >= Convert.ToDateTime(fromDate).Date && w.CreatedDate.Date <= Convert.ToDateTime(toDate).Date
                             // select new  {
                             //     orders = w

                             // }).ToList();

                //var dashboardData = new OrdersTypeCount
                //{
                //    OrderPlannedCount = orders.Where(s => s.orders.WorkStatusId == (int)WorkStatus.Planned).Count(),
                //    OrderCompletedCount = orders.Where(s => s.orders.WorkStatusId == (int)WorkStatus.Completed).Count(),
                //    OrderInProgressCount= orders.Where(s=>s.orders.WorkStatusId == (int)WorkStatus.InProgrss).Count(),

                //};

                response.ListResult = orders;
                response.IsSuccess = true;
                 response.AffectedRecords = 0;
                response.EndUserMessage = "Get All Work Orders Count Successfull";
               
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

        public ListDataResponse<dynamic> GetWorkOrderStatusCount(int projectId, DateTime fromDate, DateTime toDate, int WorkType)
        {
            ListDataResponse<dynamic> response = new ListDataResponse<dynamic>();

            try
            {

                var orders = (from l in _appContext.LookUps.Where(tcd => tcd.LookUpTypeId == (int)LookUP.WorkStatus)
                              join w in (from wo in _appContext.WorkOrders 
                                          join a in _appContext.AssetLocations on wo.AssetId equals a.Id
                                          join lo in _appContext.Locations on a.LocationId equals lo.Id
                                          join p in _appContext.Projects on lo.ProjectId equals p.Id
                                          where lo.ProjectId == projectId && wo.WorkTypeId == WorkType
                                          && wo.CreatedDate.Date >= Convert.ToDateTime(fromDate).Date && wo.CreatedDate.Date <= Convert.ToDateTime(toDate).Date
                                         group wo by new
                                         {
                                             wo.WorkStatusId
                                         } into grps
                                         select new
                                         {
                                             WorkStatusId = grps.Key.WorkStatusId,
                                             OrdersCount = grps.Count()
                                         }
                                            ) on l.Id equals w.WorkStatusId into alrt

                              from a in alrt.DefaultIfEmpty()
                                        
                              group a by new
                              {
                                  l.Id,
                                  l.Name1,
                              } into grp
                              select new
                              {
                                  Id = grp.Key.Id,
                                  Description = grp.Key.Name1,
                                  OrdersCount = grp.Max(w => w.OrdersCount)
                              }
                             ).ToList();

                response.ListResult = orders;
                response.IsSuccess = true;
                response.AffectedRecords = 0;
                response.EndUserMessage = "Get All Work Orders Count Successfull";

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


        public ListDataResponse<dynamic> GetWorkOrderByTradesCount(int projectId, DateTime fromDate, DateTime toDate, int WorkType, int StatusTypeId)
        {
            ListDataResponse<dynamic> response = new ListDataResponse<dynamic>();

            try
            {

                var orders = (from l in _appContext.LookUps.Where(tcd => tcd.LookUpTypeId == (int)LookUP.AstTrade)
                              join art in (from wo in _appContext.WorkOrders
                                           join al in _appContext.AssetLocations on wo.AssetId equals al.Id
                                           join lo in _appContext.Locations on al.LocationId equals lo.Id
                                           where wo.WorkTypeId == WorkType && lo.ProjectId == projectId && wo.WorkStatusId == StatusTypeId &&
                                           wo.CreatedDate.Date >= Convert.ToDateTime(fromDate).Date && wo.CreatedDate.Date <= Convert.ToDateTime(toDate).Date
                                           group wo by new
                                           {
                                               al.AstTradeId
                                           } into grps
                                           select new
                                           {
                                               AstTradeId = grps.Key.AstTradeId,
                                               OrdersCount = grps.Count()
                                           }
                                            ) on l.Id equals art.AstTradeId into alrt

                              from a in alrt.DefaultIfEmpty()
                              group a by new
                              {
                                  l.Id,
                                  l.Name1,
                              } into grp
                              select new
                              {
                                  Id = grp.Key.Id,
                                  Description = grp.Key.Name1,
                                  OrdersCount = grp.Max(s => s.OrdersCount)
                              }
                             ).ToList();

                response.ListResult = orders;
                response.IsSuccess = true;
                response.AffectedRecords = 0;
                response.EndUserMessage = "Get All Work Orders Count Successfull";

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
        
        
        //public ValueDataResponse<TradeOrdersCount> GetWorkOrdersByTradeCount(int projectId, DateTime fromDate, DateTime toDate, int WorkType, int StatusTypeId)
        //{
        //    ValueDataResponse<TradeOrdersCount> response = new ValueDataResponse<TradeOrdersCount>();
        //    var dashboardCount = new TradeOrdersCount();
        //    try
        //    {

        //        var orders = (from w in _appContext.WorkOrders.Include(s => s.Asset_Id).ThenInclude(b => b.Location_Id).ThenInclude(x => x.Project)
        //                      .ThenInclude(s => s.SiteInfo_Id)
        //                      where w.Asset_Id.Location_Id.ProjectId == projectId && w.OrderTypeId == WorkType && w.StatusTypeId == StatusTypeId &&
        //                      w.CreatedDate.Date >= Convert.ToDateTime(fromDate).Date && w.CreatedDate.Date <= Convert.ToDateTime(toDate).Date
        //                      select new
        //                      {
        //                          orders = w

        //                      }).ToList();

        //        var dashboardData = new TradeOrdersCount
        //        {
        //            OpenCount = orders.Where(s => s.orders.StatusTypeId == (int)StatusTypes.Open).Count(),
        //            ApprovedCount = orders.Where(s => s.orders.StatusTypeId == (int)StatusTypes.Approved).Count(),
        //            RejectedCount = orders.Where(s => s.orders.StatusTypeId == (int)StatusTypes.Rejected).Count(),
        //            ClosedCount = orders.Where(s => s.orders.StatusTypeId == (int)StatusTypes.Closed).Count(),

        //        };

        //        response.Result = dashboardData;
        //        response.IsSuccess = true;
        //        response.AffectedRecords = 0;
        //        response.EndUserMessage = "Get All Work Orders Count Successfull";

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
