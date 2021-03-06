// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { EndpointBase } from './endpoint-base.service';
import { ConfigurationService } from './configuration.service';


@Injectable()
export class AccountEndpoint extends EndpointBase {

  private readonly _usersUrl: string = '/api/account/users';
  private readonly _updateUsersUrl: string = '/api/Account/updateuser';
  private readonly _usersPublicUrl: string = '/api/account/public/users';
  private readonly _userByUserNameUrl: string = '/api/account/users/username';
  private readonly _currentUserUrl: string = '/api/account/users/me';
  private readonly _currentUserPreferencesUrl: string = '/api/account/users/me/preferences';
  private readonly _sendConfirmEmailUrl: string = '/api/account/users/me/sendconfirmemail';
  private readonly _confirmEmailUrl: string = '/api/account/public/confirmemail';
  private readonly _recoverPasswordUrl: string = '/api/account/public/recoverpassword';
  private readonly _resetPasswordUrl: string = '/api/account/public/resetpassword';
  private readonly _unblockUserUrl: string = '/api/account/users/unblock';
  private readonly _rolesUrl: string = '/api/account/roles';
  private readonly _roleByRoleNameUrl: string = '/api/account/roles/name';
  private readonly _permissionsUrl: string = '/api/account/permissions';
  private readonly _siteUrl: string = '/api/Site';
  private readonly _exportsiteUrl: string = '/api/Site/ExportSite';

  private readonly _getUserFilesUrl: string = '/api/Account/GetFilesByUserId';
  private readonly _getTypecddmtDetails: string = '/api/Masters/GetTypecddmtDetails';
  private readonly _deleteUserFile: string = '/api/Masters/DeleteFileRepository';
  private readonly _getUserById: string = '/api/Account/users/GetUserById';
  private readonly _getLookUpData: string = '/api/Masters/GetAllLookUpDetails';
  private readonly _AddLookUpData: string = '/api/Masters/AddLookUpData';
  private readonly _UpdateLookUpData: string = '/api/Masters/UpdateLookUpData';
  private readonly _deleteLookUpData: string = '/api/Masters/DeleteLooKUp';
  private readonly _exportLookUpData: string = '/api/Masters/ExportMaster';


  private readonly _projectUrl: string = '/api/Project';
  private readonly _getStoresByProjectIdUrl: string = '/api/Project/GetStoresByProjectId';
  private readonly _getLookUpDetailsByTypeIdUrl: string = '/api/Masters/GetLookUpDetilas';
  private readonly _getRepositoryByProjectUrl: string = '/api/Project/GetRepositoryByProject';
  private readonly _deleteProjectFileUrl: string = '/api/Project/DeleteProjectRepository';
  private readonly _getProjectsBySiteUrl: string = '/api/Project/GetProjectsBySiteId';
  private readonly _exportProject: string = '/api/Project/ExportProject';


  private readonly _locationUrl: string = '/api/Location';
  private readonly _getLocationsByProjectUrl: string = '/api/Location/GetLocationsByProjectId';
  private readonly _exportLocation: string = '/api/Location/ExportLocation';


  private readonly _getAssetGroupUrl: string = '/api/Asset/GetAllAssetGroup';
  private readonly _addAssetGroupUrl: string = '/api/Asset/AddAssetGroup';
  private readonly _upDateAssetGroupUrl: string = '/api/Asset/UpdateAssetGroup';
  private readonly _deleteAssetGroupUrl: string = '/api/Asset/DeleteAssetGroup';
  private readonly _getAssetGroupByIdUrl: string = '/api/Asset/GetAssetGroupDetilasById';
  private readonly _getAssetLocationUrl: string = '/api/Asset/GetAllAssetLocation';
  private readonly _addAssetLocationUrl: string = '/api/Asset/AddAssetLocation';
  private readonly _updateAssetLocationUrl: string = '/api/Asset/UpdateAssetLocation';
  private readonly _deleteAssetLocationUrl: string = '/api/Asset/DeleteAssetLocation';
  private readonly _deleteAssetRepositoryUrl: string = '/api/Asset/DeleteProjectRepository';
  private readonly _getAssetRepositoryUrl: string = '/api/Asset/GetRepositoryByAsset';
  private readonly _exportAssetLocationUrl: string = '/api/Asset/ExportAsset';

  
  private readonly _getAllSupplier: string = '/api/Supplier/GetAllSupplier';
  private readonly _AddSupplierDetials: string = '/api/Supplier/AddSupplierDetials';
  private readonly _UpdateSupplierDetials: string = '/api/Supplier/UpdateSupplierDetials';
  private readonly _DeleteSupplierByID: string = '/api/Supplier/DeleteSupplierByID';
  private readonly _exportSupplier: string = '/api/Supplier/ExportSupplier';



  private readonly _getAllitem: string = '/api/Item/GetAllItems';
  private readonly _AddAllitem: string ='/api/Item/AddItemDetials';
  private readonly _updateitem: string ='/api/Item/UpdateItem';
  private readonly _deleteitem: string ='/api/Item/DeleteItem';
  private readonly _exportItem: string ='/api/Item/ExportItem';


  private readonly _getPurchaseOrderUrl: string ='/api/PurchaseOrder';
  private readonly _getItemsByPurchaseId: string ='/api/PurchaseOrder/GetItemsByPurchaseId';
  private readonly _AddAcceptOrder: string ='/api/PurchaseOrder/AcceptOrder';
  private readonly _RejectOrder: string ='/api/PurchaseOrder/RejectOrder';
  private readonly _exportPurchaseOrder: string ='/api/PurchaseOrder/ExportPurchaseOrders';
  private readonly _exportInventory: string ='/api/PurchaseOrder/ExportInventory';


