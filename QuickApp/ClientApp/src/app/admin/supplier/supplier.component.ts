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
  displayedColumns=['Name1','Name2','ContactNumber','Address','Email','Note','isActive','Actions']

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;

  storeDataSource:any[]=[
    {Name1:'sabitha',Name2:'sabitha',ContactNumber:'7976878',Address:'jntu',Email:'sabitha@gmail.com',Note:'kjkdj',isActive:'true'}    
  ];
  
  @ViewChild(MatPaginator, { static: true }) storePaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) storeSort: MatSort;
  supplierIds: any[] = [];
  isAllow: boolean = false;
  //projectRepositories: any[] = [];
  supplierFileList: any[] = [];
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
  }

  onViewClick(row){
    this.isViewsupplier = true
    this.alertService.startLoadingMessage();
  }


private buildForm() {
  this.supplierForm=this.formBuilder.group({
    Name1:['',Validators.required],
    Name2:['',Validators.required],
    ContactNumber:['',Validators.required],
    Address:['',Validators.required],
    Email:['',Validators.required],
    Note:['',Validators.required],
    isActive:[true]
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
  editClick(supplier?: any) {
    this.supplierIds = [];
    this.isAllow = false;
    //this.projectRepositories = [];
   // this.editDocumentsList = [];
    this.supplierFileList = [];
    this.isAddingsupplier = true;
    this.sourcesupplier = supplier;
    //this.getDocuments();
    this.supplierData = supplier;
    if (this.supplierData) {
      this.isNewsupplier = false;
      this.supplierData.supplierIds.forEach(element => {
        this.supplierIds.push(element.supplierIds)
      });
     // this.getRepositoryByProject()
    } else {
      this.supplierData = {};
      this.isNewsupplier = true;
      this.supplierData.isActive = true;
    }
    this.resetForm();
  }

  
  public resetForm(stopEditing: boolean = false) {
    if (!this.supplierData) {
      this.isNewsupplier = true;
    } else {
      this.buildForm();
    }
    this.supplierForm.reset({
      projectReference: this.supplierData.projectReference || '',
      //siteId: this.projectData.siteId || '',
      storeId: this.isNewsupplier ? this.supplierData.storeId : this.supplierIds || '',
      name1: this.supplierData.name1 || '',
      name2: this.supplierData.name2 || '',
      projectDetails: this.supplierData.projectDetails || '',
      isActive: this.supplierData.isActive || '',
    });
  }

  saveProject(){

  }
  onCancelClick(){

  }
  onCancelViewStore(){

  }

}
