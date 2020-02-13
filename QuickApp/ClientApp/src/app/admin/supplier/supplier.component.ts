import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {
  loadingIndicator: boolean;
  sourcesupplier: any;
  displayedColumns=['name1','name2','address','email','contactNumber','isActive','Actions']
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;
 @ViewChild(MatPaginator, { static: true }) storePaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) storeSort: MatSort;
  supplierIds: any[] = [];
  isAllow: boolean = false;
  //projectRepositories: any[] = [];
  supplierList:any[]=[];
  isAddingsupplier: boolean = false;
  supplierData: any = {};
  isNewsupplier: boolean = false;
  isViewsupplier: boolean = false;
  supplierForm: FormGroup;
 
  constructor(private accountService: AccountService,
     private authService: AuthService,
     private formBuilder: FormBuilder,
     private snackBar: MatSnackBar, 
     private alertService: AlertService,) { }

  ngOnInit() {
    this.buildForm();
    this.getsuppliers();
  }
 
 private buildForm() {
  this.supplierForm=this.formBuilder.group({
    name1:['',Validators.required],
    name2:['',Validators.required],
    address:['',Validators.required],
    email:['',Validators.required],
    contactNumber:['',Validators.required],
    isActive:[true],
    file:[''],
    note:['']
  })
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

 private getsuppliers(){
  this.alertService.startLoadingMessage();
  this.loadingIndicator = true;
  this.accountService.getsupplierdata()
  .subscribe((results: any)=>{
    this.supplierList = results.listResult == null ? [] : results.listResult;
    this.dataSource.data = this.supplierList;
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;
  },
    error => {
      this.alertService.stopLoadingMessage();
      this.loadingIndicator = false;
    });
  }
  
  editClick(supplier?: any) {
    this.isAllow = false;
    this.supplierList = [];
    this.isAddingsupplier = true;
    this.sourcesupplier = supplier;
    this.supplierData = supplier;
    if (this.supplierData) {
      this.isNewsupplier = false;
      this.supplierData.storeId.forEach(element => {
      //this.storeIds.push(element.storeId)
      });
      
    } else {
      this.supplierData = {};
      this.isNewsupplier = true;
      this.supplierData.isActive = true;
    }
    this.resetForm();
  }

  confirmDelete(){

  }
  public resetForm(stopEditing: boolean = false) {
    if (!this.supplierData) {
      this.isNewsupplier = true;
    } else {
      this.buildForm();
    }
   
  }

 
  saveProject(){

  }
 
  onCancelClick() {
    this.isAddingsupplier = false;
  }
  onCancelViewStore(){

  }
  // File Change Event
  uploadFile(event){
 
    
  }


}
