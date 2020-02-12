// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.ObjectModel;

namespace DAL.Core
{
    public static class ApplicationPermissions
    {
        public static ReadOnlyCollection<ApplicationPermission> AllPermissions;


        public const string UsersPermissionGroupName = "User Permissions";
        public static ApplicationPermission ViewUsers = new ApplicationPermission("View Users", "users.view", UsersPermissionGroupName, "Permission to view other users account details");
       public static ApplicationPermission ManageUsers = new ApplicationPermission("Manage Users", "users.manage", UsersPermissionGroupName, "Permission to create, delete and modify other users account details");
        //public static ApplicationPermission AddUpdateUsers = new ApplicationPermission("Add Update Users", "users.addupdate", UsersPermissionGroupName, "Permission to create and modify other users account details");
        public static ApplicationPermission AddUsers = new ApplicationPermission("Add  Users", "users.add", UsersPermissionGroupName, "Permission to create  other users account details");
        public static ApplicationPermission EditUsers = new ApplicationPermission("Edit Users", "users.edit", UsersPermissionGroupName, "Permission to Update other users account details");
        public static ApplicationPermission DeleteUsers = new ApplicationPermission("Delete Users", "users.delete", UsersPermissionGroupName, "Permission to Delete other users account details");

        public const string RolesPermissionGroupName = "Role Permissions";
        public static ApplicationPermission ViewRoles = new ApplicationPermission("View Roles", "roles.view", RolesPermissionGroupName, "Permission to view available roles");
        public static ApplicationPermission ManageRoles = new ApplicationPermission("Manage Roles", "roles.manage", RolesPermissionGroupName, "Permission to create, delete and modify roles");
        public static ApplicationPermission AssignRoles = new ApplicationPermission("Assign Roles", "roles.assign", RolesPermissionGroupName, "Permission to assign roles to users");
        //public static ApplicationPermission AddUpdateRoles = new ApplicationPermission("Add Update Roles", "roles.addupdate", RolesPermissionGroupName, "Permission to create and modify roles");
       // public static ApplicationPermission AddRoles = new ApplicationPermission("Add  Roles", "roles.add", RolesPermissionGroupName, "Permission to create  other roles  details");
       // public static ApplicationPermission EditRoles = new ApplicationPermission("Edit Roles", "roles.edit", RolesPermissionGroupName, "Permission to Update other roles  details");
       // public static ApplicationPermission DeleteRoles = new ApplicationPermission("Delete Roles", "roles.delete", RolesPermissionGroupName, "Permission to Delete other roles  details");


        public const string SitesPermissionGroupName = "Site Permissions";
        public static ApplicationPermission ViewSites = new ApplicationPermission("View Sites", "sites.view", SitesPermissionGroupName, "Permission to view other sites details");
       // public static ApplicationPermission ManageSites = new ApplicationPermission("Manage Sites", "sites.manage", SitesPermissionGroupName, "Permission to create, delete and modify other sites details");
      //  public static ApplicationPermission AddUpdateSites = new ApplicationPermission("Add Update Sites", "sites.addupdate", SitesPermissionGroupName, "Permission to create and modify other sites details");
        public static ApplicationPermission AddSites = new ApplicationPermission("Add  Sites", "sites.add", SitesPermissionGroupName, "Permission to create  other sites  details");
        public static ApplicationPermission EditSites = new ApplicationPermission("Edit Sites", "sites.edit", SitesPermissionGroupName, "Permission to update other sites  details");
        public static ApplicationPermission DeleteSites = new ApplicationPermission("Delete Sites", "sites.delete", SitesPermissionGroupName, "Permission to delete other sites  details");


