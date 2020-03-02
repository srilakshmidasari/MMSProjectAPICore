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

        ValueDataResponse<string> InsertPurchaseOrder(UpsertPurchaseOrder purchages);

        ValueDataResponse<string> UpdatePurchaseOrder(UpsertPurchaseOrder purchages);

        ValueDataResponse<PurchageOrder> DeletePurchaseOrder(int PurchaseId);

        ListDataResponse<GetItemsResponse> GetItemsByPurchaseId(int PurchaseId);

        ValueDataResponse<string> GetPurchageItemsPdf(int PurchaseId);

    }
}
