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

        ListDataResponse<GetWorkItemsResponse> GetItemsByWorkOrderId(int workOrderId);

        ValueDataResponse<WorkOrder> DeleteWorkOrder(int WorkOrderId);

        ValueDataResponse<List<UpsertWorkOrder>> InsertPMOrder(List<UpsertWorkOrder> workorder);





        ValueDataResponse<WorkOrder> AcceptWorkOrder(int WorkOrderId, int StatusTypeId);

        ValueDataResponse<WorkOrder> RejectWorkOrder(int WorkOrderId, int StatusTypeId);

        ValueDataResponse<WorkOrder> CloseWorkOrder(int WorkOrderId, int StatusTypeId,string Comments);

        ListDataResponse<GetWorkOrderReponse> GetPMOrders();


    }
}
