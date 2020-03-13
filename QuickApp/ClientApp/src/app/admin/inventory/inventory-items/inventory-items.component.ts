import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';
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
  displayedColumns = ['itemName','quantity','storeName','projectName' ];
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

}