        public const string ProjectsPermissionGroupName = "Project Permissions";
        public static ApplicationPermission ViewProjects = new ApplicationPermission("View Projects", "projects.view", ProjectsPermissionGroupName, "Permission to view other projects details");
      //  public static ApplicationPermission ManageProjects = new ApplicationPermission("Manage Projects", "projects.manage", ProjectsPermissionGroupName, "Permission to create, delete and modify other projects details");
       // public static ApplicationPermission AddUpdateProjects = new ApplicationPermission("Add Update Projects", "projects.addupdate", ProjectsPermissionGroupName, "Permission to create and modify other projects details");
        public static ApplicationPermission AddProjects = new ApplicationPermission("Add  Projects", "projects.add", ProjectsPermissionGroupName, "Permission to create  other projects  details");
        public static ApplicationPermission EditProjects = new ApplicationPermission("Edit Projects", "projects.edit", ProjectsPermissionGroupName, "Permission to update other projects  details");
        public static ApplicationPermission DeleteProjects = new ApplicationPermission("Delete Projects", "projects.delete", ProjectsPermissionGroupName, "Permission to delete other projects  details");


        public const string StoresPermissionGroupName = "Store Permissions";
        public static ApplicationPermission ViewStores = new ApplicationPermission("View Stores", "stores.view", StoresPermissionGroupName, "Permission to view other stores details");
       // public static ApplicationPermission ManageStores = new ApplicationPermission("Manage Stores", "stores.manage", StoresPermissionGroupName, "Permission to create, delete and modify other stores details");
      //  public static ApplicationPermission AddUpdateStores = new ApplicationPermission("Add Update Stores", "stores.addupdate", StoresPermissionGroupName, "Permission to create and modify other stores details");
        public static ApplicationPermission AddStores = new ApplicationPermission("Add  Stores", "stores.add", StoresPermissionGroupName, "Permission to create  other stores  details");
        public static ApplicationPermission EditStores = new ApplicationPermission("Edit Stores", "stores.edit", StoresPermissionGroupName, "Permission to update other stores  details");
        public static ApplicationPermission DeleteStores = new ApplicationPermission("Delete Stores", "stores.delete", StoresPermissionGroupName, "Permission to delete other stores  details");

        public const string LocationsPermissionGroupName = "Location Permissions";
        public static ApplicationPermission ViewLocations = new ApplicationPermission("View Locations", "locations.view", LocationsPermissionGroupName, "Permission to view other locations details");
    //    public static ApplicationPermission ManageStores = new ApplicationPermission("Manage Locations", "stores.manage", LocationsPermissionGroupName, "Permission to create, delete and modify other locations details");
      //  public static ApplicationPermission AddUpdateStores = new ApplicationPermission("Add Update Locations", "stores.addupdate", LocationsPermissionGroupName, "Permission to create and modify other locations details");
        public static ApplicationPermission AddLocations = new ApplicationPermission("Add  Locations", "locations.add", LocationsPermissionGroupName, "Permission to create  other locations  details");
        public static ApplicationPermission EditLocations = new ApplicationPermission("Edit Locations", "locations.edit", LocationsPermissionGroupName, "Permission to update other locations  details");
        public static ApplicationPermission DeleteLocations = new ApplicationPermission("Delete Locations", "locations.delete", LocationsPermissionGroupName, "Permission to delete other locations  details");

        public const string AssetGroupsPermissionGroupName = "AssetGroup Permissions";
        public static ApplicationPermission ViewAssetGroups = new ApplicationPermission("View AssetGroups", "assetgroups.view", AssetGroupsPermissionGroupName, "Permission to view other assetgroups details");
   //     public static ApplicationPermission ManageAssetGroups = new ApplicationPermission("Manage AssetGroups", "assetgroups.manage", AssetGroupsPermissionGroupName, "Permission to create, delete and modify other assetgroups details");
     //   public static ApplicationPermission AddUpdateAssetGroups = new ApplicationPermission("Add Update AssetGroups", "assetgroups.addupdate", AssetGroupsPermissionGroupName, "Permission to create and modify other assetgroups details");
        public static ApplicationPermission AddAssetGroups = new ApplicationPermission("Add  AssetGroups", "assetgroups.add", AssetGroupsPermissionGroupName, "Permission to create  other assetgroups  details");
        public static ApplicationPermission EditAssetGroups = new ApplicationPermission("Edit AssetGroups", "assetgroups.edit", AssetGroupsPermissionGroupName, "Permission to update other assetgroups  details");
        public static ApplicationPermission DeleteAssetGroups = new ApplicationPermission("Delete AssetGroups", "assetgroups.delete", AssetGroupsPermissionGroupName, "Permission to delete other assetgroups  details");


