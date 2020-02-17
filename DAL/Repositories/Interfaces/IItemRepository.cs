using DAL.Models;
using DAL.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.Interfaces
{
  public  interface IItemRepository
    {
        ListDataResponse<Item> GetAllItems();

        ValueDataResponse<Item> AddItemDetials(Item items);
    }
}