  private readonly _getWorkOrderUrl: string ='/api/WorkOrder';
  private readonly _getItemsByWorkOrderId: string ='/api/WorkOrder/GetItemsByWorkOrderId';
  private readonly _getAssetsByLocationIdUrl: string ='/api/Asset/GetAssetsByLocationId';
  private readonly _deleteWorkOrder: string ='/api/WorkOrder';
  private readonly _AddAcceptWorkOrder: string ='/api/WorkOrder/AcceptWorkOrder';
  private readonly _RejectWorkOrder: string ='/api/WorkOrder/RejectWorkOrder';
  private readonly _CloseWorkOrder: string ='/api/WorkOrder/CloseWorkOrder';
  private readonly _getProjectsByUserIdUrl: string ='/api/Project/GetProjectsByUserId';

  private readonly _getSitesByProjectIdUrl: string ='/api/Site/GetSitesByProjectId';

  private readonly _updateInventory: string ='/api/PurchaseOrder/UpdateInventory';

  private readonly _getProjectsByUserIdandSiteIdUrl: string ='/api/Project/GetProjectsByUserIdandSiteId';

  private readonly _getSitesByUserIdUrl: string ='/api/Site/GetSitesByUserId';

  private readonly  _getExportWorkOrdersUrl: string ='/api/WorkOrder/ExportWorkOrders';

  private readonly  _getAllInventoryUrl: string ='/api/PurchaseOrder/GetAllInventories';
  private readonly  _getPreventiveMaintenance: string ='/api/PreventiveMaintenance';
  private readonly  _expoerPMProcedure: string ='/api/PreventiveMaintenance/ExportPMProcedure';


  private readonly  _getPMAssetsbyPMIdUrl: string ='/api/PreventiveMaintenance/GetPMAssetsbyPMId';

  private readonly  _getJobPlanUrl: string ='/api/JobPlan';
  private readonly  _exportJobPlan: string ='/api/JobPlan/ExportJob';


  private readonly  _getJobTaskByJobPlanIdUrl: string ='/api/JobPlan/GetJobTaskByJobPlanId';

  private readonly  _getAssetsBySearch: string ='/api/Asset/GetAssetsBySearch';

  private readonly  _getLocationsBySearch: string ='/api/Location/GetLocationsBySearch';

  private readonly  _getJobPlansByProjectUrl: string ='/api/JobPlan/GetJobPlansByProject';

  private readonly  _getAssetsByProjectUrl: string ='/api/Asset/GetAssetsByProject';
  
  private readonly  _getPmOrderUrl: string ='/api/WorkOrder/GetPMOrders';

  private readonly  _addPmOrder: string ='/api/WorkOrder/AddPMOrder';
  
  private readonly  _getWorkOrderDashboardCountUrl:string = '/api/Dashboard/GetWorkOrderDashboardCount'

  private readonly  _getWorkOrderStatusCountUrl:string = '/api/Dashboard/GetWorkOrderStatusCount'

  private readonly  _getWorkOrdersByTradeCountUrl:string = '/api/Dashboard/GetWorkOrdersByTradeCount'

  private readonly  _exportPMOrders:string = '/api/WorkOrder/ExportPMOrders'
  

  
  get usersUrl() { return this.configurations.baseUrl + this._usersUrl; }
  get updateUserUrl() { return this.configurations.baseUrl + this._updateUsersUrl; }
  get usersPublicUrl() { return this.configurations.baseUrl + this._usersPublicUrl; }
  get userByUserNameUrl() { return this.configurations.baseUrl + this._userByUserNameUrl; }
  get currentUserUrl() { return this.configurations.baseUrl + this._currentUserUrl; }
  get currentUserPreferencesUrl() { return this.configurations.baseUrl + this._currentUserPreferencesUrl; }
  get sendConfirmEmailUrl() { return this.configurations.baseUrl + this._sendConfirmEmailUrl; }
  get confirmEmailUrl() { return this.configurations.baseUrl + this._confirmEmailUrl; }
  get recoverPasswordUrl() { return this.configurations.baseUrl + this._recoverPasswordUrl; }
  get resetPasswordUrl() { return this.configurations.baseUrl + this._resetPasswordUrl; }
  get unblockUserUrl() { return this.configurations.baseUrl + this._unblockUserUrl; }
  get rolesUrl() { return this.configurations.baseUrl + this._rolesUrl; }
  get roleByRoleNameUrl() { return this.configurations.baseUrl + this._roleByRoleNameUrl; }
  get permissionsUrl() { return this.configurations.baseUrl + this._permissionsUrl; }

  get sitesUrl() { return this.configurations.baseUrl + this._siteUrl; }
  get exportsiteUrl() { return this.configurations.baseUrl + this._exportsiteUrl; }

  
  get UserFilesUrl() { return this.configurations.baseUrl + this._getUserFilesUrl; }
  get typeCddmtData() { return this.configurations.baseUrl + this._getTypecddmtDetails; }
  get deleteUserFileData() { return this.configurations.baseUrl + this._deleteUserFile; }
  get userDataById() { return this.configurations.baseUrl + this._getUserById; }

  get projectUrl() { return this.configurations.baseUrl + this._projectUrl; }
  get getStoresByProjectIdUrl() { return this.configurations.baseUrl + this._getStoresByProjectIdUrl; }
  get getRepositoryByProjectUrl() { return this.configurations.baseUrl + this._getRepositoryByProjectUrl; }
  get deleteProjectFileUrl() { return this.configurations.baseUrl + this._deleteProjectFileUrl; }
  get getProjectsBySiteUrl() { return this.configurations.baseUrl + this. _getProjectsBySiteUrl; }

  get exportProject() { return this.configurations.baseUrl + this. _exportProject; }

