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
    'View Users'  |'Add Users'|'Edit Users'|'Delete Users'|'Add All Projects' |
    'View Roles' | 'Assign Roles'|'Add Roles'|'Edit Roles'|'Delete Roles'|
    'View Sites' | 'Add Sites'|'Edit Sites'|'Delete Sites'| 'Manage Sites'|
    'View Projects'|'Add Projects'|'Add Projects'|'Add Projects'| 'Manage Projects'|
    'View Stores' |'Add Stores'|'Edit Stores'|'Delete Stores'|'Manage Stores'|
    'View Locations' |'Add Locations'|'Edit Locations'|'Delete Locations'|
    'View AssetGroups' |'Add AssetGroups'|'Edit AssetGroups'|'Delete AssetGroups'|
    'View Assets' |'Add Assets'|'Edit Assets'|'Delete Assets'|
    'View Suppliers' |'Add Suppliers'|'Edit Suppliers'|'Delete Suppliers'|
    'View Items' |'Add Items'|'Edit Items'|'Delete Items'|
    'View Purchase Order' |'Add Purchase Order'|'Edit Purchase Order'|'Delete Purchase Order'|'Approve Purchase Order'|'Reject Purchase Order'|
    'View Orders' |'Add Orders'|'Edit Orders'|'Delete Orders'|
    'View JobPlans' |'Add JobPlans'|'Edit JobPlans'|'Delete JobPlans'|
    'View PMProcedures' |'Add PMProcedures'|'Edit PMProcedures'|'Delete PMProcedures';



export type PermissionValues =
    'users.view' | 'users.add'|'users.edit'|'users.delete'|'all.projects'|
    'roles.view'| 'roles.assign' | 'roles.add' |'roles.edit'|'roles.delete'|
    'sites.view' | 'sites.add'|'sites.edit'|'sites.delete'|
    'projects.view' | 'projects.add'|'projects.edit'|'projects.delete'|
    'stores.view' |'stores.add'| 'stores.edit'| 'stores.delete'|
    'locations.view' | 'locations.add'| 'locations.edit'| 'locations.delete'|
    'assetgroups.view' | 'assetgroups.add'| 'assetgroups.edit'| 'assetgroups.delete'|
    'assets.view' | 'assets.add'| 'assets.edit'| 'assets.delete'|
    'suppliers.view' | 'suppliers.add'| 'suppliers.edit'| 'suppliers.delete'|
    'items.view' | 'items.add'| 'items.edit'| 'items.delete'|
    'purchases.view' | 'purchases.add'| 'purchases.edit'| 'purchases.delete'|'purchases.approve'|'purchases.reject'|
    'orders.view' | 'orders.add'| 'orders.edit'| 'orders.delete'|
    'jobplans.view' | 'jobplans.add'| 'jobplans.edit'| 'jobplans.delete'|
    'pmprocedures.view' | 'pmprocedures.add'| 'pmprocedures.edit'| 'pmprocedures.delete'|'pmprocedures.approve';




export class Permission {

    public static readonly viewUsersPermission: PermissionValues = 'users.view';
   public static readonly addUsersPermission: PermissionValues = 'users.add';
   public static readonly editUsersPermission: PermissionValues = 'users.edit';
   public static readonly deleteUsersPermission: PermissionValues = 'users.delete';
   public static readonly addAllProjects: PermissionValues = 'all.projects';

   
   
    public static readonly viewRolesPermission: PermissionValues = 'roles.view';
    public static readonly assignRolesPermission: PermissionValues = 'roles.assign';
    public static readonly addRolesPermission: PermissionValues = 'roles.add';
    public static readonly editRolesPermission: PermissionValues = 'roles.edit';
    public static readonly deleteRolesPermission: PermissionValues = 'roles.delete';

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

    public static readonly viewSupplierPermission: PermissionValues = 'suppliers.view';
    public static readonly addSuppliersPermission: PermissionValues = 'suppliers.add';
    public static readonly editSuppliersPermission: PermissionValues = 'suppliers.edit';
    public static readonly deleteSuppliersPermission: PermissionValues = 'suppliers.delete';

    public static readonly viewItemsPermission: PermissionValues = 'items.view';
    public static readonly addItemsPermission: PermissionValues = 'items.add';
    public static readonly editItemsPermission: PermissionValues = 'items.edit';
    public static readonly deleteItemsPermission: PermissionValues = 'items.delete';

    public static readonly viewPurchaseOrderPermission: PermissionValues = 'purchases.view';
    public static readonly addPurchaseOrderPermission: PermissionValues = 'purchases.add';
    public static readonly editPurchaseOrderPermission: PermissionValues = 'purchases.edit';
    public static readonly deletePurchaseOrderPermission: PermissionValues = 'purchases.delete';
    public static readonly approvePurchaseOrderPermission: PermissionValues = 'purchases.approve';
    public static readonly rejectPurchaseOrderPermission: PermissionValues = 'purchases.reject';

    public static readonly viewOrderPermission: PermissionValues = 'orders.view';
    public static readonly addOrderPermission: PermissionValues = 'orders.add';
    public static readonly editOrderPermission: PermissionValues = 'orders.edit';
    public static readonly deleteOrderPermission: PermissionValues = 'orders.delete';

    public static readonly viewJobPlansPermission: PermissionValues = 'jobplans.view';
    public static readonly addJobPlansPermission: PermissionValues = 'jobplans.add';
    public static readonly editJobPlansPermission: PermissionValues = 'jobplans.edit';
    public static readonly deleteJobPlansPermission: PermissionValues = 'jobplans.delete';

    public static readonly viewPMProceduresPermission: PermissionValues = 'pmprocedures.view';
    public static readonly addPMProceduresPermission: PermissionValues = 'pmprocedures.add';
    public static readonly editPMProceduresPermission: PermissionValues = 'pmprocedures.edit';
    public static readonly deletePMProceduresPermission: PermissionValues = 'pmprocedures.delete';
    public static readonly approvePMProceduresPermission: PermissionValues = 'pmprocedures.approve';


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
