// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Injectable } from '@angular/core';
import { Observable, Subject, forkJoin } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

import { AccountEndpoint } from './account-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Permission, PermissionNames, PermissionValues } from '../models/permission.model';
import { UserEdit } from '../models/user-edit.model';

export type RolesChangedOperation = 'add' | 'delete' | 'modify';
export interface RolesChangedEventArg { roles: Role[] | string[]; operation: RolesChangedOperation; }

@Injectable()
export class AccountService {
  public static readonly roleAddedOperation: RolesChangedOperation = 'add';
  public static readonly roleDeletedOperation: RolesChangedOperation = 'delete';
  public static readonly roleModifiedOperation: RolesChangedOperation = 'modify';

  private _rolesChanged = new Subject<RolesChangedEventArg>();

  constructor(
    private authService: AuthService,
    private accountEndpoint: AccountEndpoint) {

  }

  getUser(userId?: string) {
    return this.accountEndpoint.getUserEndpoint<User>(userId);
  }

  getUserAndRoles(userId?: string) {

    return forkJoin(
      this.accountEndpoint.getUserEndpoint<User>(userId),
      this.accountEndpoint.getRolesEndpoint<Role[]>());
  }

  getUsers(page?: number, pageSize?: number) {
    debugger
    return this.accountEndpoint.getUsersEndpoint<User[]>(page, pageSize);
  }

  getUsersAndRoles(page?: number, pageSize?: number) {
    debugger
    return forkJoin(
      this.accountEndpoint.getUsersEndpoint<User[]>(page, pageSize),
      this.accountEndpoint.getRolesEndpoint<Role[]>());
  }

  updateUser(user: UserEdit) {
    if (user.id) {
      return this.accountEndpoint.getUpdateUserEndpoint(user, user.id);
    } else {
      return this.accountEndpoint.getUserByUserNameEndpoint<any>(user.userName).pipe(
        mergeMap(foundUser => {

          user.id = foundUser.id;
          return this.accountEndpoint.getUpdateUserEndpoint(user, user.id);
        }));
    }
  }

  UpdateUser(user: any) {
    if (user.id) {
      return this.accountEndpoint.updateUserEndpoint(user, user.id);
    } else {
      return this.accountEndpoint.getUserByUserNameEndpoint<any>(user.userName).pipe(
        mergeMap(foundUser => {
          user.id = foundUser.id;
          return this.accountEndpoint.getUpdateUserEndpoint(user, user.id);
        }));
    }
  }



  newUser(user: any, isPublicRegistration?: boolean) {
    return this.accountEndpoint.getNewUserEndpoint<any>(user, isPublicRegistration);
  }

  getUserPreferences() {
    return this.accountEndpoint.getUserPreferencesEndpoint<string>();
  }

  updateUserPreferences(configuration: string) {
    return this.accountEndpoint.getUpdateUserPreferencesEndpoint(configuration);
  }

  deleteUser(userOrUserId: string | User): Observable<User> {
    if (typeof userOrUserId === 'string' || userOrUserId instanceof String) {
      return this.accountEndpoint.getDeleteUserEndpoint<User>(userOrUserId as string).pipe<User>(
        tap(data => this.onRolesUserCountChanged(data.roles)));
    } else {
      if (userOrUserId.id) {
        return this.deleteUser(userOrUserId.id);
      } else {
        return this.accountEndpoint.getUserByUserNameEndpoint<User>(userOrUserId.userName).pipe<User>(
          mergeMap(user => this.deleteUser(user.id)));
      }
    }
  }

  sendConfirmEmail() {
    return this.accountEndpoint.getSendConfirmEmailEndpoint();
  }

  confirmUserAccount(userId: string, confirmationCode: string) {
    return this.accountEndpoint.getConfirmUserAccountEndpoint(userId, confirmationCode);
  }

  recoverPassword(usernameOrEmail: string) {
    return this.accountEndpoint.getRecoverPasswordEndpoint(usernameOrEmail);
  }

  resetPassword(usernameOrEmail: string, newPassword: string, resetCode: string) {
    return this.accountEndpoint.getResetPasswordEndpoint(usernameOrEmail, newPassword, resetCode);
  }

  unblockUser(userId: string) {
    return this.accountEndpoint.getUnblockUserEndpoint(userId);
  }

  userHasPermission(permissionValue: PermissionValues): boolean {
    return this.permissions.some(p => p == permissionValue);
  }

  refreshLoggedInUser() {
    return this.accountEndpoint.refreshLogin();
  }

  getRoles(page?: number, pageSize?: number) {

    return this.accountEndpoint.getRolesEndpoint<Role[]>(page, pageSize);
  }

  getRolesAndPermissions(page?: number, pageSize?: number) {

    return forkJoin(
      this.accountEndpoint.getRolesEndpoint<Role[]>(page, pageSize),
      this.accountEndpoint.getPermissionsEndpoint<Permission[]>());
  }