  get lookUpData() { return this.configurations.baseUrl + this._getLookUpData; }
  get getLookUpDetailsByTypeIdUrl() { return this.configurations.baseUrl + this._getLookUpDetailsByTypeIdUrl; }
  get AddlookUpData() { return this.configurations.baseUrl + this._AddLookUpData; }
  get UpdateLookUpData() { return this.configurations.baseUrl + this._UpdateLookUpData; }
  get deleteLookUpData() { return this.configurations.baseUrl + this._deleteLookUpData; }
  get exportLookUpData() { return this.configurations.baseUrl + this._exportLookUpData; }

 
  get locationUrlData() { return this.configurations.baseUrl + this._locationUrl; }
  get exportLocation() { return this.configurations.baseUrl + this._exportLocation; }
 
 
  get getAssetGroup() { return this.configurations.baseUrl + this._getAssetGroupUrl; }
  get addAssetGroup() { return this.configurations.baseUrl + this._addAssetGroupUrl; }
  get upDateAssetGroup() { return this.configurations.baseUrl + this._upDateAssetGroupUrl; }
  get deleteAssetGroup() { return this.configurations.baseUrl + this._deleteAssetGroupUrl; }
  get getAssetGroupDataById() { return this.configurations.baseUrl + this._getAssetGroupByIdUrl; }
  get getAssetLocationUrl() { return this.configurations.baseUrl + this._getAssetLocationUrl; }
  get addAssetLocationUrl() { return this.configurations.baseUrl + this._addAssetLocationUrl; }
  get updateAssetLocationUrl() { return this.configurations.baseUrl + this._updateAssetLocationUrl; }
  get deleteAssetLocationUrl() { return this.configurations.baseUrl + this._deleteAssetLocationUrl; }
  get getAssetRepositoryUrl() { return this.configurations.baseUrl + this. _getAssetRepositoryUrl; }
  get deleteAssetRepositoryUrl() { return this.configurations.baseUrl + this._deleteAssetRepositoryUrl; }
  get exportAssetLocation() { return this.configurations.baseUrl + this._exportAssetLocationUrl; }

 
  get getLocationsByProjectUrl() { return this.configurations.baseUrl + this._getLocationsByProjectUrl; }
 

  get getAllSupplier() { return this.configurations.baseUrl + this._getAllSupplier; }
  get AddSupplierDetials() { return this.configurations.baseUrl + this._AddSupplierDetials; }
  get UpdateSupplierDetials() { return this.configurations.baseUrl + this._UpdateSupplierDetials; }
  get DeleteSupplierByID() { return this.configurations.baseUrl + this._DeleteSupplierByID; }
  get exportSupplier() { return this.configurations.baseUrl + this._exportSupplier; }


  get getAllitem() { return this.configurations.baseUrl + this._getAllitem; }
  get AddAllitemdata() { return this.configurations.baseUrl + this._AddAllitem; }
  get updateitem() { return this.configurations.baseUrl + this._updateitem; }
  get deleteitem() { return this.configurations.baseUrl + this._deleteitem; }
  get exportItem() { return this.configurations.baseUrl + this._exportItem; }


  get purchaseOrderUrl() { return this.configurations.baseUrl + this._getPurchaseOrderUrl; }
  get exportPurchaseOrder() { return this.configurations.baseUrl + this._exportPurchaseOrder; }
  get exportInventory() { return this.configurations.baseUrl + this._exportInventory; }


  get getItemsByPurchaseIdUrl() { return this.configurations.baseUrl + this._getItemsByPurchaseId; }
  get AddAcceptOrder() { return this.configurations.baseUrl + this._AddAcceptOrder; }
  get RejectOrder() { return this.configurations.baseUrl + this._RejectOrder; }

  //get workOrderUrl() { return this.configurations.baseUrl + this._getWorkOrderUrl; }

  get workOrderUrl() { return this.configurations.baseUrl + this._getWorkOrderUrl; }

  get getItemsByWorkOrderIdUrl() { return this.configurations.baseUrl + this._getItemsByWorkOrderId; }

  get getAssetsByLocationIdUrl() { return this.configurations.baseUrl + this._getAssetsByLocationIdUrl; }
  get deleteWorkOrder() { return this.configurations.baseUrl + this._deleteWorkOrder; }
 

  get getProjectsByUserIdUrl() { return this.configurations.baseUrl + this._getProjectsByUserIdUrl; }

  get getSitesByProjectIdUrl() { return this.configurations.baseUrl + this._getSitesByProjectIdUrl; }

  get updateInventory() { return this.configurations.baseUrl + this._updateInventory; }

  get getProjectsByUserIdandSiteIdUrl() { return this.configurations.baseUrl + this._getProjectsByUserIdandSiteIdUrl; }

  get getSitesByUserIdUrl() { return this.configurations.baseUrl + this._getSitesByUserIdUrl; }

  get getExportWorkOrdersUrl() { return this.configurations.baseUrl + this._getExportWorkOrdersUrl; }
  get AddAcceptWorkOrder() { return this.configurations.baseUrl + this._AddAcceptWorkOrder; }
  get RejectWorkOrder() { return this.configurations.baseUrl + this._RejectWorkOrder; }
  get CloseWorkOrder() { return this.configurations.baseUrl + this._CloseWorkOrder; }

  get getAllInventoryUrl() { return this.configurations.baseUrl + this._getAllInventoryUrl; }
  get getPreventiveMaintenance() { return this.configurations.baseUrl + this._getPreventiveMaintenance; }
  get expoerPMProcedure() { return this.configurations.baseUrl + this._expoerPMProcedure; }


  get getPMAssetsbyPMIdUrl() { return this.configurations.baseUrl + this._getPMAssetsbyPMIdUrl; }

  get getJobPlanUrl() { return this.configurations.baseUrl + this._getJobPlanUrl; }
  get exportJobPlan() { return this.configurations.baseUrl + this._exportJobPlan; }


  get getJobTaskByJobPlanIdUrl() { return this.configurations.baseUrl + this._getJobTaskByJobPlanIdUrl; }

  get getAssetsBySearchUrl() { return this.configurations.baseUrl + this._getAssetsBySearch; }

