import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-purchaseorder',
  templateUrl: './purchaseorder.component.html',
  styleUrls: ['./purchaseorder.component.scss']
})
export class PurchaseorderComponent implements OnInit {
  loadingIndicator: boolean;
  displayedColumns:['supplierId','Name1','Items','ArrivingDate','isActive','Actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords:boolean;
  @Input() purchaseorder: any = {}
  orderForm: FormGroup;

  constructor(private accountService: AccountService,
    private alertService: AlertService,
    private authService: AuthService,private dialog: MatDialog,
    private formBuilder: FormBuilder, ) { }

  Purchaseorder:any[]=[{
    supplierId:'2',Name1:'Sabitha',Items:'electronics',ArrivingDate:'20-2-1-2020',isActive:'true'
  }]

  ngOnInit() {
    this.dataSource.data = this.Purchaseorder;
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


