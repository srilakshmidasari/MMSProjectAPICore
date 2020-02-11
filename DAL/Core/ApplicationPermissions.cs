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
        public static ApplicationPermission AddUpdateUsers = new ApplicationPermission("Add Update Users", "users.addupdate", UsersPermissionGroupName, "Permission to create and modify other users account details");


        public const string RolesPermissionGroupName = "Role Permissions";
        public static ApplicationPermission ViewRoles = new ApplicationPermission("View Roles", "roles.view", RolesPermissionGroupName, "Permission to view available roles");
        public static ApplicationPermission ManageRoles = new ApplicationPermission("Manage Roles", "roles.manage", RolesPermissionGroupName, "Permission to create, delete and modify roles");
        public static ApplicationPermission AssignRoles = new ApplicationPermission("Assign Roles", "roles.assign", RolesPermissionGroupName, "Permission to assign roles to users");
        public static ApplicationPermission AddUpdateRoles = new ApplicationPermission("Add Update Roles", "roles.addupdate", RolesPermissionGroupName, "Permission to create and modify roles");



        public const string SitesPermissionGroupName = "Site Permissions";
        public static ApplicationPermission ViewSites = new ApplicationPermission("View Sites", "sites.view", SitesPermissionGroupName, "Permission to view other sites details");
        public static ApplicationPermission ManageSites = new ApplicationPermission("Manage Sites", "sites.manage", SitesPermissionGroupName, "Permission to create, delete and modify other sites details");
        public static ApplicationPermission AddUpdateSites = new ApplicationPermission("Add Update Sites", "sites.addupdate", SitesPermissionGroupName, "Permission to create and modify other sites details");


        public const string ProjectsPermissionGroupName = "Project Permissions";
        public static ApplicationPermission ViewProjects = new ApplicationPermission("View Projects", "projects.view", ProjectsPermissionGroupName, "Permission to view other projects details");
        public static ApplicationPermission ManageProjects = new ApplicationPermission("Manage Projects", "projects.manage", ProjectsPermissionGroupName, "Permission to create, delete and modify other projects details");
        public static ApplicationPermission AddUpdateProjects = new ApplicationPermission("Add Update Projects", "projects.addupdate", ProjectsPermissionGroupName, "Permission to create and modify other projects details");


        public const string StoresPermissionGroupName = "Store Permissions";
        public static ApplicationPermission ViewStores = new ApplicationPermission("View Stores", "stores.view", StoresPermissionGroupName, "Permission to view other stores details");
        public static ApplicationPermission ManageStores = new ApplicationPermission("Manage Stores", "stores.manage", StoresPermissionGroupName, "Permission to create, delete and modify other stores details");
        public static ApplicationPermission AddUpdateStores = new ApplicationPermission("Add Update Stores", "stores.addupdate", StoresPermissionGroupName, "Permission to create and modify other stores details");


        static ApplicationPermissions()
        {
            List<ApplicationPermission> allPermissions = new List<ApplicationPermission>()
            {
                ViewUsers,
                ManageUsers,
                AddUpdateUsers,

                ViewRoles,
                ManageRoles,
                AssignRoles,
                AddUpdateRoles,

                ViewSites,
                ManageSites,
                AddUpdateSites,

                ViewProjects,
                ManageProjects,
                AddUpdateProjects,

                ViewStores,
                ManageStores,
                AddUpdateStores

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
        {
            return new string[] { ManageUsers, ManageRoles, AssignRoles };
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
