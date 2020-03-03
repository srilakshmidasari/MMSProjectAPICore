using DAL.Models;
using DAL.Response;
using System;
using System.Collections.Generic;
using System.Text;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace DAL.Repositories.Interfaces
{
   public interface IWorkOrderRepository
    {

        ListDataResponse<GetWorkOrderReponse> GetAllWorkOrders();

        ValueDataResponse<WorkOrder> InsertWorkOrder(UpsertWorkOrder workorder);

        ValueDataResponse<WorkOrder> UpdateWorkOrder(UpsertWorkOrder workorder);

    }
}
