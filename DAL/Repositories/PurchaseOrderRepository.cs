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

namespace DAL.Repositories
{
    public class PurchaseOrderRepository : Repository<dynamic>, IPurchaseOrderRepository
    {

        public readonly IOptions<AppSettings> _config;
        public PurchaseOrderRepository(ApplicationDbContext context, IMapper mapper, IOptions<AppSettings> configuration) : base(context, mapper, configuration)
        {
            _config = configuration;
        }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public ListDataResponse<GetPurchageResponse> GetAllPurchases()
        {
            ListDataResponse<GetPurchageResponse> response = new ListDataResponse<GetPurchageResponse>();
            try
            {
                var result = (from po in _appContext.PurchageOrders
                              join s in _appContext.Suppliers on po.SupplierId equals s.Id
                              select new GetPurchageResponse
                              {
                                  Id = po.Id,
                                  SupplierId = po.SupplierId,
                                  SupplierName = s.Name1,
                                  SupplierAddress = s.Address,
                                  ArrivingDate = po.ArrivingDate,
                                  IsActive = po.IsActive,
                                  CreatedBy = po.CreatedBy,
                                  CreatedDate = po.CreatedDate,
                                  UpdatedBy = po.UpdatedBy,
                                  UpdatedDate = po.UpdatedDate,

                              }).ToList();

                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All Purchase Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Purchase Order Details Found";
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

        public ValueDataResponse<PurchageOrder> InsertPurchaseOrder(UpsertPurchaseOrder purchages)
        {
            ValueDataResponse<PurchageOrder> response = new ValueDataResponse<PurchageOrder>();

            try
            {
                PurchageOrder pro = _mapper.Map<PurchageOrder>(purchages);
                var result = _appContext.PurchageOrders.Add(pro);
                _appContext.SaveChanges();
                foreach (var it in purchages.PurchaseItems)
                {
                    _appContext.PurchageItemXrefs.Add(new PurchageItemXref
                    {
                        ItemId = it.ItemId,
                        PurchageId = pro.Id,
                        Quantity = it.Quantity,
                        ExpectdCost = it.ExpectdCost
                    });
                }

                _appContext.SaveChanges();


                if (pro != null)
                {
                    response.Result = pro;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "PurchageOrder Added Successfully";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "PurchageOrder Added Failed";
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

        public ValueDataResponse<PurchageOrder> UpdatePurchaseOrder(UpsertPurchaseOrder purchages)
        {
            ValueDataResponse<PurchageOrder> response = new ValueDataResponse<PurchageOrder>();

            try
            {
                PurchageOrder pro = _mapper.Map<PurchageOrder>(purchages);
                var result = _appContext.PurchageOrders.Where(x => x.Id == purchages.Id).FirstOrDefault();
                var purchaseItemList = _appContext.PurchageItemXrefs.Where(x => x.PurchageId == purchages.Id).ToList();
                _appContext.PurchageItemXrefs.RemoveRange(purchaseItemList);
                _appContext.SaveChanges();
                foreach (var it in purchages.PurchaseItems)
                {
                    _appContext.PurchageItemXrefs.Add(new PurchageItemXref
                    {
                        ItemId = it.ItemId,
                        PurchageId = pro.Id,
                        Quantity = it.Quantity,
                        ExpectdCost = it.ExpectdCost
                    });
                }
                if(result != null)
                {
                    result.SupplierId = purchages.SupplierId;
                    result.IsActive = purchages.IsActive;
                    result.CreatedBy = purchages.CreatedBy;
                    result.CreatedDate = purchages.CreatedDate;
                    result.UpdatedBy = purchages.UpdatedBy;
                    result.UpdatedDate = purchages.UpdatedDate;
                    result.ArrivingDate = purchages.ArrivingDate;
                    _appContext.SaveChanges();

                    if (pro != null)
                    {
                        response.Result = pro;
                        response.IsSuccess = true;
                        response.AffectedRecords = 1;
                        response.EndUserMessage = "Purchage Order Updated Successfully";
                    }
                    else
                    {
                        response.IsSuccess = true;
                        response.AffectedRecords = 0;
                        response.EndUserMessage = "Purchage Order Updation Failed";
                    }
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

        public ValueDataResponse<PurchageOrder> DeletePurchaseOrder(int PurchaseId)
        {
            ValueDataResponse<PurchageOrder> response = new ValueDataResponse<PurchageOrder>();
            try
            {
                var purchaseData = _appContext.PurchageOrders.Where(x => x.Id == PurchaseId).FirstOrDefault();

                var ast = _appContext.PurchageItemXrefs.Where(x => x.PurchageId == PurchaseId).ToList();
                if (ast.Count > 0)
                {
                    _appContext.PurchageItemXrefs.RemoveRange(ast);
                   
                    _appContext.PurchageOrders.Remove(purchaseData);
                    _appContext.SaveChanges();
                }

                if (purchaseData != null)
                {
                    response.Result = purchaseData;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Purchase Order Deleted Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Purchase Order Found";
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

        public ListDataResponse<GetItemsResponse> GetItemsByPurchaseId(int purchaseId)
        {
            ListDataResponse<GetItemsResponse> response = new ListDataResponse<GetItemsResponse>();
            try
            {
                var result = (from pi in _appContext.PurchageItemXrefs
                              join i in _appContext.Items on pi.ItemId equals i.Id
                              join p in _appContext.PurchageOrders on pi.PurchageId equals p.Id
                              select new GetItemsResponse
                              {
                                  Id = pi.Id,
                                  PurchaseId = pi.PurchageId,
                                  ItemId = pi.ItemId,
                                  ItemName = i.Name1,
                                  Quantity = pi.Quantity,
                                  ExpectedCost = pi.ExpectdCost,

                              }).Where(x => x.PurchaseId == purchaseId).ToList();

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
    }
}
