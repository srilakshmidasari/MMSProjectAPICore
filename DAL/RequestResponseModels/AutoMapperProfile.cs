// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using AutoMapper;
using DAL.Core;
using DAL.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace DAL.RequestResponseModels
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<ApplicationUser, UserViewModel>()
                  .ForMember(d => d.Roles, map => map.Ignore());
            CreateMap<UserViewModel, ApplicationUser>()
                .ForMember(d => d.Roles, map => map.Ignore())
                .ForMember(d => d.Id, map => map.Condition(src => src.Id != null));

            CreateMap<ApplicationUser, UserEditViewModel>()
                .ForMember(d => d.Roles, map => map.Ignore());


            CreateMap<ApplicationUser, UserFileViewModel>()
                .ForMember(d => d.Roles, map => map.Ignore());


            CreateMap<UserFileViewModel, ApplicationUser>()
                .ForMember(d => d.Roles, map => map.Ignore())
                .ForMember(d => d.Id, map => map.Condition(src => src.Id != null));

            CreateMap<ApplicationUser, UserResViewModel>();
            

            CreateMap<UserEditViewModel, ApplicationUser>()
                .ForMember(d => d.Roles, map => map.Ignore())
                .ForMember(d => d.Id, map => map.Condition(src => src.Id != null));

            CreateMap<ApplicationUser, UserPatchViewModel>()
                .ReverseMap();

            CreateMap<ApplicationRole, RoleViewModel>()
                .ForMember(d => d.Permissions, map => map.MapFrom(s => s.Claims))
                .ForMember(d => d.UsersCount, map => map.MapFrom(s => s.Users != null ? s.Users.Count : 0))
                .ReverseMap();
            CreateMap<RoleViewModel, ApplicationRole>()
                .ForMember(d => d.Id, map => map.Condition(src => src.Id != null));

            CreateMap<IdentityRoleClaim<string>, ClaimViewModel>()
                .ForMember(d => d.Type, map => map.MapFrom(s => s.ClaimType))
                .ForMember(d => d.Value, map => map.MapFrom(s => s.ClaimValue))
                .ReverseMap();

            CreateMap<ApplicationPermission, PermissionViewModel>()
                .ReverseMap();

            CreateMap<IdentityRoleClaim<string>, PermissionViewModel>()
                .ConvertUsing(s => (PermissionViewModel)ApplicationPermissions.GetPermissionByValue(s.ClaimValue));

            CreateMap<UpsertSite, SiteInfo>();

            CreateMap<UpsertProject, Project>();

         //   CreateMap<UpsertSite, SiteInfo>();


            CreateMap<AddLookUp, LookUp>();

            CreateMap<UpsertProjectRepository, ProjectRepository>();
            
            CreateMap<AddLocation, Location>();
            CreateMap<UpsertAssetGroup, AssetGroup>();

            CreateMap<UpsertAssetLocation, AssetLocation>()
                //.ForMember(d => d.Project, map => map.Ignore())
                //.ForMember(d => d.SiteInfo_Id, map => map.Ignore())
                .ForMember(d => d.AstGroup_Id, map => map.Ignore())
                .ForMember(d => d.Location_Id, map => map.Ignore())
                .ForMember(d => d.AstTrade_Id, map => map.Ignore());

            //.ForMember(d => d.Id, map => map.Condition(src => src.Id != null));

            CreateMap<UpsertSupplier, Supplier>();
            

            CreateMap<UpsertItem, Item>()
                 .ForMember(d => d.UOM_Id, map => map.Ignore())
                  .ForMember(d => d.ItemCategory_Id, map => map.Ignore());
            
            CreateMap<UpsertPurchaseOrder, PurchageOrder>()
                 .ForMember(d => d.Supplier_Id, map => map.Ignore())
                 .ForMember(d => d.StatusType_Id, map => map.Ignore())
                 .ForMember(d => d.Project_Id, map => map.Ignore())
                 .ForMember(d => d.Store_Id, map => map.Ignore());

            CreateMap<UpsertWorkOrder, WorkOrder>()
                .ForMember(d => d.Asset_Id, map => map.Ignore())
                .ForMember(d => d.StatusType_Id, map => map.Ignore())
                .ForMember(d => d.WorkFault_Id, map => map.Ignore())
                .ForMember(d => d.WorkStatus_Id, map => map.Ignore())
                .ForMember(d => d.WorkTechnician_Id, map => map.Ignore())
                .ForMember(d => d.WorkType_Id, map => map.Ignore())
                .ForMember(d => d.Store_Id, map => map.Ignore());

            CreateMap<UpsertInventory, Inventory>()
                 .ForMember(d => d.Item_Id, map => map.Ignore())
                 .ForMember(d => d.PurchaseOrder_Id, map => map.Ignore());

            CreateMap<UpsertPreventiveMaintenance, PreventiveMaintenance>()
              .ForMember(d => d.Asset_Id, map => map.Ignore())
              .ForMember(d => d.StatusType_Id, map => map.Ignore())
              .ForMember(d => d.TypeOfMaintenance_Id, map => map.Ignore())
              .ForMember(d => d.WorkTechnician_Id, map => map.Ignore());
              
             

            

        }
    }
}
