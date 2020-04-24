import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-inventory-items',
  templateUrl: './inventory-items.component.html',
  styleUrls: ['./inventory-items.component.scss']
})
export class InventoryItemsComponent implements OnInit {
  loadingIndicator: boolean;
  inventoryList: any[] = [];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns = ['itemId','itemName','quantity','storeName','projectName' ];
  displayNoRecords: boolean;
  constructor(private accountService: AccountService, private alertService: AlertService) { }

  ngOnInit() {
    this.getAllInventory();
  }

  getAllInventory() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getAllInventory()
      .subscribe((results: any) => {
        this.inventoryList = results.listResult == null ? [] : results.listResult;
        this.dataSource.data = this.inventoryList;
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

  //ExportToExcel
  download = function () {
    this.alertService.startLoadingMessage();
    this.accountService.ExportInventory(this.inventoryList).subscribe((result) => {
      this.alertService.stopLoadingMessage();
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "InventoryItemDetails.xlsx";
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
