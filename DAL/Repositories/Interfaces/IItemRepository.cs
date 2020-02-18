using DAL.Models;
using DAL.Response;
using System;
using System.Collections.Generic;
using System.Text;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace DAL.Repositories.Interfaces
{
  public  interface IItemRepository
    {
        ListDataResponse<GetItemResponse> GetAllItems();

        ValueDataResponse<Item> AddItemDetials(Item items);
        ValueDataResponse<Item> UpdateItem(Item items);

        ValueDataResponse<Item> DeleteItem(int ItemId);

    }
}