  get getLocationsBySearchUrl() { return this.configurations.baseUrl + this._getLocationsBySearch; }

  get getJobPlansByProjectUrl() { return this.configurations.baseUrl + this._getJobPlansByProjectUrl; }

  get getAssetsByProjectUrl() { return this.configurations.baseUrl + this._getAssetsByProjectUrl; }

  get getPmOrderUrl() { return this.configurations.baseUrl + this._getPmOrderUrl; }

  get addPmOrder() { return this.configurations.baseUrl + this._addPmOrder; }

  get getWorkOrderDashboardCountUrl() { return this.configurations.baseUrl + this._getWorkOrderDashboardCountUrl; }

  get getWorkOrderStatusCountUrl() { return this.configurations.baseUrl + this._getWorkOrderStatusCountUrl; }

  get getWorkOrdersByTradeCountUrl() { return this.configurations.baseUrl + this._getWorkOrdersByTradeCountUrl; }
 
  get exportPMOrders() { return this.configurations.baseUrl + this._exportPMOrders; }


  
  
  
  constructor(private configurations: ConfigurationService, http: HttpClient, authService: AuthService) {
    super(http, authService);
  }


  getUserEndpoint<T>(userId?: string): Observable<T> {
    const endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUserEndpoint(userId));
      }));
  }


  getUserByUserNameEndpoint<T>(userName: string): Observable<T> {
    const endpointUrl = `${this.userByUserNameUrl}/${userName}`;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUserByUserNameEndpoint(userName));
      }));
  }


  getUsersEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
    const endpointUrl = page && pageSize ? `${this.usersUrl}/${page}/${pageSize}` : this.usersUrl;
    debugger
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUsersEndpoint(page, pageSize));
      }));
  }


  getNewUserEndpoint<T>(userObject: any, isPublicRegistration?: boolean): Observable<T> {
    const endpointUrl = isPublicRegistration ? this.usersPublicUrl : this.usersUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify(userObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getNewUserEndpoint(userObject));
      }));
  }

  getUpdateUserEndpoint<T>(userObject: any, userId?: string): Observable<T> {
    const endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;
    return this.http.put<T>(endpointUrl, JSON.stringify(userObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUpdateUserEndpoint(userObject, userId));
      }));
  }

  updateUserEndpoint<T>(userObject: any, userId?: string): Observable<T> {
    const endpointUrl = userId ? `${this.updateUserUrl}/${userId}` : this.currentUserUrl;
    return this.http.put<T>(endpointUrl, JSON.stringify(userObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.updateUserEndpoint(userObject, userId));
      }));
  }

  getPatchUpdateUserEndpoint<T>(patch: {}, userId?: string): Observable<T>;
  getPatchUpdateUserEndpoint<T>(value: any, op: string, path: string, from?: any, userId?: string): Observable<T>;
  getPatchUpdateUserEndpoint<T>(valueOrPatch: any, opOrUserId?: string, path?: string, from?: any, userId?: string): Observable<T> {
    let endpointUrl: string;
    let patchDocument: {};

    if (path) {
      endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;
      patchDocument = from ?
        [{ value: valueOrPatch, path, op: opOrUserId, from }] :
        [{ value: valueOrPatch, path, op: opOrUserId }];
    } else {
      endpointUrl = opOrUserId ? `${this.usersUrl}/${opOrUserId}` : this.currentUserUrl;
      patchDocument = valueOrPatch;
    }

    return this.http.patch<T>(endpointUrl, JSON.stringify(patchDocument), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getPatchUpdateUserEndpoint(valueOrPatch, opOrUserId, path, from, userId));
      }));
  }


  getUserPreferencesEndpoint<T>(): Observable<T> {

    return this.http.get<T>(this.currentUserPreferencesUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUserPreferencesEndpoint());
      }));
  }

  getUpdateUserPreferencesEndpoint<T>(configuration: string): Observable<T> {
    return this.http.put<T>(this.currentUserPreferencesUrl, JSON.stringify(configuration), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUpdateUserPreferencesEndpoint(configuration));
      }));
  }

  getSendConfirmEmailEndpoint<T>(): Observable<T> {
    const endpointUrl = this.sendConfirmEmailUrl;

    return this.http.post<T>(endpointUrl, null, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getSendConfirmEmailEndpoint());
      }));
  }

  getConfirmUserAccountEndpoint<T>(userId: string, confirmationCode: string): Observable<T> {
    const endpointUrl = `${this.confirmEmailUrl}?userid=${userId}&code=${confirmationCode}`;
    return this.http.put<T>(endpointUrl, null, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getConfirmUserAccountEndpoint(userId, confirmationCode));
      }));
  }

  getRecoverPasswordEndpoint<T>(usernameOrEmail: string): Observable<T> {
    const endpointUrl = this.recoverPasswordUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify({ usernameOrEmail }), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getRecoverPasswordEndpoint(usernameOrEmail));
      }));
  }

  getResetPasswordEndpoint<T>(usernameOrEmail: string, newPassword: string, resetCode: string): Observable<T> {
    const endpointUrl = this.resetPasswordUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify({ usernameOrEmail, password: newPassword, resetcode: resetCode }), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getResetPasswordEndpoint(usernameOrEmail, newPassword, resetCode));
      }));
  }

  getUnblockUserEndpoint<T>(userId: string): Observable<T> {
    const endpointUrl = `${this.unblockUserUrl}/${userId}`;
    return this.http.put<T>(endpointUrl, null, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUnblockUserEndpoint(userId));
      }));
  }

  getDeleteUserEndpoint<T>(userId: string): Observable<T> {
    const endpointUrl = `${this.usersUrl}/${userId}`;
    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getDeleteUserEndpoint(userId));
      }));
  }



  getRoleData<T>(): Observable<T> {
    const endpointUrl = this.rolesUrl;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getRoleData());
      }));
  }

  getRoleEndpoint<T>(roleId: string): Observable<T> {
    const endpointUrl = `${this.rolesUrl}/${roleId}`;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getRoleEndpoint(roleId));
      }));
  }


  getRoleByRoleNameEndpoint<T>(roleName: string): Observable<T> {
    const endpointUrl = `${this.roleByRoleNameUrl}/${roleName}`;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getRoleByRoleNameEndpoint(roleName));
      }));
  }



  getRolesEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
    const endpointUrl = page && pageSize ? `${this.rolesUrl}/${page}/${pageSize}` : this.rolesUrl;
    debugger
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getRolesEndpoint(page, pageSize));
      }));
  }

  getNewRoleEndpoint<T>(roleObject: any): Observable<T> {

    return this.http.post<T>(this.rolesUrl, JSON.stringify(roleObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getNewRoleEndpoint(roleObject));
      }));
  }

  getUpdateRoleEndpoint<T>(roleObject: any, roleId: string): Observable<T> {
    const endpointUrl = `${this.rolesUrl}/${roleId}`;

    return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUpdateRoleEndpoint(roleObject, roleId));
      }));
  }

  getDeleteRoleEndpoint<T>(roleId: string): Observable<T> {
    const endpointUrl = `${this.rolesUrl}/${roleId}`;
    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getDeleteRoleEndpoint(roleId));
      }));
  }


  getPermissionsEndpoint<T>(): Observable<T> {
    return this.http.get<T>(this.permissionsUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getPermissionsEndpoint());
      }));
  }

  getSiteEndpoint<T>(): Observable<T> {
    const endpointUrl = this.sitesUrl;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUserEndpoint());
      }));
  }
  getNewSiteEndpoint<T>(siteObject: any): Observable<T> {
    const endpointUrl = this.sitesUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify(siteObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getNewRoleEndpoint(siteObject));
      }));
  }

  updateSiteEndpoint<T>(siteObject: any): Observable<T> {
    const endpointUrl = this.sitesUrl;
    return this.http.put<T>(endpointUrl, JSON.stringify(siteObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getNewRoleEndpoint(siteObject));
      }));
  }


  getUserFileEndpoint<T>(userId: any): Observable<T> {
    const endpointUrl = this.UserFilesUrl + '/' + userId;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUserFileEndpoint(userId));
      }));
  }

  getTypeCddmtDataEndpoint<T>(classTypeId: any): Observable<T> {
    const endpointUrl = this.typeCddmtData + '/' + classTypeId;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getTypeCddmtDataEndpoint(classTypeId));
      }));
  }
  deleteUserFileEndpoint<T>(fileRepositoryId: string): Observable<T> {
    const endpointUrl = this.deleteUserFileData + '/' + fileRepositoryId;

    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.deleteUserFileEndpoint(fileRepositoryId));
      }));
  }

  getDeleteSiteEndpoint<T>(siteId: string): Observable<T> {
    const endpointUrl = this.sitesUrl + '?SiteId=' + siteId;
    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getDeleteSiteEndpoint(siteId));
      }));
  }

  getUserDataById<T>(userId: string): Observable<T> {
    const endpointUrl = this.userDataById + '?userId=' + userId;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUserDataById(userId));
      }));
  }

  // Proiect API
  getProjectEndpoint<T>(): Observable<T> {
    const endpointUrl = this.projectUrl;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getProjectEndpoint());
      }));
  }


  getLookUpData<T>(): Observable<T> {
    const endpointUrl = this.lookUpData;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getLookUpData());
      }));
  }


  newProjectEndpoint<T>(projectObject: any): Observable<T> {
    const endpointUrl = this.projectUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify(projectObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.newProjectEndpoint(projectObject));
      }));
  }

  updateProjectEndpoint<T>(projectObject: any): Observable<T> {
    const endpointUrl = this.projectUrl;
    return this.http.put<T>(endpointUrl, JSON.stringify(projectObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.updateProjectEndpoint(projectObject));
      }));
  }

  getStoresByProjectId<T>(ProjectId: any): Observable<T> {
    const endpointUrl = this.getStoresByProjectIdUrl + '/' + ProjectId;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getStoresByProjectId(ProjectId));
      }));
  }


  getLookUpDetailsByTypeId<T>(TypeId: any): Observable<T> {
    const endpointUrl = this.getLookUpDetailsByTypeIdUrl + '/' + TypeId;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getLookUpDetailsByTypeId(TypeId));
      }));
  }


  getRepositoryByProjectEndpoint<T>(ProjectId: any): Observable<T> {
    const endpointUrl = this.getRepositoryByProjectUrl + '/' + ProjectId;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getRepositoryByProjectEndpoint(ProjectId));
      }));
  }

  deleteProjectFileEndpoint<T>(repositoryId: any): Observable<T> {
    const endpointUrl = this.deleteProjectFileUrl + '/' + repositoryId;
    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.deleteProjectFileEndpoint(repositoryId));
      }));
  }



  AddLookUpEndpoint<T>(lookUpObject: any): Observable<T> {
    const endpointUrl = this.AddlookUpData;
    return this.http.post<T>(endpointUrl, JSON.stringify(lookUpObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.AddLookUpEndpoint(lookUpObject));
      }));
  }

  updateLookUpEndpoint<T>(lookUpObject: any): Observable<T> {
    const endpointUrl = this.UpdateLookUpData;
    return this.http.put<T>(endpointUrl, JSON.stringify(lookUpObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.updateLookUpEndpoint(lookUpObject));
      }));
  }
  getDeleteLookUpEndpoint<T>(LookUpId: string): Observable<T> {
    const endpointUrl = this.deleteLookUpData + '/' + LookUpId;
    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getDeleteLookUpEndpoint(LookUpId));
      }));
  }

  deleteProjectEndpoint<T>(ProjectId: any): Observable<T> {
    const endpointUrl = this.projectUrl + '?ProjectId=' + ProjectId;
    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.deleteProjectEndpoint(ProjectId));
      }));
  }

  getProjectsBySiteEndpoint<T>(SiteId: any): Observable<T> {
    const endpointUrl = this.getProjectsBySiteUrl + '/' + SiteId;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getProjectsBySiteEndpoint(SiteId));
      }));
  }

  getLocationsByProjectEndPoint<T>(ProjectId: any): Observable<T> {
    const endpointUrl = this.getLocationsByProjectUrl + '/' + ProjectId;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getLocationsByProjectEndPoint(ProjectId));
      }));
  }

  getLocationEndpoint<T>(): Observable<T> {
    const endpointUrl = this.locationUrlData;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getLocationEndpoint());
      }));
  }
  addLocationEndpoint<T>(locationObject: any): Observable<T> {
    const endpointUrl = this.locationUrlData;

    return this.http.post<T>(endpointUrl, JSON.stringify(locationObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.addLocationEndpoint(locationObject));
      }));
  }
  upDateLocationEndpoint<T>(locationObject: any): Observable<T> {
    const endpointUrl = this.locationUrlData;

    return this.http.put<T>(endpointUrl, JSON.stringify(locationObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.upDateLocationEndpoint(locationObject));
      }));
  }

  deleteLocationEndpoint<T>(locationId: any): Observable<T> {
    const endpointUrl = this.locationUrlData + '?LocationId=' + locationId;
    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.deleteLocationEndpoint(locationId));
      }));
  }



  getAssetGroupEndPoint<T>(): Observable<T> {
    const endpointUrl = this.getAssetGroup;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getAssetGroupEndPoint());
      }));
  }
  addAssetGroupEndpoint<T>(assGroupObject): Observable<T> {
    const endpointUrl = this.addAssetGroup;
    return this.http.post<T>(endpointUrl, JSON.stringify(assGroupObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.addAssetGroupEndpoint(assGroupObject));
      }));
  }
  upDateAssetGroupEndpoint<T>(assGroupObject): Observable<T> {
    const endpointUrl = this.upDateAssetGroup;
    return this.http.put<T>(endpointUrl, JSON.stringify(assGroupObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.upDateAssetGroupEndpoint(assGroupObject));
      }));
  }

  deleteAssetGroupEndpoint<T>(assetGroupId: any): Observable<T> {
    const endpointUrl = this.deleteAssetGroup + '/' + assetGroupId;
    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.deleteAssetGroupEndpoint(assetGroupId));
      }));
  }

  getAssetGroupEndpointById<T>(assetGroupId: any): Observable<T> {
    const endpointUrl = this.getAssetGroupDataById + '?assetId=' + assetGroupId;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getAssetGroupEndpointById(assetGroupId));
      }));
  }

  // Asset Locations
  getAssetsEndpoint<T>(): Observable<T> {
    const endpointUrl = this.getAssetLocationUrl;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getAssetsEndpoint());
      }));
  }

  addAssetEndpoint<T>(reqObject): Observable<T> {
    const endpointUrl = this.addAssetLocationUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.addAssetEndpoint(reqObject));
      }));
  }

  updateAssetEndpoint<T>(reqObject): Observable<T> {
    const endpointUrl = this.updateAssetLocationUrl;
    return this.http.put<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.updateAssetEndpoint(reqObject));
      }));
  }
  deleteAssetEndpoint<T>(assetId: any): Observable<T> {
    const endpointUrl = this.deleteAssetLocationUrl + '/' + assetId;
    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.deleteAssetEndpoint(assetId));
      }));
  }
 
  //get supplier

  getSuppliersEndpoint<T>(): Observable<T> {
    const endpointUrl = this.getAllSupplier;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getSuppliersEndpoint());
      }));
  }

  
  AddsupplierEndPoint<T>(supplierObject: any): Observable<T> {
    const endpointUrl = this.AddSupplierDetials;
    return this.http.post<T>(endpointUrl, JSON.stringify(supplierObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.AddsupplierEndPoint(supplierObject));
      }));
  }

  
  updatesupplierEndpoint<T>(reqObject): Observable<T> {
    const endpointUrl = this.UpdateSupplierDetials;
    return this.http.put<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.updatesupplierEndpoint(reqObject));
      }));
  }
 
 
  deletesupplierEndpoint<T>(supplierId: any): Observable<T> {
    const endpointUrl = this.DeleteSupplierByID + '?supplierId=' + supplierId;
    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.deletesupplierEndpoint(supplierId));
      }));
  }


  deleteAssetRepositoryEndpoint<T>(repositoryId: any): Observable<T> {
    const endpointUrl = this.deleteAssetRepositoryUrl + '/' + repositoryId;
    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.deleteAssetRepositoryEndpoint(repositoryId));
      }));
  }

  getAssetRepositoryEndpoint<T>(assetId: any): Observable<T> {
    const endpointUrl = this.getAssetRepositoryUrl + '/' + assetId;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getAssetRepositoryEndpoint(assetId));
      }));
  }

  getitemEndpoint<T>(){
    const endpointUrl = this.getAllitem;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getitemEndpoint());
      }));
  }
  addAllItemtEndpoint<T>(itemObject: any): Observable<T> {
    const endpointUrl = this.AddAllitemdata;
    return this.http.post<T>(endpointUrl, JSON.stringify(itemObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.addAllItemtEndpoint(itemObject));
      }));
  }
  updateitemEndpoint<T>(reqObject){
    const endpointUrl = this.updateitem;
    return this.http.put<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.updateitemEndpoint(reqObject));
      }));
  }

  deleteitemEndpoint<T>(itemId: any): Observable<T> {
    const endpointUrl = this.deleteitem + '?itemId=' + itemId;
    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.deleteitemEndpoint(itemId));
      }));
  }

  getPurchaseOrderEndpoint<T>(){
    const endpointUrl = this.purchaseOrderUrl;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getPurchaseOrderEndpoint());
      }));
  }

  AddPurchaseOrderEndpoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.purchaseOrderUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.AddPurchaseOrderEndpoint(reqObject));
      }));
  }

  UpdatePurchaseOrderEndpoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.purchaseOrderUrl;
    return this.http.put<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.UpdatePurchaseOrderEndpoint(reqObject));
      }));
  }

  getItemsByPurchaseIdEndpoint<T>(purchaseId: any): Observable<T> {
    const endpointUrl = this.getItemsByPurchaseIdUrl + '/' + purchaseId;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getItemsByPurchaseIdEndpoint(purchaseId));
      }));
  }

  deletePurchaseOrderEndpoint<T>(purchaseId: any): Observable<T> {
    const endpointUrl = this.purchaseOrderUrl + '?PurchaseId=' + purchaseId;
    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.deletePurchaseOrderEndpoint(purchaseId));
      }));
  }

  AcceptPurchaseOrderEndpoint<T>(purchaseId: any): Observable<T> {
    const endpointUrl = this.AddAcceptOrder + '/' + purchaseId;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.AcceptPurchaseOrderEndpoint(purchaseId));
      }));
  }
  RejectPurchaseOrderEndpoint<T>(purchaseId: any): Observable<T> {
    const endpointUrl = this.RejectOrder + '/' + purchaseId;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.RejectPurchaseOrderEndpoint(purchaseId));
      }));
  }

  getWorkOrderEndpoint<T>(){
    const endpointUrl = this.workOrderUrl;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getWorkOrderEndpoint());
      }));
  }

  AddWorkOrderEndpoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.workOrderUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.AddWorkOrderEndpoint(reqObject));
      }));
  }

  UpdateWorkOrderEndpoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.workOrderUrl;
    return this.http.put<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.UpdateWorkOrderEndpoint(reqObject));
      }));
  }
  
  AcceptWorkOrderEndpoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.AddAcceptWorkOrder;
    return this.http.post<T>(endpointUrl,JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.AcceptWorkOrderEndpoint(reqObject));
      }));
  }
  RejectWorkOrderEndpoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.RejectWorkOrder;
    return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.RejectWorkOrderEndpoint(reqObject));
      }));
  }
  CloseWorkOrderEndpoint<T>(reqObject: any):Observable<T>{
    const endpointUrl = this.CloseWorkOrder;
    return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.CloseWorkOrderEndpoint(reqObject));
      }));
  }

  getItemsByWorkOrderIdEndpoint<T>(workOrderId: any): Observable<T> {
    const endpointUrl = this.getItemsByWorkOrderIdUrl + '/' + workOrderId;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getItemsByWorkOrderIdEndpoint(workOrderId));
      }));
  }

  getAssetsByLocationIdEndpoint<T>(Id: any): Observable<T> {
    const endpointUrl = this.getAssetsByLocationIdUrl + '/' + Id;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getAssetsByLocationIdEndpoint(Id));
      }));
  }
  
  deleteWorkOrderEndpoint<T>(workOrderId: any): Observable<T> {
    const endpointUrl = this.deleteWorkOrder + '?workOrderId=' + workOrderId;
    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.deleteWorkOrderEndpoint(workOrderId));
      }));
  }
  
  
  getProjectsByUserIdEndPoint<T>(Id: any): Observable<T> {
    const endpointUrl = this.getProjectsByUserIdUrl + '/' + Id;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getProjectsByUserIdEndPoint(Id));
      }));
  }


  getSitesByProjectIdEndPoint<T>(Id: any): Observable<T> {
    const endpointUrl = this.getSitesByProjectIdUrl + '/' + Id;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getSitesByProjectIdEndPoint(Id));
      }));
  }
  
  UpdateInventoryEndpoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.updateInventory;
    return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.UpdateInventoryEndpoint(reqObject));
      }));
  }

  getProjectsByUserIdandSiteIdEndPoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.getProjectsByUserIdandSiteIdUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getProjectsByUserIdandSiteIdEndPoint(reqObject));
      }));
  }

  getSitesByUserIdEndPoint<T>(Id: any): Observable<T> {
    const endpointUrl = this.getSitesByUserIdUrl + '/' + Id;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getSitesByUserIdEndPoint(Id));
      }));
  }

  getExportWorkOrdersEndPoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.getExportWorkOrdersUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getExportWorkOrdersEndPoint(reqObject));
      }));
  }
  
  getAllInventoryEndpoint<T>(): Observable<T> {
    const endpointUrl = this.getAllInventoryUrl;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getAllInventoryEndpoint());
      }));
  }

  //PreventiveMaintenance
  
  getpreventiveEndpoint<T>():Observable<T>{
    const endpointUrl = this.getPreventiveMaintenance;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getpreventiveEndpoint());
      }));
  }
  AddMaintenanceEndpoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.getPreventiveMaintenance;
    return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.AddMaintenanceEndpoint(reqObject));
      }));
  }
  UpdateMaintenanceEndpoint<T>(reqObject): Observable<T> {
    const endpointUrl = this.getPreventiveMaintenance;
    return this.http.put<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.UpdateMaintenanceEndpoint(reqObject));
      }));
  }

  getPMAssetsbyPMIdEndPoint<T>(Id: any): Observable<T> {
    const endpointUrl = this.getPMAssetsbyPMIdUrl + '/' + Id;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getPMAssetsbyPMIdEndPoint(Id));
      }));
  }

  // Job Plan

  getJobPlanEndPoint<T>():Observable<T>{
    const endpointUrl = this.getJobPlanUrl;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getJobPlanEndPoint());
      }));
  }

  AddJobPlanEndPoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.getJobPlanUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.AddJobPlanEndPoint(reqObject));
      }));
  }

  UpdateJobPlanEndPoint<T>(reqObject): Observable<T> {
    const endpointUrl = this.getJobPlanUrl;
    return this.http.put<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.UpdateJobPlanEndPoint(reqObject));
      }));
  }

  getJobTaskByJobPlanIdEndPoint<T>(Id: any): Observable<T> {
    const endpointUrl = this.getJobTaskByJobPlanIdUrl + '/' + Id;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getJobTaskByJobPlanIdEndPoint(Id));
      }));
  }

  deleteJobPlanEndpoint<T>(Id: any): Observable<T> {
    const endpointUrl = this.getJobPlanUrl + '?JobPlanId=' + Id;
    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.deleteJobPlanEndpoint(Id));
      }));
  }

  deletePMProcedureEndpoint<T>(Id: any): Observable<T> {
    const endpointUrl = this.getPreventiveMaintenance + '?PmId=' + Id;
    return this.http.delete<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.deletePMProcedureEndpoint(Id));
      }));
  }

  getAssetsBySearchEndPoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.getAssetsBySearchUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getAssetsBySearchEndPoint(reqObject));
      }));
  }

  getLocationsBySearchEndPoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.getLocationsBySearchUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getLocationsBySearchEndPoint(reqObject));
      }));
  }

  
  getJobPlansByProjectEndpoint<T>(Id: any): Observable<T> {
    const endpointUrl = this.getJobPlansByProjectUrl + '/' + Id;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getJobPlansByProjectEndpoint(Id));
      }));
  }

  getAssetsByProjectEndPoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.getAssetsByProjectUrl;
    return this.http.post<T>(endpointUrl,JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getAssetsByProjectEndPoint(reqObject));
      }));
  }
  

  getPMOrderEndpoint<T>(){
    const endpointUrl = this.getPmOrderUrl;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getWorkOrderEndpoint());
      }));
  }

  addPmOrderEndPoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.addPmOrder;
    return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.addPmOrderEndPoint(reqObject));
      }));
  }
  
  getWorkOrdersDashboardEndpoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.getWorkOrderDashboardCountUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getWorkOrdersDashboardEndpoint(reqObject));
      }));
  }

  getWorkOrderStatusCountEndpoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.getWorkOrderStatusCountUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getWorkOrderStatusCountEndpoint(reqObject));
      }));
  }

  getWorkOrdersByTradeCountEndPoint<T>(reqObject: any): Observable<T> {
    const endpointUrl = this.getWorkOrdersByTradeCountUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getWorkOrdersByTradeCountEndPoint(reqObject));
      }));
  }
 // 

 
 getExportSiteEndPoint<T>(reqObject: any): Observable<T> {
  const endpointUrl = this.exportsiteUrl;
  return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
    catchError(error => {
      return this.handleError(error, () => this.getExportSiteEndPoint(reqObject));
    }));
}

