import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MessageSeverity, AlertService } from 'src/app/services/alert.service';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { LookupDialogComponent } from '../lookup-dialog/lookup-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Utilities } from 'src/app/services/utilities';
import { Permission } from 'src/app/models/permission.model';
@Component({
  selector: 'app-lookup-list',
  templateUrl: './lookup-list.component.html',
  styleUrls: ['./lookup-list.component.scss']
})
export class LookupListComponent implements OnInit {
  loadingIndicator: boolean;
  displayedColumn = ['description', 'name1', 'name2', 'remarks', 'isActive', 'Actions'];
  dataSource = new MatTableDataSource<any>();
  lookUpData: any[] = [];
  sourcelookup: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;

  constructor(private authService: AuthService, private alertService: AlertService,
    private accountService: AccountService,
    private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    debugger
    this.getLookUp();
  }

  //get LookUp Details
  getLookUp() {
    this.accountService.getLookUPData().subscribe((result: any) => {
      this.lookUpData = result.listResult;
      this.dataSource.data = this.lookUpData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Based on search value to get LookUp Details
  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
    if (this.dataSource.filteredData.length == 0) {
      this.displayNoRecords = true;
    } else {
      this.displayNoRecords = false;
    }
  }

  // premissions
  get canAddStores() {
    return this.accountService.userHasPermission(Permission.addStoresPermission);
  }

  get canEditStores() {
    return this.accountService.userHasPermission(Permission.editStoresPermission);
  }

  get canDeleteStores() {
    return this.accountService.userHasPermission(Permission.deleteStoresPermission);
  }

  private refresh() {
    // Causes the filter to refresh there by updating with recently added data.
    this.applyFilter(this.dataSource.filter);
  }

  //Update LookUp Details
  private updateLookUp(response: any) {
    if (this.sourcelookup) {
      this.getLookUp();
      this.alertService.showMessage('Success', response.endUserMessage, MessageSeverity.success)
      this.sourcelookup = null;
    } else {
      this.getLookUp();
      this.alertService.showMessage('Success', response.endUserMessage, MessageSeverity.success)
    }
  }
 
  //Edit LookUp Details
  editlookup(lookUp?: any) {
    this.sourcelookup = lookUp;
    const dialogRef = this.dialog.open(LookupDialogComponent,
      {
        panelClass: 'mat-dialog-md',
        data: { lookUp }
      });
    dialogRef.afterClosed().subscribe(LookUPresponse => {
      if (LookUPresponse) {
        this.updateLookUp(LookUPresponse);
      }
    });
  }

  //Confrom Delete
  public confirmDelete(lookUp: any) {
    debugger;
    this.snackBar.open(`Delete ${lookUp.name1}?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage('Deleting...');
        this.loadingIndicator = true;
        this.accountService.deleteLookUp(lookUp)
          .subscribe((results: any) => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            if (results.isSuccess) {
              this.getLookUp();
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

   //ExportToExcel
   download = function () {
    this.alertService.startLoadingMessage();
    this.accountService.ExportLookUp(this.lookUpData).subscribe((result) => {
      this.alertService.stopLoadingMessage();
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "LookUp.xlsx";
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
