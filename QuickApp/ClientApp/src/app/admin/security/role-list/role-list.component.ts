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

import { EditRoleDialogComponent } from '../edit-role-dialog/edit-role-dialog.component';
import { fadeInOut } from 'src/app/services/animations';
import { Role } from 'src/app/models/role.model';
import { Permission } from 'src/app/models/permission.model';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { AppTranslationService } from 'src/app/services/app-translation.service';
import { AccountService } from 'src/app/services/account.service';
import { Utilities } from 'src/app/services/utilities';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
  animations: [fadeInOut]
})
export class RoleListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns = ['name', 'description', 'parentRoleName','usersCount', 'actions'];
  dataSource: MatTableDataSource<Role>;
  allPermissions: Permission[] = [];
  sourceRole: Role;
  editingRoleName: { name: string };
  loadingIndicator: boolean;
  displayNoRecords: boolean;

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource();
  }

  

  ngOnInit() {
    this.loadData();
  }

  // To get all roles
  private loadData() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;

    this.accountService.getRolesAndPermissions()
      .subscribe(results => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.dataSource.data = results[0];
        this.allPermissions = results[1];
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;

          this.alertService.showStickyMessage('Load Error', `Unable to retrieve roles from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
            MessageSeverity.error, error);
        });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  // Based search to get roles
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


  // To update roles grid 
  private updateRoles(role: Role) {
    if (this.sourceRole) {
      Object.assign(this.sourceRole, role);
      this.sourceRole = null;
    } else {
      this.dataSource.data.push(role);
    }
    this.loadData();
    this.refresh();
  }

 
// Add and edit role Click event
  public editRole(role?: Role) {
    this.sourceRole = role;

    const dialogRef = this.dialog.open(EditRoleDialogComponent,
      {
        panelClass: 'mat-dialog-md',
        data: { role, allPermissions: this.allPermissions }
      });
    dialogRef.afterClosed().subscribe(role => {
      if (role) {
        this.updateRoles(role);
      }
    });
  }


  // Delete role 
  public confirmDelete(role: Role) {
    this.snackBar.open(`Delete ${role.name} role?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage('Deleting...');
        this.loadingIndicator = true;

        this.accountService.deleteRole(role)
          .subscribe(results => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.dataSource.data = this.dataSource.data.filter(item => item !== role);
          },
            error => {
              this.alertService.stopLoadingMessage();
              this.loadingIndicator = false;

              this.alertService.showStickyMessage('Delete Error', `An error occured whilst deleting the role.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
                MessageSeverity.error, error);
            });
      });
  }

  // get canManageRoles() {
  //   return this.accountService.userHasPermission(Permission.manageRolesPermission);
  // }


   get canAddRoles() {
    return this.accountService.userHasPermission(Permission.addRolesPermission);
  }
  get canEditRoles() {
    return this.accountService.userHasPermission(Permission.editRolesPermission);
  }
  get canDeleteRoles() {
    return this.accountService.userHasPermission(Permission.deleteRolesPermission);
  }

}
