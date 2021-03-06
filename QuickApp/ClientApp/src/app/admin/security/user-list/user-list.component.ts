// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { fadeInOut } from 'src/app/services/animations';
import { User } from 'src/app/models/user.model';
import { Role } from 'src/app/models/role.model';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { AppTranslationService } from 'src/app/services/app-translation.service';
import { AccountService } from 'src/app/services/account.service';
import { Utilities } from 'src/app/services/utilities';
import { Permission } from 'src/app/models/permission.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [fadeInOut]
})
export class UserListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  //displayedColumns = ['jobTitle', 'userName', 'fullName', 'email'];
  displayedColumns = ['employeeId', 'userName', 'name1', 'name2', 'email', 'phoneNumber','isEnabled'];
  dataSource: MatTableDataSource<User>;
  sourceUser: User;
  loadingIndicator: boolean;
  allRoles: Role[] = [];
  displayNoRecords: boolean;

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) {
    if (this.canAddUsers) {
      this.displayedColumns.push('actions');
    }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
   
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

// Based on search value to get users
  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
    if (this.dataSource.filteredData.length == 0) {
      this.displayNoRecords = true;
    } else {
      this.displayNoRecords = false;
    }
  }

  private refresh() {
    // Causes the filter to refresh there by updating with recently added data.
    this.applyFilter(this.dataSource.filter);
  }


  // to Update users
  private updateUsers(user: User) {
    if (this.sourceUser) {
      Object.assign(this.sourceUser, user);
      this.alertService.showMessage('Success', `Changes to user \"${user.userName}\" was saved successfully`, MessageSeverity.success);
      this.sourceUser = null;
    } else {
      this.dataSource.data.push(user);
      this.refresh();
      this.alertService.showMessage('Success', `User \"${user.userName}\" was created successfully`, MessageSeverity.success);
    }
  }

  // to get all users
  private loadData() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;

    if (this.canViewRoles) {
      this.accountService.getUsersAndRoles().subscribe(
        results => this.onDataLoadSuccessful(results[0], results[1]),
        error => this.onDataLoadFailed(error)
      );
    } else {
      this.accountService.getUsers().subscribe(
        users => this.onDataLoadSuccessful(users, this.accountService.currentUser.roles.map(r => new Role(r))),
        error => this.onDataLoadFailed(error)
      );
    }
  }

  private onDataLoadSuccessful(users: User[], roles: Role[]) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;
    this.dataSource.data = users;
    this.allRoles = roles;
  }

  private onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }


  // To load add and edit Pop up screen click
  public editUser(user?: User) {
    this.sourceUser = user;

    const dialogRef = this.dialog.open(EditUserDialogComponent,
      {
        panelClass: 'mat-dialog-lg',
        data: { user, roles: [...this.allRoles] }
      });
    dialogRef.afterClosed().subscribe(user => {
      if (user) {
        this.updateUsers(user);
      }
    });
  }


  // delete user
  public confirmDelete(user: User) {
    this.snackBar.open(`Delete ${user.userName}?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage('Deleting...');
        this.loadingIndicator = true;
        this.accountService.deleteUser(user)
          .subscribe(results => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.loadData();
           // this.dataSource.data = this.dataSource.data.filter(item => item !== user);
          },
            error => {
              this.alertService.stopLoadingMessage();
              this.loadingIndicator = false;

              this.alertService.showStickyMessage('Delete Error', `An error occured whilst deleting the user.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
                MessageSeverity.error, error);
            });
      });
  }

  // get canManageUsers() {
  //   return this.accountService.userHasPermission(Permission.manageUsersPermission);
  // }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permission.viewRolesPermission);
  }

  get canAssignRoles() {
    return this.accountService.userHasPermission(Permission.assignRolesPermission);
  }

  
  get canAddUsers() {
    return this.accountService.userHasPermission(Permission.addUsersPermission);
  }
  
  get canEditUsers() {
    return this.accountService.userHasPermission(Permission.editUsersPermission);
  }
  
  get canDeleteUsers() {
    return this.accountService.userHasPermission(Permission.deleteUsersPermission);
  }
}
