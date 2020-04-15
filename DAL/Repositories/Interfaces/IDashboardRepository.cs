using DAL.Response;
using System;
using System.Collections.Generic;
using System.Text;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace DAL.Repositories.Interfaces
{
    public interface IDashboardRepository
    {
       
      //  ValueDataResponse<OrdersCount> GetWorkOrdersCount(int projectId, DateTime fromDate, DateTime toDate);

        ListDataResponse<dynamic> GetWorkOrderDashboardCount(int projectId, DateTime fromDate, DateTime toDate, int WorkType);

        ListDataResponse<dynamic> GetWorkOrderStatusCount(int projectId, DateTime fromDate, DateTime toDate, int WorkType);

        ListDataResponse<dynamic> GetWorkOrderByTradesCount(int projectId, DateTime fromDate, DateTime toDate, int WorkType, int StatusTypeId);

      //  ValueDataResponse<TradeOrdersCount> GetWorkOrdersByTradeCount(int projectId, DateTime fromDate, DateTime toDate, int WorkType , int StatusTypeId);


    }
}