        public const string AssetsPermissionGroupName = "Assets Permissions";
        public static ApplicationPermission ViewAssets = new ApplicationPermission("View Assets", "assets.view", AssetsPermissionGroupName, "Permission to view other assetlocations details");
        //public static ApplicationPermission ManageAssetGroups = new ApplicationPermission("Manage AssetLocations", "assetlocations.manage", AssetLocationsPermissionGroupName, "Permission to create, delete and modify other assetlocations details");
        //public static ApplicationPermission AddUpdateAssetGroups = new ApplicationPermission("Add Update AssetLocations", "assetlocations.addupdate", AssetLocationsPermissionGroupName, "Permission to create and modify other assetlocations details");
        public static ApplicationPermission AddAssets = new ApplicationPermission("Add  Assets", "assets.add", AssetsPermissionGroupName, "Permission to create  other assetlocations  details");
        public static ApplicationPermission EditAssets = new ApplicationPermission("Edit Assets", "assets.edit", AssetsPermissionGroupName, "Permission to update other assetlocations  details");
        public static ApplicationPermission DeleteAssets= new ApplicationPermission("Delete Assets", "assets.delete", AssetsPermissionGroupName, "Permission to delete other assetlocations  details");



        static ApplicationPermissions()
        {
            List<ApplicationPermission> allPermissions = new List<ApplicationPermission>()
            {
                ViewUsers,
                ManageUsers,
              //AddUpdateUsers,
                AddUsers,
                EditUsers,
                DeleteUsers,


                ViewRoles,
              ManageRoles,
                AssignRoles,
           //  AddUpdateRoles,
              // AddRoles,
              // EditRoles,
              // DeleteRoles,

                ViewSites,
             //  ManageSites,
               //AddUpdateSites,
                AddSites,
                EditSites,
                DeleteSites,


               ViewProjects,
              // ManageProjects,
              // AddUpdateProjects,
               AddProjects,
               EditProjects,
               DeleteProjects,

                ViewStores,
             //   ManageStores,
                //AddUpdateStores
                AddStores,
                EditStores,
                DeleteStores,

                ViewLocations,
                AddLocations,
                EditLocations,
                DeleteLocations,

                ViewAssetGroups,
                AddAssetGroups,
                EditAssetGroups,
                DeleteAssetGroups,

                ViewAssets,
                AddAssets,
                EditAssets,
                DeleteAssets,
            };

            AllPermissions = allPermissions.AsReadOnly();
        }

        public static ApplicationPermission GetPermissionByName(string permissionName)
        {
            return AllPermissions.Where(p => p.Name == permissionName).SingleOrDefault();
        }

        public static ApplicationPermission GetPermissionByValue(string permissionValue)
        {
            return AllPermissions.Where(p => p.Value == permissionValue).SingleOrDefault();
        }

        public static string[] GetAllPermissionValues()
        {
            return AllPermissions.Select(p => p.Value).ToArray();
        }

        public static string[] GetAdministrativePermissionValues()
            //ManageUsers, ManageRoles,
        {
            return new string[] {  ManageUsers, ManageRoles, AssignRoles };
        }
    }



    public class ApplicationPermission
    {
        public ApplicationPermission()
        { }

        public ApplicationPermission(string name, string value, string groupName, string description = null)
        {
            Name = name;
            Value = value;
            GroupName = groupName;
            Description = description;
        }



        public string Name { get; set; }
        public string Value { get; set; }
        public string GroupName { get; set; }
        public string Description { get; set; }


        public override string ToString()
        {
            return Value;
        }


        public static implicit operator string(ApplicationPermission permission)
        {
            return permission.Value;
        }
    }
}
