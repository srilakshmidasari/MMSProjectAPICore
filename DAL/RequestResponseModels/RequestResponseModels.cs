﻿using DAL.Models;
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

        public class AddLookUp : AuditableEntity
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

        public class GetUserProjects
        {
            public int Id { get; set; }
            public string Name1 { get; set; }
            public string Name2 { get; set; }
            public string ProjectReference { get; set; }

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
            public string AssetSize { get; set; }
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
            public int? AstCounter { get; set; }
            public int? DaysApplicable { get; set; }
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
            public string AssetSize { get; set; }
            public int? AstCounter { get; set; }
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
            public int? DaysApplicable { get; set; }
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


        public class UpsertSupplier : AuditableEntity
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
            public int ProjectId { get; set; }
            public string ProjectName { get; set; }
            public string PdfUrl { get; set; }
            public int StoreId { get; set; }
            public string StoreName { get; set; }
            public string Remarks { get; set; }
            public string BillingAddress { get; set; }
            public string ShippingAddress { get; set; }
            public int StatusTypeId { get; set; }
            public DateTime ArrivingDate { get; set; }
            public bool IsActive { get; set; }
            public string FileName { get; set; }
            public string FileLocation { get; set; }
            public string FileExtention { get; set; }
        }

        public class GetItemsResponse
        {
            public int Id { get; set; }
            public int PurchaseId { get; set; }
            public string ItemName { get; set; }
            public string ItemReference { get; set; }
            public string PurchaseReference { get; set; }
            public string Comments { get; set; }
            public int ItemId { get; set; }
            public int Quantity { get; set; }
            public double ExpectedCost { get; set; }
            public int? ReceivedQuantity { get; set; }
            public int? RemainingQuantity { get; set; }
            public double? ReceivedCost { get; set; }

        }



        public class PurchaseItem
        {
            public int Id { get; set; }
            public int ItemId { get; set; }
            public int PurchaseId { get; set; }
            public int Quantity { get; set; }
            public double ExpectdCost { get; set; }
            public string Comments { get; set; }

        }

        public class UpsertPurchaseOrder : AuditableEntity
        {
            public int Id { get; set; }
            public int SupplierId { get; set; }
            public string PurchaseReference { get; set; }
            public DateTime ArrivingDate { get; set; }
            public int StatusTypeId { get; set; }
            public int ProjectId { get; set; }
            public int StoreId { get; set; }
            public string Remarks { get; set; }
            public string FileName { get; set; }
            public string FileLocation { get; set; }
            public string FileExtention { get; set; }
            public string BillingAddress { get; set; }
            public string ShippingAddress { get; set; }
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

        public class GetWorkOrderReponse : AuditableEntity
        {
            public int Id { get; set; }
            public int AssetId { get; set; }
            public string AssetName { get; set; }
            public int SiteId { get; set; }
            public int? PMProcedureId { get; set; }
            public string PMProcedureName { get; set; }
            public string SiteName { get; set; }
            public int ProjectId { get; set; }
            public string ProjectName { get; set; }
            public int LocationId { get; set; }
            public string LocationName { get; set; }
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }
            public string Reference1 { get; set; }
            public string ExtraDetails { get; set; }
            public string Issue { get; set; }
            public string Resolution { get; set; }
            public int StatusTypeId { get; set; }
            public string StatusTypeName { get; set; }
            public int? WorkTypeId { get; set; }
            public string WorkTypeName { get; set; }
            public int? WorkStatusId { get; set; }
            public string WorkStatusName { get; set; }
            public int? WorkTechnicianId { get; set; }
            public string WorkTechnicianName { get; set; }
            public int? StoreId { get; set; }
            public string StoreName { get; set; }
            public int? WorkFaultId { get; set; }
            public string WorkFaultName { get; set; }
            public int OrderTypeId { get; set; }
            public int OrderTypeName { get; set; }
            public bool IsActive { get; set; }
        }

        public class UpsertWorkOrder : AuditableEntity
        {
            public int Id { get; set; }
            public int AssetId { get; set; }
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }
            public string Reference1 { get; set; }
            public string Extradetails { get; set; }
            public string Issue { get; set; }
            public string Resolution { get; set; }
            public int StatusTypeId { get; set; }
            public int? WorkTypeId { get; set; }
            public int? WorkStatusId { get; set; }
            public int? WorkTechnicianId { get; set; }
            public int? WorkFaultId { get; set; }
            public int? StoreId { get; set; }
            public int? PMProcedureId { get; set; }
            public int OrderTypeId { get; set; }
            public bool IsActive { get; set; }
            public List<WorkOrderItem> WorkOrderItems { get; set; }

        }

        public class WorkOrderItem
        {
            public int Id { get; set; }
            public int ItemId { get; set; }
            public int WorkOrderId { get; set; }
            public int Quantity { get; set; }

        }

        public class GetWorkItemsResponse
        {
            public int Id { get; set; }
            public int WorkOrderId { get; set; }
            public int ItemId { get; set; }
            public string ItemName { get; set; }
            public string ItemReference { get; set; }
            public int Quantity { get; set; }

        }

        public class UpsertInventory
        {
            public int Id { get; set; }
            public int PurchaseOrderId { get; set; }
            public int ItemId { get; set; }
            public int Quantity { get; set; }
            public double ReceivedCost { get; set; }

        }

        public class GetProjectsByUserIdandSiteIdRequest
        {
            public int SiteId { get; set; }
            public string UserId { get; set; }

        }

        public class AcceptWorkOrderRequest
        {
            public int WorkOrderId { get; set; }
            public int StatusTypeId { get; set; }

        }

        public class CloseWorkOrderRequest
        {
            public int WorkOrderId { get; set; }
            public int StatusTypeId { get; set; }
            public string Comments { get; set; }

        }

        public class GetInventoryItemsResponse
        {
            //public int Id { get; set; }
            //public int? PurchaseId { get; set; }
            public int ItemId { get; set; }
            public string ItemName { get; set; }
            public string ItemReference { get; set; }
            public string Description { get; set; }
            public string PurchaseReference { get; set; }
            public string ProjectName { get; set; }
            public string StoreName { get; set; }
            public int Quantity { get; set; }
        }

        public class SearchString
        {
            public string searchValue { get; set; }

            public int ProjectId { get; set; }
        }

        public class SearchAsset
        {
            public string searchValue { get; set; }

            public int LocationId { get; set; }
        }

        public class GetPreventiveMaintenanceResponse : AuditableEntity
        {
            public int Id { get; set; }
            public DateTime? StartDate { get; set; }
            public List<PMAssetXref> AssetId { get; set; }
            public string PreventiveRefId { get; set; }
            public string DurationInHours { get; set; }
           // public string DaysApplicable { get; set; }
            public int TypeOfMaintainanceId { get; set; }
            public int? Priority { get; set; }
            public int? JobPlanId { get; set; }
            public string TypeOfMaintainanceName { get; set; }
            public string Details { get; set; }
            public int StatusTypeId { get; set; }
            public string StatusTypeName { get; set; }
            public int TechnicianId { get; set; }
            public string TechnicianName { get; set; }
            public bool IsActive { get; set; }
        }

        public class UpsertPreventiveMaintenance : AuditableEntity
        {
            public int Id { get; set; }
            public List<UpsertPmAsset> pmAssets { get; set; }
            //  public int[] AssetIds { get; set; }
            public DateTime? StartDate { get; set; }
            public string PreventiveRefId { get; set; }
            public string DurationInHours { get; set; }
           // public string DaysApplicable { get; set; }
            public int? JobPlanId { get; set; }
            public int? Priority { get; set; }
            public string Details { get; set; }
            public int StatusTypeId { get; set; }
            public int TypeOfMaintenance { get; set; }
            public int WorkTechnicianId { get; set; }
            public bool IsActive { get; set; }

        }

        public class UpsertPmAsset
        {
            public int Id { get; set; }
            public int AssetId { get; set; }
            public int PreventiveMaintenanceId { get; set; }
            public DateTime? AstFixedDate { get; set; }
            public int? DaysApplicable { get; set; }
        }
        public class GetPMAssetResponse
        {
            public int AssetId { get; set; }
            public string AssetName { get; set; }
            public string AssetReference { get; set; }
            public int? DaysApplicable { get; set; }
            public int SiteId { get; set; }
            public string SiteName { get; set; }
            public int ProjectId { get; set; }
            public string ProjectName { get; set; }
            public int LocationId { get; set; }
            public string LocationName { get; set; }
            public DateTime AssetFixedDate { get; set; }
        }


        public class GetJobPlanResponse : AuditableEntity
        {
            public int Id { get; set; }
            public string JobReference { get; set; }
            public string Name { get; set; }
            public string JobDescription { get; set; }
            public int? SiteId { get; set; }
            public string SiteName { get; set; }
            public int? ProjectId { get; set; }
            public string ProjectName { get; set; }
            public int StatusTypeId { get; set; }
            public string StatusName { get; set; }
            public int? TechnicianId { get; set; }
            public string TechinicianName { get; set; }
            public int? AssetGroupId { get; set; }
            public string AssetGroupName { get; set; }
            public string Duration { get; set; }
            public List<JobTask> Tasks { get; set; }
            public bool IsActive { get; set; }

        }

        public class UpsertJobPlan : AuditableEntity
        {
            public int Id { get; set; }
            public string JobReference { get; set; }
            public string Name { get; set; }
            public string JobDescription { get; set; }
            public int? SiteId { get; set; }
            public int? ProjectId { get; set; }
            public int StatusTypeId { get; set; }
            public int? TechnicianId { get; set; }
            public int? AssetGroupId { get; set; }
            public string Duration { get; set; }
            public bool IsActive { get; set; }

            public List<JobPlanTask> JobPlanTasks { get; set; }
        }


        public class JobPlanTask
        {
            public int Id { get; set; }
            public int JobPlanId { get; set; }
            public string Name { get; set; }
            public string Duration { get; set; }
            public int AstTradeId { get; set; }
        }

        public class GetJobTaskResponse
        {
            public int Id { get; set; }
            public int JobPlanId { get; set; }
            public string Name { get; set; }
            public string Duration { get; set; }
            public int? AstTradeId { get; set; }
            public string AstTradeName { get; set; }

        }

        public class AssetProjectReq
        {
            public int ProjectId { get; set; }
            public int AstGroupId { get; set; }

        }

        public class OrdersTypeCount
        {
            public int OrderPlannedCount { get; set; }
            public int OrderCompletedCount { get; set; }
            public int OrderInProgressCount { get; set; }
        }

        public class TradeOrdersCount
        {
            public int ApprovedCount { get; set; }
            public int OpenCount { get; set; }
            public int ClosedCount { get; set; }
            public int RejectedCount { get; set; }
        }

        public class Dashboardreq
        {
            public int ProjectId { get; set; }
            public DateTime FromDate { get; set; }
            public DateTime ToDate { get; set; }
            public int WorkTypeId { get; set; }
        }

        public class TradeOrderreq
        {
            public int ProjectId { get; set; }
            public DateTime FromDate { get; set; }
            public DateTime ToDate { get; set; }
            public int WorkTypeId { get; set; }
            public int StatusTypeId { get; set; }

        }

        public class OrdersCount
        {
            public int PMOrdersCount { get; set; }
            public int NormalrdersCount { get; set; }

        }

        public class OrderReq
        {
            public int ProjectId { get; set; }
            public DateTime FromDate { get; set; }
            public DateTime ToDate { get; set; }
            
        }


    }
}
