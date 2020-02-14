import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { Utilities } from 'src/app/services/utilities';
@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {
  loadingIndicator: boolean;
  sourcesupplier: any;
  displayedColumns=['name1','name2','address','email','contactNumber','note','isActive','Actions']
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;
 @ViewChild(MatPaginator, { static: true }) storePaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) storeSort: MatSort;
  @Input() supplier:any={}
  supplierIds: any[] = [];
  isAllow: boolean = false;
  //projectRepositories: any[] = [];
  fileExtension: string;
  supplierList:any[]=[];
  isAddingsupplier: boolean = false;
  supplierData: any = {};
  isNewsupplier: boolean = false;
  isViewsupplier: boolean = false;
  supplierForm: FormGroup;
  image: any;
  BASE64_MARKER: string = ';base64,';
  base64string: string;
  @Input() allowedImageExtension: string = "jpeg , jpg , png";
  @ViewChild("fileInput", { static: false }) myInputVariable: ElementRef;
  maxSize: number;

  constructor(private accountService: AccountService,
     private authService: AuthService,
     private formBuilder: FormBuilder,
     private snackBar: MatSnackBar, 
     private alertService: AlertService,) { }

  ngOnInit() {
    debugger;
    this.buildForm();
    this.getsuppliers();
  }
 
 private buildForm() {
   debugger;
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
   debugger;
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

  savesupplier(){
    debugger;
    if(!this.supplierForm.valid){
      this.alertService.showValidationError();
      return;
    }
    this.alertService.startLoadingMessage('Saving changes...');
    const editedSupplier = this.getAlldatasuppliers();
    if(this.isNewsupplier)
    {
      this.accountService.Adddsupplier(editedSupplier).subscribe(
        (result: any) => {
          this.alertService.stopLoadingMessage();
          if (result.isSuccess) {
            this.getsuppliers();
             this.isAddingsupplier = false;
            this.alertService.showMessage('Success', result.endUserMessage, MessageSeverity.success)
            this.resetForm();
          } else {
            this.alertService.stopLoadingMessage();
            this.alertService.showStickyMessage(result.endUserMessage, null, MessageSeverity.error);
          }
        }, error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('An error Occured', null, MessageSeverity.error);
        }
      );
    }
    else {
      this.accountService.Updatesupplier(editedSupplier).subscribe(
        (result: any) => {
          this.alertService.stopLoadingMessage();
          if (result.isSuccess) {
            
            this.isAddingsupplier = false;
            this.alertService.showMessage('Success', result.endUserMessage, MessageSeverity.success)
            this.getsuppliers();
           
          } else {
            this.alertService.stopLoadingMessage();
            this.alertService.showStickyMessage(result.endUserMessage, null, MessageSeverity.error);
          }
        }, error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('An error Occured', null, MessageSeverity.error);
        }
      );
    }
  }


  
// forming Request Object
  private getAlldatasuppliers():any{
    debugger;
    const formModel = this.supplierForm.value;
   return{
    "id": (this.isNewsupplier==true)?0:this.supplierData.id,
    "name1":formModel.name1,
    "name2": formModel.name2,
    "address":formModel.address,
    "email": formModel.email,
    "contactNumber":formModel.contactNumber,
    "note": formModel.note,
    "isActive":formModel.isActive,
    "fileName":this.base64string,
    "fileLocation": null,
    "fileExtention":  this.fileExtension,
    "createdBy": this.currentUser.id,
    "updatedBy":this.currentUser.id,
    "updatedDate": new Date(),
    "createdDate": new Date()
   }
  }

  get currentUser() {
    return this.authService.currentUser;
  }

   public resetForm(stopEditing: boolean = false){
    if (!this.supplierData) {
      this.isNewsupplier = true;
    } else {
      this.buildForm();
    }
    this.supplierForm.reset({
      name1: this.supplierData.name1 || '',
      name2: this.supplierData.name2 || '',
      address: this.supplierData.address || '',
      email:this.supplierData.email || '',
      contactNumber:this.supplierData.contactNumber ||'',
      note:this.supplierData.note ||'',
      isActive: this.supplierData.isActive || '',
    });
  }

  editClick(supplier?: any) {
    debugger;
    this.supplierData = {};
    if (supplier != undefined) {
      this.isAddingsupplier = true;
      this.isNewsupplier = false;
      this.supplierData = supplier;
      this.resetForm();
    }
    else {
      this.isAddingsupplier = true;
      this.isNewsupplier = true;
      this.buildForm();
    }
  }

  confirmDelete(supplier:any){
    debugger;
    this.snackBar.open(`Delete ${supplier.name1}?`, 'DELETE', { duration: 5000 })
    .onAction().subscribe(() => {
      this.alertService.startLoadingMessage('Deleting...');
      this.loadingIndicator = true;
      this.accountService.deletesupplier(supplier.id)
      .subscribe((results: any) => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        if (results.isSuccess) {
          this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success);
          this.getsuppliers();
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
  
  onCancelClick() {
    this.isAddingsupplier = false;
  }
  
  // File Change Event
  onSelectFiles(event){
    debugger;
    this.fileExtension='';
    var file = event.target.files[0];
    this.fileExtension = '.' + file.name.split('.').pop();
    if (file) {
      let reader = new FileReader();
      reader.onload = (e: any) => {       
        var base64Index = e.target.result.indexOf(this.BASE64_MARKER) + this.BASE64_MARKER.length;
        this.base64string = e.target.result.substring(base64Index);
      }
      reader.readAsDataURL(file);
    }
   }
  }



 


