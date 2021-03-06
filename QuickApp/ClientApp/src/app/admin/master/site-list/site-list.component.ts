import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { MatDialog } from '@angular/material/dialog';
import { SiteDialogComponent } from '../site-dialog/site-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { SiteLocationComponent } from '../site-location/site-location.component';
import { Utilities } from 'src/app/services/utilities';
import { Permission } from 'src/app/models/permission.model';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { AccountService } from 'src/app/services/account.service';

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
  displayedColumns = ['siteReference', 'name1', 'name2', 'address', 'isActive', 'Actions'];

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;
  language: string;
  constructor(private accountService: AccountService, private snackBar: MatSnackBar, private alertService: AlertService,
    private dialog: MatDialog) { 
   

    }

  ngOnInit() {
    this.getSites();
  }



  private getSites() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getSiteData()
      .subscribe((results: any) => {
        this.siteList = results.listResult == null ? [] : results.listResult;
        
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

  // For Search
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

  // To update site
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


  //on Add and Edit Site
  public onEditSite(site?) {
    this.sourceSite = site;
    const dialogRef = this.dialog.open(SiteDialogComponent,
      {
        panelClass: 'mat-dialog-md',
        data: { site }
      });
    dialogRef.afterClosed().subscribe(siteresponse => {
      if (siteresponse) {
        this.updateSite(siteresponse);
      }
    });
  }

  // Site Location view
  onViewSiteLocaction(site) {
    this.sourceSite = site;
    const dialogRef = this.dialog.open(SiteLocationComponent,
      {
        panelClass: 'mat-dialog-md',
        data: { site }
      });
    dialogRef.afterClosed().subscribe(siteresponse => {

    });
  }

  // Delete site
  public confirmDeletes(site: any) {
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

 
// permissions
  get canAddSites() {
    return this.accountService.userHasPermission(Permission.addSitesPermission);
  }

  get canEditSites() {
    return this.accountService.userHasPermission(Permission.editSitesPermission);
  }

  get canDeleteSites() {
    return this.accountService.userHasPermission(Permission.deleteSitesPermission);
  }

  //Delete Site 
  confirmDelete(site: any) {
    this.language = localStorage.getItem('language');
    if(this.language == 'en'){
     var msg="Are you sure you want to delete this site with relevant Information ?"
    }else{
      var msg="هل أنت متأكد أنك تريد حذف هذا الموقع بالمعلومات ذات الصلة؟"
    }
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: "Delete" + " " + site.siteReference,  msg: msg , isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Ok', cancel: 'Cancel' },
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.accountService.deleteSite(site)
          .subscribe((results: any) => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success)
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
          }
      });
  }


  
  //ExportToExcel
  download = function () {
    this.alertService.startLoadingMessage();
    this.accountService.ExportSite(this.siteList).subscribe((result) => {
      this.alertService.stopLoadingMessage();
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "SiteInfo.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      else {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage('An error Occured', null, MessageSeverity.error);
      }
    },
      error => {
        this.alertService.showStickyMessage('An error Occured', null, MessageSeverity.error);
      })
  }

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

}
