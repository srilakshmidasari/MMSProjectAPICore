using DAL.Models;
using DAL.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.Interfaces
{
    public interface IMasterRepository
    {
        ListDataResponse<TypeCdDmt> GetAllTypeCddmtdetails(int ClassTypeId);
    }
}
