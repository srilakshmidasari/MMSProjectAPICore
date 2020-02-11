// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

export type PermissionNames =
    'View Users' | 'Manage Users' |'Add Update Users'|
    'View Roles' | 'Manage Roles' | 'Assign Roles'|'Add Update Roles'|
    'View Sites' | 'Manage Sites' |'Add Update Sites'|
    'View Projects' | 'Manage Projects' |'Add Update Projects'|
    'View Stores' | 'Manage Stores'|'Add Update Stores';

export type PermissionValues =
    'users.view' | 'users.manage' |'users.addupdate'|
    'roles.view' | 'roles.manage' | 'roles.assign' |'roles.addupdate'|
    'sites.view' | 'sites.manage' |'sites.addupdate'|
    'projects.view' | 'projects.manage' |'projects.addupdate'|
    'stores.view' | 'stores.manage'|'stores.addupdate';

export class Permission {

    public static readonly viewUsersPermission: PermissionValues = 'users.view';
    public static readonly manageUsersPermission: PermissionValues = 'users.manage';
    public static readonly addUpdateUserPermission: PermissionValues = 'users.addupdate';

    public static readonly viewRolesPermission: PermissionValues = 'roles.view';
    public static readonly manageRolesPermission: PermissionValues = 'roles.manage';
    public static readonly assignRolesPermission: PermissionValues = 'roles.assign';
    public static readonly addUpdateRolePermission: PermissionValues = 'roles.addupdate';

    public static readonly viewSitesPermission: PermissionValues = 'sites.view';
    public static readonly manageSitesPermission: PermissionValues = 'sites.manage';
    public static readonly addUpdateSitePermission: PermissionValues = 'sites.addupdate';

    public static readonly viewProjectsPermission: PermissionValues = 'projects.view';
    public static readonly manageProjectsPermission: PermissionValues = 'projects.manage';
    public static readonly addUpdateProjectPermission: PermissionValues = 'projects.addupdate';

    public static readonly viewStoresPermission: PermissionValues = 'stores.view';
    public static readonly manageStoresPermission: PermissionValues = 'stores.manage';
    public static readonly addUpdateStorePermission: PermissionValues = 'stores.addupdate';

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
