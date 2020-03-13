using DAL.Models;
using DAL.Response;
using System;
using System.Collections.Generic;
using System.Text;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace DAL.Repositories.Interfaces
{
    public interface IPreventiveMaintenanceRepository
    {
        ListDataResponse<GetPreventiveMaintenanceResponse> GetAllPreventiveMaintenances();

        ValueDataResponse<PreventiveMaintenance> InsertPreventiveMaintenance(UpsertPreventiveMaintenance PmOrder);

        ValueDataResponse<PreventiveMaintenance> UpdatePreventiveMaintenance(UpsertPreventiveMaintenance PmOrder);
    }
}