getExportProjectEndPoint<T>(reqObject: any): Observable<T> {
  const endpointUrl = this.exportProject;
  return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
    catchError(error => {
      return this.handleError(error, () => this.getExportProjectEndPoint(reqObject));
    }));
}

getExportLocationEndPoint<T>(reqObject: any): Observable<T> {
  const endpointUrl = this.exportLocation;
  return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
    catchError(error => {
      return this.handleError(error, () => this.getExportLocationEndPoint(reqObject));
    }));
}

getExportMasterEndPoint<T>(reqObject: any): Observable<T> {
  const endpointUrl = this.exportLookUpData;
  return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
    catchError(error => {
      return this.handleError(error, () => this.getExportMasterEndPoint(reqObject));
    }));
}



getExportItemEndPoint<T>(reqObject: any): Observable<T> {
  const endpointUrl = this.exportItem;
  return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
    catchError(error => {
      return this.handleError(error, () => this.getExportItemEndPoint(reqObject));
    }));
}

getExportSupplierEndPoint<T>(reqObject: any): Observable<T> {
  const endpointUrl = this.exportSupplier;
  return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
    catchError(error => {
      return this.handleError(error, () => this.getExportSupplierEndPoint(reqObject));
    }));
}

getExportAssetEndPoint<T>(reqObject: any): Observable<T> {
  const endpointUrl = this.exportAssetLocation;
  return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
    catchError(error => {
      return this.handleError(error, () => this.getExportAssetEndPoint(reqObject));
    }));
}

