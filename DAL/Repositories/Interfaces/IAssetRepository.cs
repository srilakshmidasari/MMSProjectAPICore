using DAL.Models;
using DAL.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.Interfaces
{
    public interface IAssetRepository
    {
        ListDataResponse<AssetGroup> GetAssetRepositories();
        ValueDataResponse<AssetGroup> InsertAssetGroup(AssetGroup asset);

        ValueDataResponse<AssetGroup> UpdateAssetGroup(AssetGroup asset);

        ValueDataResponse<AssetGroup> DeleteAssetGroup(int assetId);
    }
}
