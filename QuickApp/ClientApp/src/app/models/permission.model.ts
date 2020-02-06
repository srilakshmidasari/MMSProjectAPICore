// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

export type PermissionNames =
    'View Users' | 'Manage Users' |
    'View Roles' | 'Manage Roles' | 'Assign Roles'|
    'View Sites' | 'Manage  Sites' |
    'View Projects' | 'Manage Projects' |
    'View Stores' | 'Manage Stores';

export type PermissionValues =
    'users.view' | 'users.manage' |
    'roles.view' | 'roles.manage' | 'roles.assign' |
    'sites.view' | 'sites.manage' |
    'projects.view' | 'projects.manage' |
    'stores.view' | 'stores.manage';

export class Permission {

    public static readonly viewUsersPermission: PermissionValues = 'users.view';
    public static readonly manageUsersPermission: PermissionValues = 'users.manage';

    public static readonly viewRolesPermission: PermissionValues = 'roles.view';
    public static readonly manageRolesPermission: PermissionValues = 'roles.manage';
    public static readonly assignRolesPermission: PermissionValues = 'roles.assign';

    public static readonly viewSitesPermission: PermissionValues = 'sites.view';
    public static readonly manageSitesPermission: PermissionValues = 'sites.manage';

    public static readonly viewProjectsPermission: PermissionValues = 'projects.view';
    public static readonly manageProjectsPermission: PermissionValues = 'projects.manage';

    public static readonly viewStoresPermission: PermissionValues = 'stores.view';
    public static readonly manageStoresPermission: PermissionValues = 'stores.manage';

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
