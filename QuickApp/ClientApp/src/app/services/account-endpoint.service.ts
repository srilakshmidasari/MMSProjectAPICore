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
  private readonly _getUserFilesUrl: string = '/api/Account/GetFilesByUserId';  
  private readonly _getTypecddmtDetails: string = '/api/Masters/GetTypecddmtDetails';
  private readonly _deleteUserFile: string = '/api/Masters/DeleteFileRepository';
  private readonly _getUserById: string = '/api/Account/users/GetUserById';
  private readonly _getLookUpData: string = '/api/Masters/GetAllLookUpDetails';

  private readonly _projectUrl: string = '/api/Project';
  private readonly _getStoresByProjectIdUrl: string = '/api/Project/GetStoresByProjectId';
  private readonly _getLookUpDetailsByTypeIdUrl: string = '/api/Masters/GetLookUpDetilas';

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
  get UserFilesUrl() { return this.configurations.baseUrl + this._getUserFilesUrl; }
  get typeCddmtData() { return this.configurations.baseUrl + this._getTypecddmtDetails; }
  get deleteUserFileData() { return this.configurations.baseUrl + this._deleteUserFile; }
  get userDataById() { return this.configurations.baseUrl + this._getUserById; }
  get projectUrl() { return this.configurations.baseUrl + this._projectUrl; }
  get lookUpData() { return this.configurations.baseUrl + this._getLookUpData; }
  get getStoresByProjectIdUrl() { return this.configurations.baseUrl + this._getStoresByProjectIdUrl; }
  get getLookUpDetailsByTypeIdUrl() { return this.configurations.baseUrl + this._getLookUpDetailsByTypeIdUrl; }

 
  

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
        return this.handleError(error, () => this.getUpdateUserEndpoint(userObject, userId));
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
    const endpointUrl = this.UserFilesUrl+'/'+userId;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUserFileEndpoint(userId));
      }));
  }

  getTypeCddmtDataEndpoint<T>(classTypeId: any): Observable<T> {
    const endpointUrl = this.typeCddmtData+'/'+classTypeId;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getTypeCddmtDataEndpoint(classTypeId));
      }));
  }
  deleteUserFileEndpoint<T>(fileRepositoryId: string): Observable<T> {
    const endpointUrl = this.deleteUserFileData+'/'+fileRepositoryId;

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

  getUserDataById<T>(userId:string): Observable<T> {
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

  getStoresByProjectId<T>(ProjectId: any): Observable<T> {
    const endpointUrl = this.getStoresByProjectIdUrl+'/'+ProjectId;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getStoresByProjectId(ProjectId));
      }));
  }


  getLookUpDetailsByTypeId<T>(TypeId: any): Observable<T> {
    const endpointUrl = this.getLookUpDetailsByTypeIdUrl+'/'+TypeId;
    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getLookUpDetailsByTypeId(TypeId));
      }));
  }
  
}
