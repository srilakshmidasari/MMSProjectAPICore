// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

// export type PermissionNames =
//     'View Users' | 'Manage Users' |'Add Update Users'|
//     'View Roles' | 'Manage Roles' | 'Assign Roles'|'Add Update Roles'|
//     'View Sites' | 'Manage Sites' |'Add Update Sites'|
//     'View Projects' | 'Manage Projects' |'Add Update Projects'|
//     'View Stores' | 'Manage Stores'|'Add Update Stores';

// export type PermissionValues =
//     'users.view' | 'users.manage' |'users.addupdate'|
//     'roles.view' | 'roles.manage' | 'roles.assign' |'roles.addupdate'|
//     'sites.view' | 'sites.manage' |'sites.addupdate'|
//     'projects.view' | 'projects.manage' |'projects.addupdate'|
//     'stores.view' | 'stores.manage'|'stores.addupdate';
//'View Roles' | 'Manage Roles' | 'Assign Roles'|'Add Roles'|'Edit Roles'|'Delete Roles'|

//'roles.view' | 'roles.manage' | 'roles.assign' | 'roles.add' |'roles.edit'|'roles.delete'|

export type PermissionNames =
    'View Users' | 'Manage Users' |'Add Users'|'Edit Users'|'Delete Users'|
    'View Roles' | 'Manage Roles' | 'Assign Roles'|
    'View Sites' | 'Add Sites'|'Edit Sites'|'Delete Sites'| 'Manage Sites'|
    'View Projects'|'Add Projects'|'Add Projects'|'Add Projects'| 'Manage Projects'|
    'View Stores' |'Add Stores'|'Edit Stores'|'Delete Stores'|'Manage Stores'|
    'View Locations' |'Add Locations'|'Edit Locations'|'Delete Locations'|
    'View AssetGroups' |'Add AssetGroups'|'Edit AssetGroups'|'Delete AssetGroups'|
    'View Assets' |'Add Assets'|'Edit Assets'|'Delete Assets';

export type PermissionValues =
    'users.view' | 'users.add'|'users.edit'|'users.delete'|
    'roles.view' | 'roles.manage' | 'roles.assign' |
    'sites.view' | 'sites.add'|'sites.edit'|'sites.delete'|
    'projects.view' | 'projects.add'|'projects.edit'|'projects.delete'|
    'stores.view' |'stores.add'| 'stores.edit'| 'stores.delete'|
    'locations.view' | 'locations.add'| 'locations.edit'| 'locations.delete'|
    'assetgroups.view' | 'assetgroups.add'| 'assetgroups.edit'| 'assetgroups.delete'|
    'assets.view' | 'assets.add'| 'assets.edit'| 'assets.delete';



export class Permission {

    public static readonly viewUsersPermission: PermissionValues = 'users.view';
  //  public static readonly manageUsersPermission: PermissionValues = 'users.manage';
   //public static readonly addUpdateUserPermission: PermissionValues = 'users.addupdate';
   public static readonly addUsersPermission: PermissionValues = 'users.add';
   public static readonly editUsersPermission: PermissionValues = 'users.edit';
   public static readonly deleteUsersPermission: PermissionValues = 'users.delete';

    public static readonly viewRolesPermission: PermissionValues = 'roles.view';
    public static readonly manageRolesPermission: PermissionValues = 'roles.manage';
    public static readonly assignRolesPermission: PermissionValues = 'roles.assign';
    // static readonly addUpdateRolePermission: PermissionValues = 'roles.addupdate';
    // static readonly addRolesPermission: PermissionValues = 'roles.add';
    // static readonly editRolesPermission: PermissionValues = 'roles.edit';
    // static readonly deleteRolesPermission: PermissionValues = 'roles.delete';

    public static readonly viewSitesPermission: PermissionValues = 'sites.view';
  //  public static readonly manageSitesPermission: PermissionValues = 'sites.manage';
  //  public static readonly addUpdateSitePermission: PermissionValues = 'sites.addupdate';
     public static readonly addSitesPermission: PermissionValues = 'sites.add';
     public static readonly editSitesPermission: PermissionValues = 'sites.edit';
     public static readonly deleteSitesPermission: PermissionValues = 'sites.delete';




    public static readonly viewProjectsPermission: PermissionValues = 'projects.view';
  //  public static readonly manageProjectsPermission: PermissionValues = 'projects.manage';
   // public static readonly addUpdateProjectsPermission: PermissionValues = 'projects.addupdate';
    public static readonly addProjectsPermission: PermissionValues = 'projects.add';
    public static readonly editProjectsPermission: PermissionValues = 'projects.edit';
    public static readonly deleteProjectsPermission: PermissionValues = 'projects.delete';

    public static readonly viewStoresPermission: PermissionValues = 'stores.view';
   // public static readonly manageStoresPermission: PermissionValues = 'stores.manage';
  //  public static readonly addUpdateStorePermission: PermissionValues = 'stores.addupdate';
    public static readonly addStoresPermission: PermissionValues = 'stores.add';
    public static readonly editStoresPermission: PermissionValues = 'stores.edit';
    public static readonly deleteStoresPermission: PermissionValues = 'stores.delete';

    public static readonly viewLocationsPermission: PermissionValues = 'locations.view';
    // public static readonly manageStoresPermission: PermissionValues = 'locations.manage';
    // public static readonly addUpdateStorePermission: PermissionValues = 'locations.addupdate';
    public static readonly addLocationsPermission: PermissionValues = 'locations.add';
    public static readonly editLocationsPermission: PermissionValues = 'locations.edit';
    public static readonly deleteLocationsPermission: PermissionValues = 'locations.delete';
    
    public static readonly viewAssetGroupsPermission: PermissionValues = 'assetgroups.view';
    // public static readonly manageStoresPermission: PermissionValues = 'assetgroups.manage';
    // public static readonly addUpdateStorePermission: PermissionValues = 'assetgroups.addupdate';
    public static readonly addAssetGroupsPermission: PermissionValues = 'assetgroups.add';
    public static readonly editAssetGroupsPermission: PermissionValues = 'assetgroups.edit';
    public static readonly deleteAssetGroupsPermission: PermissionValues = 'assetgroups.delete';

    public static readonly viewAssetsPermission: PermissionValues = 'assets.view';
    // public static readonly manageAssetLocationsPermission: PermissionValues = 'assetlocations.manage';
    // public static readonly addUpdateStorePermission: PermissionValues = 'assetlocations.addupdate';
    public static readonly addAssetsPermission: PermissionValues = 'assets.add';
    public static readonly editAssetsPermission: PermissionValues = 'assets.edit';
    public static readonly deleteAssetsPermission: PermissionValues = 'assets.delete';

    constructor(name?: PermissionNames, value?: PermissionValues, groupName?: string, description?: string) {
        this.name = name;
        this.value = value;
        this.groupName = groupName;
        this.description = description;
    }

    public name: PermissionNames;
    public value: PermissionValues;
    public groupName: string;
    public description: string;
}
