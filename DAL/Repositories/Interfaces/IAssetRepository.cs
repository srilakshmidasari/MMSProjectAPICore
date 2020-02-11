using DAL.Models;
using DAL.Response;
using System;
using System.Collections.Generic;
using System.Text;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace DAL.Repositories.Interfaces
{
    public interface IAssetRepository
    {
        // Asset Group Services
        ListDataResponse<AssetGroup> GetAssetGroups();
        ValueDataResponse<AssetGroup> InsertAssetGroup(AssetGroup asset);

        ValueDataResponse<AssetGroup> UpdateAssetGroup(AssetGroup asset);

        ValueDataResponse<AssetGroup> DeleteAssetGroup(int assetId);

        // Asset Location Services
        ListDataResponse<GetAssetLocationResponse> GetAssetLocations();

        ValueDataResponse<AssetLocation> InsertAssetLocation(AssetLocation asset);
        ValueDataResponse<AssetLocation> UpdateAssetLocation(AssetLocation asset);

        ValueDataResponse<AssetLocation> DeleteAssetLocation(int assetId);
        ListDataResponse<AssetGroup> GetAssetGroupDetilasById(int assetId);
    }
}
