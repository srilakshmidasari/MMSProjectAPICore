﻿using DAL.Models;
using DAL.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.Interfaces
{
   public interface ISupplierRepository
    {

        ListDataResponse<Supplier> GetAllSupplier();
        ValueDataResponse<Supplier> AddSupplierDetials(Supplier suppliers);
        ValueDataResponse<Supplier> UpdateSupplierDetials(Supplier suppliers);

        ValueDataResponse<Supplier> DeleteSupplierByID(int SupplierId);
    }
}
