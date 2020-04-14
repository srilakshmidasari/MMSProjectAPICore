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

        public ValueDataResponse<OrdersCount> GetWorkOrdersCount(int projectId, DateTime fromDate, DateTime toDate)
        {
            ValueDataResponse<OrdersCount> response = new ValueDataResponse<OrdersCount>();
           
            try
            {

                var orders = (from w in _appContext.WorkOrders.Include(s => s.Asset_Id).ThenInclude(b => b.Location_Id).ThenInclude(x => x.Project)
                              .ThenInclude(s => s.SiteInfo_Id)
                              where w.Asset_Id.Location_Id.ProjectId == projectId && w.CreatedDate.Date >= Convert.ToDateTime(fromDate).Date && w.CreatedDate.Date <= Convert.ToDateTime(toDate).Date
                              select new
                              {
                                  orders = w

                              }).ToList();

                var dashboardData = new OrdersCount
                {
                    NormalrdersCount = orders.Where(s => s.orders.OrderTypeId == (int)PMOrderTypes.WorkType).Count(),
                    PMOrdersCount = orders.Where(s => s.orders.OrderTypeId == (int)PMOrderTypes.OrderType).Count(),
                    

                };

                response.Result = dashboardData;
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

        public ValueDataResponse<OrdersTypeCount> GetWorkOrderDashboardCount(int projectId, DateTime fromDate, DateTime toDate, int WorkType)
        {
            ValueDataResponse<OrdersTypeCount> response = new ValueDataResponse<OrdersTypeCount>();
         
            try
            {
               
                var orders = (from w in _appContext.WorkOrders.Include(s => s.Asset_Id).ThenInclude(b => b.Location_Id).ThenInclude(x => x.Project)
                              .ThenInclude(s => s.SiteInfo_Id)
                              where w.Asset_Id.Location_Id.ProjectId == projectId && w.OrderTypeId == WorkType 
                              && w.CreatedDate.Date >= Convert.ToDateTime(fromDate).Date && w.CreatedDate.Date <= Convert.ToDateTime(toDate).Date
                              select new  {
                                  orders = w

                              }).ToList();

                var dashboardData = new OrdersTypeCount
                {
                    OrderPlannedCount = orders.Where(s => s.orders.WorkStatusId == (int)WorkStatus.Planned).Count(),
                    OrderCompletedCount = orders.Where(s => s.orders.WorkStatusId == (int)WorkStatus.Completed).Count(),
                    OrderInProgressCount= orders.Where(s=>s.orders.WorkStatusId == (int)WorkStatus.InProgrss).Count(),

                };

                response.Result = dashboardData;
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
        
        public ValueDataResponse<TradeOrdersCount> GetWorkOrdersByTradeCount(int projectId, DateTime fromDate, DateTime toDate, int WorkType, int StatusTypeId)
        {
            ValueDataResponse<TradeOrdersCount> response = new ValueDataResponse<TradeOrdersCount>();
            var dashboardCount = new TradeOrdersCount();
            try
            {

                var orders = (from w in _appContext.WorkOrders.Include(s => s.Asset_Id).ThenInclude(b => b.Location_Id).ThenInclude(x => x.Project)
                              .ThenInclude(s => s.SiteInfo_Id)
                              where w.Asset_Id.Location_Id.ProjectId == projectId && w.OrderTypeId == WorkType && w.StatusTypeId == StatusTypeId &&
                              w.CreatedDate.Date >= Convert.ToDateTime(fromDate).Date && w.CreatedDate.Date <= Convert.ToDateTime(toDate).Date
                              select new
                              {
                                  orders = w

                              }).ToList();

                var dashboardData = new TradeOrdersCount
                {
                    OpenCount = orders.Where(s => s.orders.StatusTypeId == (int)StatusTypes.Open).Count(),
                    ApprovedCount = orders.Where(s => s.orders.StatusTypeId == (int)StatusTypes.Approved).Count(),
                    RejectedCount = orders.Where(s => s.orders.StatusTypeId == (int)StatusTypes.Rejected).Count(),
                    ClosedCount = orders.Where(s => s.orders.StatusTypeId == (int)StatusTypes.Closed).Count(),

                };

                response.Result = dashboardData;
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

    }
}
