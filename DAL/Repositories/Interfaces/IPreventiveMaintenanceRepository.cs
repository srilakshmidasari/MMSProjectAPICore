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

        ListDataResponse<GetPMAssetResponse> GetPMAssetsbyPMId(int Id);

        ValueDataResponse<PreventiveMaintenance> InsertPreventiveMaintenance(UpsertPreventiveMaintenance PmOrder);

        ValueDataResponse<PreventiveMaintenance> UpdatePreventiveMaintenance(UpsertPreventiveMaintenance PmOrder);
        
        ValueDataResponse<PreventiveMaintenance> DeletePreventiveMaintenance(int PmId);

       // ListDataResponse<GetPMAssetResponse> getAssetsByPM(int PmId);


        //  ValueDataResponse<WorkOrder> ApprovePreventiveMaintenance(UpsertWorkOrder workorder);



    }
}