  updateRole(role: Role) {
    if (role.id) {
      return this.accountEndpoint.getUpdateRoleEndpoint(role, role.id).pipe(
        tap(data => this.onRolesChanged([role], AccountService.roleModifiedOperation)));
    } else {
      return this.accountEndpoint.getRoleByRoleNameEndpoint<Role>(role.name).pipe(
        mergeMap(foundRole => {
          role.id = foundRole.id;
          return this.accountEndpoint.getUpdateRoleEndpoint(role, role.id);
        }),
        tap(data => this.onRolesChanged([role], AccountService.roleModifiedOperation)));
    }
  }

  newRole(role: Role) {
    return this.accountEndpoint.getNewRoleEndpoint<Role>(role).pipe<Role>(
      tap(data => this.onRolesChanged([role], AccountService.roleAddedOperation)));
  }

  deleteRole(roleOrRoleId: string | Role): Observable<Role> {

    if (typeof roleOrRoleId === 'string' || roleOrRoleId instanceof String) {
      return this.accountEndpoint.getDeleteRoleEndpoint<Role>(roleOrRoleId as string).pipe<Role>(
        tap(data => this.onRolesChanged([data], AccountService.roleDeletedOperation)));
    } else {

      if (roleOrRoleId.id) {
        return this.deleteRole(roleOrRoleId.id);
      } else {
        return this.accountEndpoint.getRoleByRoleNameEndpoint<Role>(roleOrRoleId.name).pipe<Role>(
          mergeMap(role => this.deleteRole(role.id)));
      }
    }
  }

  getPermissions() {

    return this.accountEndpoint.getPermissionsEndpoint<Permission[]>();
  }

  private onRolesChanged(roles: Role[] | string[], op: RolesChangedOperation) {
    this._rolesChanged.next({ roles, operation: op });
  }

  onRolesUserCountChanged(roles: Role[] | string[]) {
    return this.onRolesChanged(roles, AccountService.roleModifiedOperation);
  }

  getRolesChangedEvent(): Observable<RolesChangedEventArg> {
    return this._rolesChanged.asObservable();
  }

  get permissions(): PermissionValues[] {
    return this.authService.userPermissions;
  }

  get currentUser() {
    return this.authService.currentUser;
  }

  getUserFileData(userid) {
    return this.accountEndpoint.getUserFileEndpoint(userid);
  }
  getCddmtData(classTypeId) {
    return this.accountEndpoint.getTypeCddmtDataEndpoint(classTypeId);
  }
  deleteUserFile(repositotyId) {
    return this.accountEndpoint.deleteUserFileEndpoint(repositotyId);
  }

  getRolesData() {
    return this.accountEndpoint.getRoleData()
  }

  gettUserDataBYId(userId) {
    return this.accountEndpoint.getUserDataById(userId)
  }

  // Site

  getSiteData() {
    return this.accountEndpoint.getSiteEndpoint();
  }
  AddSite(site) {
    return this.accountEndpoint.getNewSiteEndpoint(site);
  }

  updateSite(site) {
    return this.accountEndpoint.updateSiteEndpoint(site);
  }

  deleteSite(site: any): Observable<any> {
    return this.accountEndpoint.getDeleteSiteEndpoint<any>(site.id);
  }

  // Project

  getProject() {
    return this.accountEndpoint.getProjectEndpoint();
  }

  getStoresByProjectId(ProjectId) {
    return this.accountEndpoint.getStoresByProjectId(ProjectId);
  }
  getLookUpDetailsByTypeId(TypeId) {
    return this.accountEndpoint.getLookUpDetailsByTypeId(TypeId);
  }

  NewProject(project: any) {
    return this.accountEndpoint.newProjectEndpoint(project);
  }

  UpdateProject(project: any) {
    return this.accountEndpoint.updateProjectEndpoint(project);
  }

  getRepositoryByProject(ProjectId) {
    return this.accountEndpoint.getRepositoryByProjectEndpoint(ProjectId);
  }
  deleteProjectFile(ProjectId) {
    return this.accountEndpoint.deleteProjectFileEndpoint(ProjectId);
  }

  deleteProject(ProjectId) {
    return this.accountEndpoint.deleteProjectEndpoint(ProjectId);
  }

 // Look UP
  getLookUPData() {
    return this.accountEndpoint.getLookUpData();
  }
  AddLookUp(LookUp) {
    return this.accountEndpoint.AddLookUpEndpoint(LookUp);
  }

  updateLookUp(LookUp) {
    return this.accountEndpoint.updateLookUpEndpoint(LookUp);
  }

  deleteLookUp(LookUp: any): Observable<any> {
    return this.accountEndpoint.getDeleteLookUpEndpoint<any>(LookUp.id);
  }


 
// Location
 
  getLocationData() {
    return this.accountEndpoint.getLocationEndpoint();
  }
  addLocation(locationObject: any) {
    return this.accountEndpoint.addLocationEndpoint(locationObject);
  }
  upDateLocation(locationObject: any) {
    return this.accountEndpoint.upDateLocationEndpoint(locationObject);
  }
  deleteLocation(locationId) {
    return this.accountEndpoint.deleteLocationEndpoint(locationId);
  }

// AssetGroup