getExportPurchaseOrderEndPoint<T>(reqObject: any): Observable<T> {
  const endpointUrl = this.exportPurchaseOrder;
  return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
    catchError(error => {
      return this.handleError(error, () => this.getExportPurchaseOrderEndPoint(reqObject));
    }));
}

getExportInventoryEndPoint<T>(reqObject: any): Observable<T> {
  const endpointUrl = this.exportInventory;
  return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
    catchError(error => {
      return this.handleError(error, () => this.getExportInventoryEndPoint(reqObject));
    }));
}

getExportJobPlanEndPoint<T>(reqObject: any): Observable<T> {
  const endpointUrl = this.exportJobPlan;
  return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
    catchError(error => {
      return this.handleError(error, () => this.getExportJobPlanEndPoint(reqObject));
    }));
}

getExportPMProcedureEndPoint<T>(reqObject: any): Observable<T> {
  const endpointUrl = this.expoerPMProcedure;
  return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
    catchError(error => {
      return this.handleError(error, () => this.getExportPMProcedureEndPoint(reqObject));
    }));
}

getExportPMOrdersEndPoint<T>(reqObject: any): Observable<T> {
  debugger
  const endpointUrl = this.exportPMOrders;
  return this.http.post<T>(endpointUrl, JSON.stringify(reqObject), this.requestHeaders).pipe<T>(
    catchError(error => {
      return this.handleError(error, () => this.getExportPMOrdersEndPoint(reqObject));
    }));
}
  
}
