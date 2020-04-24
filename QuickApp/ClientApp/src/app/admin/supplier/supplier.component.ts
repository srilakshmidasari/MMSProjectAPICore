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
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {
  loadingIndicator: boolean;
  sourcesupplier: any;
  displayedColumns = ['supplierReference', 'name1', 'name2', 'address', 'email', 'contactNumber', 'note', 'isActive', 'Actions']
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;
  //  @ViewChild(MatPaginator, { static: true }) storePaginator: MatPaginator;
  //   @ViewChild(MatSort, { static: true }) storeSort: MatSort;
  @Input() supplier: any = {}
  supplierIds: any[] = [];
  isAllow: boolean = false;
  //projectRepositories: any[] = [];
  fileExtension: string;
  supplierList: any[] = [];
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
  language: string;

  constructor(private accountService: AccountService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar, private dialog: MatDialog,
    private alertService: AlertService, ) { }

  ngOnInit() {
    debugger;
    this.buildForm();
    this.getsuppliers();
  }

  private buildForm() {
    debugger;
    this.supplierForm = this.formBuilder.group({
      supplierReference: ['', Validators.required],
      name1: ['', Validators.required],
      name2: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')])],
      contactNumber: ['', Validators.required],
      isActive: [true],
      file: [''],
      note: ['']
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

  //get data
  private getsuppliers() {
    debugger;
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getsupplierdata()
      .subscribe((results: any) => {
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

  //saveing the data
  savesupplier() {
    debugger;
    if (!this.supplierForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    this.alertService.startLoadingMessage('Saving changes...');
    const editedSupplier = this.getAlldatasuppliers();
    if (this.isNewsupplier) {
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
  private getAlldatasuppliers(): any {
    debugger;
    const formModel = this.supplierForm.value;
    return {
      "id": (this.isNewsupplier == true) ? 0 : this.supplierData.id,
      "supplierReference": formModel.supplierReference,
      "name1": formModel.name1,
      "name2": formModel.name2,
      "address": formModel.address,
      "email": formModel.email,
      "contactNumber": formModel.contactNumber,
      "note": formModel.note,
      "isActive": formModel.isActive,
      "fileName": this.base64string,
      "fileLocation": null,
      "fileExtention": this.fileExtension,
      "createdBy": this.currentUser.id,
      "updatedBy": this.currentUser.id,
      "updatedDate": new Date(),
      "createdDate": new Date()
    }
  }

  get currentUser() {
    return this.authService.currentUser;
  }

  public resetForm(stopEditing: boolean = false) {
    if (!this.supplierData) {
      this.isNewsupplier = true;
    } else {
      this.buildForm();
    }
    this.supplierForm.reset({
      supplierReference: this.supplierData.supplierReference || '',
      name1: this.supplierData.name1 || '',
      name2: this.supplierData.name2 || '',
      address: this.supplierData.address || '',
      email: this.supplierData.email || '',
      contactNumber: this.supplierData.contactNumber || '',
      note: this.supplierData.note || '',
      isActive: this.supplierData.isActive || '',
    });
  }

  editClick(supplier?: any) {
    this.supplierData = {};
    this.image ="";
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
  // //Deleteing Record
  // confirmDelete(supplier:any){
  //   debugger;
  //   this.snackBar.open(`Delete ${supplier.name1}?`, 'DELETE', { duration: 5000 })
  //   .onAction().subscribe(() => {
  //     this.alertService.startLoadingMessage('Deleting...');
  //     this.loadingIndicator = true;
  //     this.accountService.deletesupplier(supplier.id)
  //     .subscribe((results: any) => {
  //       this.alertService.stopLoadingMessage();
  //       this.loadingIndicator = false;
  //       if (results.isSuccess) {
  //         this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success);
  //         this.getsuppliers();
  //       }
  //     },
  //     error => {
  //       this.alertService.stopLoadingMessage();
  //       this.loadingIndicator = false;
  //       this.alertService.showStickyMessage('Delete Error', `An error occured whilst deleting the user.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
  //         MessageSeverity.error, error);
  //     });
  //   });
  // }

  onCancelClick() {
    this.isAddingsupplier = false;
  }

  // File Change Event
  onSelectFiles(event) {
    this.fileExtension = '';
    var file = event.target.files[0];
    this.fileExtension = '.' + file.name.split('.').pop();
    if (file) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.isNewsupplier) {
          this.image = e.target.result;
        } else {
          this.supplierData.fileLocation = e.target.result;
        }
        var base64Index = e.target.result.indexOf(this.BASE64_MARKER) + this.BASE64_MARKER.length;
        this.base64string = e.target.result.substring(base64Index);
      }
      reader.readAsDataURL(file);
    }
  }
  // Accepting Only Numbers
  numberOnly(event: any) {
    const numberpattern = /[0-9\+\-.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!numberpattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  //  Accepting Only Alphabets
  alphabetsOnly(event: any) {
    const alphabetspattern = /^[a-zA-Z ]*$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!alphabetspattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  alphaNumaricsOnly(event: any) {
    const alphabetspattern = /^[a-z0-9]+$/i;
    let inputChar = String.fromCharCode(event.charCode);
    if (!alphabetspattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  //Delete Assets Groups
  confirmDelete(supplier: any) {
    debugger
    this.language = localStorage.getItem('language');
    if(this.language == 'en'){
     var msg="Are you sure you want to delete this Supplier ?"
    }else{
      var msg="هل أنت متأكد أنك تريد حذف هذا المورد؟"
     }
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: "Delete" + " " + supplier.supplierReference, msg:msg , isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Ok', cancel: 'Cancel' },
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.accountService.deletesupplier(supplier.id)
          .subscribe((results: any) => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success)
            if (results.isSuccess) {
              this.getsuppliers();
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
    this.accountService.ExportSupplier(this.supplierList).subscribe((result) => {
      this.alertService.stopLoadingMessage();
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "SupplierDetails.xlsx";
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






