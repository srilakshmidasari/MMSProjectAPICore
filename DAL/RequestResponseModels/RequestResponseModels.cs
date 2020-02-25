using DAL.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DAL.RequestResponseModels
{
    public class RequestResponseModels
    {
        public class UpsertSite : AuditableEntity
        {

            public int Id { get; set; }
            public string SiteReference { get; set; }
            public string Name1 { get; set; }
            public string Name2 { get; set; }
            public string FileName { get; set; }
            public string FileLocation { get; set; }
            public string FileExtention { get; set; }
            public string Address { get; set; }
            public double Latitude { get; set; }
            public double Longitude { get; set; }
            public bool IsActive { get; set; }
            public string SiteManager { get; set; }
        }

        public class UpsertRepository : AuditableEntity
        {
            public int RepositoryId { get; set; }
            public string UserId { get; set; }
            public string FileName { get; set; }
            public string FileLocation { get; set; }
            public string FileExtention { get; set; }
            public int DocumentTypeId { get; set; }


        }

        public class UpsertProjectRepository 
        {
            public int ProjectRepositoryId { get; set; }
            public int ProjectId { get; set; }
            public string FileName { get; set; }
            public string FileLocation { get; set; }
            public string FileExtention { get; set; }
            public int DocumentTypeId { get; set; }
            public string CreatedBy { get; set; }
            public DateTime CreatedDate { get; set; }
            public string UpdatedBy { get; set; }
            public DateTime UpdatedDate { get; set; }
        }

        public class coordinates
        {
            public double Latitude { get; set; }
            public double Longitude { get; set; }
        }

        public class FileRepositoryResposnse 
        {
            public int RepositoryId { get; set; }
            public string UserId { get; set; }
            public string FileName { get; set; }
            public string FileLocation { get; set; }
            public string FileExtention { get; set; }
            public int? DocumentType { get; set; }
            public string FileTypeName { get; set; }
        }

        public class ProjectRepositoryResposnse
        {
            public int RepositoryId { get; set; }
            public int ProjectId { get; set; }
            public string FileName { get; set; }
            public string FileLocation { get; set; }
            public string FileExtention { get; set; }
            public int? DocumentType { get; set; }
            public string FileTypeName { get; set; }
        }

        public class AssetRepositoryResposnse
        {
            public int RepositoryId { get; set; }
            public int AssetId { get; set; }
            public string FileName { get; set; }
            public string FileLocation { get; set; }
            public int? DocumentType { get; set; }
            public string FileExtention { get; set; }
            public string FileTypeName { get; set; }
        }

        public class GetProjectResponse
        {
            public int Id { get; set; }
            public int SiteId { get; set; }
            public List<LookUpProjectXref> StoreId { get; set; }
            public string ProjectReference { get; set; }
            //public string StoreName1 { get; set; }

            //public string StoreName2 { get; set; }
            public string SiteName1 { get; set; }
            public string SiteName2 { get; set; }
            public string Name1 { get; set; }
            public string Name2 { get; set; }
            public string ProjectDetails { get; set; }
            public bool IsActive { get; set; }
            public string CreatedBy { get; set; }
            public DateTime CreatedDate { get; set; }
            public string UpdatedBy { get; set; }
            public DateTime UpdatedDate { get; set; }
            public List<UpsertProjectRepository> ProjectRepositories { get; set; }
        }

        public class GetProjectData
        {
            public int Id { get; set; }
            public int SiteId { get; set; }
            public string ProjectReference { get; set; }
            public string SiteName1 { get; set; }
            public string SiteName2 { get; set; }
            public string Name1 { get; set; }
            public string Name2 { get; set; }
            public string ProjectDetails { get; set; }
            public bool IsActive { get; set; }
            public string CreatedBy { get; set; }
            public DateTime CreatedDate { get; set; }
            public string UpdatedBy { get; set; }
            public DateTime UpdatedDate { get; set; }
        }

        public class UpsertProject : AuditableEntity
        {
            public int Id { get; set; }
            public int SiteId { get; set; }
            public int[] StoreIds { get; set; }
            public string ProjectReference { get; set; }
            public string Name1 { get; set; }
            public string Name2 { get; set; }
            public string ProjectDetails { get; set; }
            public bool IsActive { get; set; }
            public List<UpsertProjectRepository> ProjectRepositories { get; set; }
        }

        public class AddLookUp: AuditableEntity
        {
            public int Id { get; set; }
            public int LookUpTypeId { get; set; }
            public string Name1 { get; set; }
            public string Name2 { get; set; }
            public string Remarks { get; set; }
            public bool IsActive { get; set; }
           
        }

        public class GetLoopUpResponse : AuditableEntity
        {
            public int Id { get; set; }
            public int LookUpTypeId { get; set; }
            public string Name1 { get; set; }
            public string Name2 { get; set; }
            public string Remarks { get; set; }
            public bool IsActive { get; set; }
           
        }

        public class LookupDataResponse
        {
            public int Id { get; set; }
            public int LookUpTypeId { get; set; }
            public string Name1 { get; set; }
            public string Name2 { get; set; }
            public string Remarks { get; set; }
            public bool IsActive { get; set; }
            public string CreatedBy { get; set; }
            public DateTime CreatedDate { get; set; }
            public string UpdatedBy { get; set; }
            public DateTime UpdatedDate { get; set; }
            public string Description { get; set; }
            public string CreatedByUser { get; set; }
            public string UpdatedByUser { get; set; }         
        }

        public class AddLocation
        {
            public int Id { get; set; }
            public int SiteId { get; set; }
            public int ProjectId { get; set; }
            public string Name1 { get; set; }
            public string Name2 { get; set; }
            public string LocationReference { get; set; }
            public bool IsActive { get; set; }
            public string CreatedBy { get; set; }
            public DateTime CreatedDate { get; set; }
            public string UpdatedBy { get; set; }
            public DateTime UpdatedDate { get; set; }

        }

       

        public class LocationDataResponse
        {
            public int Id { get; set; }
            public int SiteId { get; set; }
            public int ProjectId { get; set; }
            public string Name1 { get; set; }
            public string Name2 { get; set; }
            public string LocationReference { get; set; }
            public string Remarks { get; set; }
            public bool IsActive { get; set; }
            public string CreatedBy { get; set; }
            public DateTime CreatedDate { get; set; }
            public string UpdatedBy { get; set; }
            public DateTime UpdatedDate { get; set; }
            public string SiteName1 { get; set; }
            public string SiteName2 { get; set; }
            public string ProjectName1 { get; set; }
            public string ProjectName2 { get; set; }


        }

        public class UpsertAssetGroup
        {
            public int Id { get; set; }
            public string Name1 { get; set; }
            public string Name2 { get; set; }
            public string AssetRef1 { get; set; }
            public string AssetRef2 { get; set; }
            public string AssetMake { get; set; }
            public string AssetModel { get; set; }
            public string AssetCapacity { get; set; }
            public string AssetType { get; set; }          
            public bool IsActive { get; set; }
            public string CreatedBy { get; set; }
            public DateTime CreatedDate { get; set; }
            public string UpdatedBy { get; set; }
            public DateTime UpdatedDate { get; set; }

        }

        public class GetAssetLocationResponse
        {
            public int Id { get; set; }
            public int SiteId { get; set; }
            public string SiteName1 { get; set; }
            public string SiteName2 { get; set; }
            public int ProjectId { get; set; }
            public string ProjectName1 { get; set; }
            public string ProjectName2 { get; set; }
            public int AstTradeId { get; set; }
            public string AstTradeName1 { get; set; }
            public string AstTradeName2 { get; set; }
            public int AstGroupId { get; set; }
            public string AstGroupName1 { get; set; }
            public string AstGroupName2 { get; set; }
            public string AssetGroupRef1 { get; set; }
            public string AssetRef2 { get; set; }
            public string AssetMake { get; set; }
            public string AssetModel { get; set; }
            public string AssetCapacity { get; set; }
            public string AssetType { get; set; }
            public int LocationId { get; set; }
            public string LocationName1 { get; set; }
            public string LocationName2 { get; set; }
            public string Name1 { get; set; }
            public string Name2 { get; set; }
            public string AssetLocationRef { get; set; }
            public int AstCounter { get; set; }
            public DateTime AstFixedDate { get; set; }
            //public string FileName { get; set; }
            //public string FileLocation { get; set; }
            //public string FileExtention { get; set; }
            public bool IsActive { get; set; }
            public string CreatedBy { get; set; }
            public DateTime CreatedDate { get; set; }
            public string UpdatedBy { get; set; }
            public DateTime UpdatedDate { get; set; }
        }

        public class UpsertAssetLocation
        {
            public int Id { get; set; }
            public int SiteId { get; set; }
            public int ProjectId { get; set; }
            public int AstTradeId { get; set; }
            public int AstGroupId { get; set; }
            public int LocationId { get; set; }
            public string Name1 { get; set; }
            public string Name2 { get; set; }
            public string AssetRef { get; set; }
            public string AssetRef2 { get; set; }
            public int AstCounter { get; set; }
            public DateTime AstFixedDate { get; set; }
            public string AssetMake { get; set; }
            public string AssetModel { get; set; }
            public string AssetCapacity { get; set; }
            public string AssetType { get; set; }
            public bool IsActive { get; set; }
            public string CreatedBy { get; set; }
            public DateTime CreatedDate { get; set; }
            public string UpdatedBy { get; set; }
            public DateTime UpdatedDate { get; set; }
            public List<UpsertAssetRepository> AssetRepositories { get; set; }
        }


        public class UpsertAssetRepository
        {
            public int AssetRpositoryId { get; set; }
            public int AssetId { get; set; }
            public string FileName { get; set; }
            public string FileLocation { get; set; }
            public string FileExtention { get; set; }
            public int? DocumentTypeId { get; set; }
            public string CreatedBy { get; set; }
            public DateTime CreatedDate { get; set; }
            public string UpdatedBy { get; set; }
            public DateTime UpdatedDate { get; set; }
        }
        

        public class UpsertSupplier: AuditableEntity
        {
            public int Id { get; set; }
            public string SupplierReference { get; set; }
            public string Name1 { get; set; }
            public string Name2 { get; set; }
            public string Address { get; set; }
            public string Email { get; set; }
            public string ContactNumber { get; set; }
            public string Note { get; set; }
            public bool IsActive { get; set; }
            public string FileName { get; set; }
            public string FileLocation { get; set; }
            public string FileExtention { get; set; }
          
          
        }

        public class UpsertItem : AuditableEntity
        {
            public int Id { get; set; }
            public string ItemReference { get; set; }
            public int ItemCategory { get; set; }
            public int ItemType { get; set; }
            public string Name1 { get; set; }
            public string Name2 { get; set; }
            public string Description { get; set; }
            public int AverageCost { get; set; }
            public int UOMId { get; set; }
            public string UnitOfConversion { get; set; }
            public string Units { get; set; }
            public bool IsActive { get; set; }

        }

        public class GetItemResponse : AuditableEntity
        {
            public int Id { get; set; }
            public string ItemReference { get; set; }
            public int ItemCategory { get; set; }
            public int ItemTypeId { get; set; }
            public string ItemTypeName { get; set; }
            public string CategoryName { get; set; }
            public string Name1 { get; set; }
            public string Name2 { get; set; }
            public string Description { get; set; }
            public int AverageCost { get; set; }
            public int UOMId { get; set; }
            public string UOMName { get; set; }
            public string UnitOfConversion { get; set; }
            public string Units { get; set; }
            public bool IsActive { get; set; }

        }

        public class GetPurchageResponse : AuditableEntity
        {
            public int Id { get; set; }
            public int SupplierId { get; set; }
            public string SupplierName { get; set; }
            public string SupplierAddress { get; set; }
            public string PurchaseReference { get; set; }
            public string StatusName { get; set; }
            public int StatusTypeId { get; set; }
            public DateTime ArrivingDate { get; set; }
            public bool IsActive { get; set; }

        }

        public class GetItemsResponse 
        {
            public int Id { get; set; }
            public int PurchaseId { get; set; }
            public string ItemName { get; set; }
            public string  ItemReference { get; set; }
            public string PurchaseReference { get; set; }
            public int  ItemId { get; set; }
            public int Quantity { get; set; }
            public double ExpectedCost { get; set; }  

        }

        public class PurchaseItem
        {
            public int Id { get; set; }
            public int ItemId { get; set; }
            public int PurchaseId { get; set; }
            public int Quantity { get; set; }
            public double ExpectdCost { get; set; }
            public string PurchaseReference { get; set; }

        }

        public class UpsertPurchaseOrder : AuditableEntity
        {
            public int Id { get; set; }
            public int SupplierId { get; set; }
            public string PurchaseReference { get; set; }
            public DateTime ArrivingDate { get; set; }
            public int StatusTypeId { get; set; }
            public string FileName { get; set; }
            public string FileLocation { get; set; }
            public string FileExtention { get; set; }
            public bool IsActive { get; set; }
            public List<PurchaseItem> PurchaseItems { get; set; }

        }

        public class GetPurchagePdfResponse : AuditableEntity
        {
            public int Id { get; set; }
            public int SupplierId { get; set; }
            public string SupplierName { get; set; }
            public string SupplierAddress { get; set; }
            public string PhoneNumber { get; set; }
            public string PurchaseReference { get; set; }
            public DateTime ArrivingDate { get; set; }
            public bool IsActive { get; set; }

        }



    }
}
