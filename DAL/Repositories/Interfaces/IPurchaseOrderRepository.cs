using DAL.Models;
using DAL.Response;
using System;
using System.Collections.Generic;
using System.Text;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace DAL.Repositories.Interfaces
{
    public interface IPurchaseOrderRepository
    {

        ListDataResponse<GetPurchageResponse> GetAllPurchases();

        ValueDataResponse<PurchageOrder> InsertPurchaseOrder(UpsertPurchaseOrder purchages);
    }
}