  getAssetGroupData() {
    return this.accountEndpoint.getAssetGroupEndPoint();
  }
  addAssetGroup(assGroupObj) {
    return this.accountEndpoint.addAssetGroupEndpoint(assGroupObj);
  }
  upDateAssetGroup(assGroupObj) {
    return this.accountEndpoint.upDateAssetGroupEndpoint(assGroupObj);
  }
  deleteAssetGroup(assetGroupId) {
    return this.accountEndpoint.deleteAssetGroupEndpoint(assetGroupId);
  }

  getAssetGroupDataById(assetGroupId) {
    return this.accountEndpoint.getAssetGroupEndpointById(assetGroupId);
  }


  // Asset Location 

  getAssets() {
    return this.accountEndpoint.getAssetsEndpoint();
  }

  addAsset(reqObject) {
    return this.accountEndpoint.addAssetEndpoint(reqObject);
  }

  updateAsset(reqObject) {
    return this.accountEndpoint.updateAssetEndpoint(reqObject);
  }
  
  deleteAsset(assetId) {
    return this.accountEndpoint.deleteAssetEndpoint(assetId);
  }
  getProjectsBySite(SiteId) {
    return this.accountEndpoint.getProjectsBySiteEndpoint(SiteId);
  }

  getLocationsByProject(ProjectId) {
    return this.accountEndpoint.getLocationsByProjectEndPoint(ProjectId);
  }

 getsupplierdata(){
   return this.accountEndpoint.getSuppliersEndpoint();
 }
 Adddsupplier(supplier: any) {
  return this.accountEndpoint.AddsupplierEndPoint(supplier);
}

// Supplier 
Updatesupplier(reqObject){
 return this.accountEndpoint.updatesupplierEndpoint(reqObject);
  }
deletesupplier(supplierId){
  return this.accountEndpoint.deletesupplierEndpoint(supplierId);
  }
getAssetRepository(assetId) {
    return this.accountEndpoint.getAssetRepositoryEndpoint(assetId);
  }
deleteAssetRepository(repositoryId) {
    return this.accountEndpoint.deleteAssetRepositoryEndpoint(repositoryId);
  }

  //Item

  getitemdata(){
    return this.accountEndpoint.getitemEndpoint();
  }
  AddAllItems(reqObject) {
    return this.accountEndpoint.addAllItemtEndpoint(reqObject);
  }

  Updateitem(reqObject){
    return this.accountEndpoint.updateitemEndpoint(reqObject);
  }
  deleteitem(itemId){
    return this.accountEndpoint.deleteitemEndpoint(itemId);
  }

  // Purchase Order

  getPurchaseOrder(){
    return this.accountEndpoint.getPurchaseOrderEndpoint();
  }
  
  AddPurchaseOrder(reqObject) {
    return this.accountEndpoint.AddPurchaseOrderEndpoint(reqObject);
  }

  UpdatePurchaseOrder(reqObject) {
    return this.accountEndpoint.UpdatePurchaseOrderEndpoint(reqObject);
  }

  getItemsByPurchaseId(purchaseId) {
    return this.accountEndpoint.getItemsByPurchaseIdEndpoint(purchaseId);
  }

  deletePurchaseOrder(purchageId){
    return this.accountEndpoint.deletePurchaseOrderEndpoint(purchageId);
  }
  AcceptPurchaseOrder(purchageId){
    return this.accountEndpoint.AcceptPurchaseOrderEndpoint(purchageId);
  }

  RejectPurchaseOrder(purchageId){
    return this.accountEndpoint.RejectPurchaseOrderEndpoint(purchageId);
  }
  
  // Work Order
  
  
  getWorkOrder(){
    return this.accountEndpoint.getWorkOrderEndpoint();
  }
  
  AddWorkOrder(reqObject) {
    return this.accountEndpoint.AddWorkOrderEndpoint(reqObject);
  }

  UpdateWorkOrder(reqObject) {
    return this.accountEndpoint.UpdateWorkOrderEndpoint(reqObject);
  }

  getItemsByWorkOrderId(workOrderId) {
    return this.accountEndpoint.getItemsByWorkOrderIdEndpoint(workOrderId);
  }
  
  deleteWorkOrder(workOrderId){
    return this.accountEndpoint.deleteWorkOrderEndpoint(workOrderId);
  }

  getAssetsByLocationId(Id) {
    return this.accountEndpoint.getAssetsByLocationIdEndpoint(Id);
  }
  
  getProjectsByUserId(Id) {
    return this.accountEndpoint.getProjectsByUserIdEndPoint(Id);
  }

  getSitesByProjectId(Id) {
    return this.accountEndpoint.getSitesByProjectIdEndPoint(Id);
  }
  

  UpdateInventory(reqObject) {
    return this.accountEndpoint.UpdateInventoryEndpoint(reqObject);
  }

  getProjectsByUserIdandSiteId(reqObject) {
    return this.accountEndpoint.getProjectsByUserIdandSiteIdEndPoint(reqObject);
  }

  getSitesByUserId(Id) {
    return this.accountEndpoint.getSitesByUserIdEndPoint(Id);
  }

  ExportWorkOrders(reqObject) {
    return this.accountEndpoint.getExportWorkOrdersEndPoint(reqObject);
  }
  
}
