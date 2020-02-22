using AutoMapper;
using DAL.Models;
using DAL.Repositories.Interfaces;
using DAL.Response;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace DAL.Repositories
{
    public class ItemRepository : Repository<dynamic>, IItemRepository
    {
        public readonly IOptions<AppSettings> _config;
        public ItemRepository(ApplicationDbContext context, IMapper mapper, IOptions<AppSettings> configuration) : base(context, mapper, configuration)
        {
            _config = configuration;
        }
        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public ListDataResponse<GetItemResponse> GetAllItems()
        {
            ListDataResponse<GetItemResponse> response = new ListDataResponse<GetItemResponse>();
            try
            {
                //var result = _appContext.Items.ToList();
                var result = (from It in _appContext.Items
                              join l in _appContext.LookUps on It.ItemCategory equals l.Id
                              join p in _appContext.LookUps on It.UOMId equals p.Id
                              join t in _appContext.TypeCdDmts on It.ItemType equals t.TypeCdDmtId

                              select new GetItemResponse
                              {
                                  Id = It.Id,
                                  Name1 = It.Name1,
                                  Name2 = It.Name2,
                                  Description =It.Description,
                                  ItemReference = It.ItemReference,
                                  ItemCategory =l.Id,
                                  CategoryName = l.Name1,
                                  ItemTypeId = It.ItemType,
                                  ItemTypeName =t.Description,
                                  UnitOfConversion = It.UnitOfConversion,
                                  Units = It.Units,
                                  UOMId = p.Id,
                                  UOMName = p.Name1,
                                  AverageCost = It.AverageCost,
                                  IsActive = It.IsActive,
                                  CreatedBy = It.CreatedBy,
                                  CreatedDate = It.CreatedDate,
                                  UpdatedBy = It.UpdatedBy,
                                  UpdatedDate = It.UpdatedDate,

                              }).ToList();
                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All Site Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Site Details Found";
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

        public ValueDataResponse<Item> AddItemDetials(Item items)
        {
            ValueDataResponse<Item> response = new ValueDataResponse<Item>();

            try
            {
                var itemExists = _appContext.Items.Where(x => x.ItemReference == items.ItemReference).FirstOrDefault();
                if (itemExists == null)
                {
                    var result = _appContext.Items.Add(items);
                    _appContext.SaveChanges();

                    if (result != null)
                    {
                        response.Result = items;
                        response.IsSuccess = true;
                        response.AffectedRecords = 1;
                        response.EndUserMessage = "Item Added Successfully";
                    }
                    else
                    {
                        response.IsSuccess = true;
                        response.AffectedRecords = 0;
                        response.EndUserMessage = "Item Added Failed";
                    }
                }
                else
                {
                    response.IsSuccess = false;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Item Reference Already Exists";
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


        public ValueDataResponse<Item> UpdateItem(Item items)
        {
            ValueDataResponse<Item> response = new ValueDataResponse<Item>();

            try
            {
                var itemExists = _appContext.Items.Where(x => x.Id != items.Id && x.ItemReference == items.ItemReference).FirstOrDefault();
                if (itemExists == null)
                {
                    var result = _appContext.Items.Where(x => x.Id == items.Id).FirstOrDefault();
                    if (result != null)
                    {
                        result.ItemReference = items.ItemReference;
                        result.ItemCategory = items.ItemCategory;
                        result.ItemType = items.ItemType;
                        result.Name1 = items.Name1;
                        result.Name2 = items.Name2;
                        result.Description = items.Description;
                        result.AverageCost = items.AverageCost;
                        result.UOMId = items.UOMId;
                        result.UnitOfConversion = items.UnitOfConversion;
                        result.Units = items.Units;
                        result.IsActive = items.IsActive;
                        result.CreatedBy = items.CreatedBy;
                        result.CreatedDate = items.CreatedDate;
                        result.UpdatedBy = items.UpdatedBy;
                        result.UpdatedDate = items.UpdatedDate;

                        _appContext.SaveChanges();
                        response.Result = result;
                        response.IsSuccess = true;
                        response.AffectedRecords = 1;
                        response.EndUserMessage = "Item Updated Successfully";
                    }
                    else
                    {
                        response.IsSuccess = true;
                        response.AffectedRecords = 0;
                        response.EndUserMessage = "Item Updation Failed";
                    }
                }
                else
                {
                    response.IsSuccess = false;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Item Reference Already Exists";
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


        public ValueDataResponse<Item> DeleteItem(int ItemId)
        {
            ValueDataResponse<Item> response = new ValueDataResponse<Item>();
            try
            {
                var ItemData = _appContext.Items.Where(x => x.Id == ItemId).FirstOrDefault();
                var purchase = _appContext.PurchageItemXrefs.Where(x => x.ItemId == ItemId).ToList();
                if (purchase != null)
                {
                    var res = _appContext.PurchageOrders.Where(x => purchase.Select(p => p.Id).Contains(x.Id)).ToList();
                    _appContext.PurchageOrders.RemoveRange(res);
                    _appContext.PurchageItemXrefs.RemoveRange(purchase);
                    _appContext.Remove(ItemData);
                    _appContext.SaveChanges();
                }

                if (ItemData != null)
                {
                    response.Result = ItemData;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Item Deleted Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Item Found";
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
