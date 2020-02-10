import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AccountService } from '../../services/account.service';
import { MatDialog } from '@angular/material/dialog';
import { SiteDialogComponent } from '../site-dialog/site-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { SiteLocationComponent } from '../site-location/site-location.component';
import { Utilities } from 'src/app/services/utilities';
import { Permission } from 'src/app/models/permission.model';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss']
})
export class SiteListComponent implements OnInit {
  loadingIndicator: boolean;
  siteInfo: any = [];
  sourceSite: any;
  siteList: any[] = []
  displayedColumns = ['siteReference', 'name1', 'name2', 'address', 'updatedDate', 'isActive', 'Actions'];

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;
  constructor(private accountService: AccountService, private snackBar: MatSnackBar, private alertService: AlertService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getSites();
  }



  private getSites() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getSiteData()
      .subscribe((results: any) => {
        this.siteList = results.listResult == null ? [] : results.listResult;
        console.log(this.siteList)
        this.dataSource.data = this.siteList;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
        });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

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

  private updateSite(response: any) {
    if (this.sourceSite) {
      this.getSites();
      this.alertService.showMessage('Success', response.endUserMessage, MessageSeverity.success)
      this.sourceSite = null;
    } else {
      this.alertService.showMessage('Success', response.endUserMessage, MessageSeverity.success)
      this.getSites();     
    }
  }

  public onEditSite(site?) {
    this.sourceSite = site;
    const dialogRef = this.dialog.open(SiteDialogComponent,
      {
        panelClass: 'mat-dialog-md',
        data: { site }
      });
    dialogRef.afterClosed().subscribe(siteresponse => {
      if (siteresponse) {
        debugger
        this.updateSite(siteresponse);
      }
    });
  }
  onSiteLocaction(site) {
    this.sourceSite = site;
    const dialogRef = this.dialog.open(SiteLocationComponent,
      {
        panelClass: 'mat-dialog-md',
        data: { site }
      });
    dialogRef.afterClosed().subscribe(siteresponse => {

    });
  }

  public confirmDelete(site: any) {
    this.snackBar.open(`Delete ${site.name1}?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage('Deleting...');
        this.loadingIndicator = true;
        this.accountService.deleteSite(site)
          .subscribe((results: any) => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            if (results.isSuccess) {
              this.getSites();
            }
          },
            error => {
              this.alertService.stopLoadingMessage();
              this.loadingIndicator = false;
              this.alertService.showStickyMessage('Delete Error', `An error occured whilst deleting the user.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
                MessageSeverity.error, error);
            });
      });
  }

  get canManageSites() {
    return this.accountService.userHasPermission(Permission.manageSitesPermission);
  }

}
