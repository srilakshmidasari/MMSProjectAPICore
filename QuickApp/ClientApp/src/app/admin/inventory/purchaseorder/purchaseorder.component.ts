import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { AccountService } from 'src/app/services/account.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Utilities } from 'src/app/services/utilities';
import { DataFactory } from 'src/app/shared/dataFactory';
import { DocumentFileComponent } from '../document-file/document-file.component';
import { ReceiveItemComponent } from '../receive-item/receive-item.component';
import { Calendar } from 'primeng/calendar/calendar';

@Component({
  selector: 'app-purchaseorder',
  templateUrl: './purchaseorder.component.html',
  styleUrls: ['./purchaseorder.component.scss']
})
export class PurchaseorderComponent implements OnInit {
  loadingIndicator: boolean;
  credentials: any[] = [];
  displayedColumns = ['purchaseReference', 'supplierName', 'supplierAddress', 'projectName', 'storeName', 'arrivingDate', 'statusName', 'updatedDate', 'billindAddress', 'shippingAddress', 'remarks', 'isActive', 'Actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;
  purchasesList: any[] = [];
  purchaseData: any = {};
  isView: boolean = false;
  orderForm: FormGroup;
  isAdding: boolean = false;
  isNewPurchase: boolean = false;
  supplierList: any[] = [];
  isEdit: boolean = false;
  itemFrom: FormGroup;
  itemList: any[] = [];
  i: any;
  purchaseItemList: any[] = [];
  selectItemList: any[] = [];
  currenrDate: Date;
  projectsList: any[] = [];
  storesList: any[] = [];
  isAccepted: number;
  selectItem: any;
  duplicateItemList: any[] = [];
  itemData: any[] = [];
  purchase: any = {};
  isRejected: number;
  language: string;
  entryDate: Date;

  constructor(private accountService: AccountService, private alertService: AlertService,
    private authService: AuthService, private dialog: MatDialog, private formBuilder: FormBuilder, ) {
    this.itemFrom = this.formBuilder.group({
      credentials: this.formBuilder.array([]),
    });
    this.currenrDate = new Date();
    this.isAccepted = DataFactory.StatusTypes.Approved;
    this.isRejected = DataFactory.StatusTypes.Rejected;
  }

  ngOnInit() {
    this.getPurchaseOrders();
    this.buildForm();
    this.getProjects();
    // this.addItem(this.i);
  }


  private getPurchaseOrders() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getPurchaseOrder()
      .subscribe((results: any) => {
        this.purchasesList = results.listResult == null ? [] : results.listResult;
        //  this.dataSource.data = this.purchasesList;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.getsuppliers();
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

  addItem(i) {
    (this.itemFrom.controls['credentials'] as FormArray).push(this.createItem(i));
    // this.itemList.forEach((item) => {
    //   this.selectItemList.forEach((item1) => {
    //     if (item.id == item1.Id) {
    //       this.itemList.splice(item, 1);
    //     }
    //   });
    // });
  }

  // onSelectItem(event) {
  //   debugger
  //   this.selectItem = event;
  //   this.selectItemList.push({
  //     "Id": event
  //   })
  // }


  createItem(item) {
    return this.formBuilder.group({
      itemId: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      expectedCost: new FormControl('', [Validators.required]),
      comments: new FormControl('')
    })
  }

  buildForm() {
    this.orderForm = this.formBuilder.group({
      supplierId: ['', Validators.required],
      projectId: ['', Validators.required],
      storeId: ['', Validators.required],
      purchaseReference: ['', Validators.required],
      arrivingDate: ['', Validators.required],
      remarks: ['',Validators.required],
      billindAddress: [''],
      shippingAddress: ['']
    })
  }

  // Accepting Only Numbers
  numberOnly(event: any) {
    const numberpattern = /[0-9\+\-.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!numberpattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onCancelClick() {
    this.isAdding = false;
    this.isEdit = false;
    this.itemFrom.setControl('credentials', this.formBuilder.array([]));
  }

  //get Suppliers data
  private getsuppliers() {
    this.accountService.getsupplierdata()
      .subscribe((results: any) => {
        this.supplierList = results.listResult == null ? [] : results.listResult;
        this.getItem();
      },
        error => {
        });
  }

  private getProjects() {
    this.accountService.getProject()
      .subscribe((results: any) => {
        this.projectsList = results.listResult == null ? [] : results.listResult;
      },
        error => {
        });
  }

  // get items Data
  private getItem() {
    this.accountService.getitemdata()
      .subscribe((results: any) => {
        this.itemList = results.listResult == null ? [] : results.listResult;
        this.duplicateItemList = JSON.parse(JSON.stringify(this.itemList));
      },
        error => {
        });
  }

  getStoresByProject(event) {
    debugger
    this.storesList = [];
    this.orderForm.get('storeId').setValue(null)
    this.accountService.getStoresByProjectId(event)
      .subscribe((results: any) => {
        this.storesList = results.listResult == null ? [] : results.listResult;
      },
        error => {
        });
  }


  //get Suppliers data
  getItemsByPurchaseId(row, val) {
    this.accountService.getItemsByPurchaseId(row.id)
      .subscribe((results: any) => {
        this.purchaseItemList = results.listResult == null ? [] : results.listResult;
        this.setItems(this.purchaseItemList)
      },
        error => {
        });
  }

  setItems(itemsArray: any[]) {
    let control = this.formBuilder.array([]);
    itemsArray.forEach(x => {
      control.push(this.formBuilder.group({
        itemId: x.itemId,
        quantity: x.quantity,
        expectedCost: x.expectedCost,
        comments: x.comments
      }))
    })
    this.itemFrom.setControl('credentials', control);
  }

  Delete(index) {
    (this.itemFrom.controls['credentials'] as FormArray).removeAt(index);
  }

  addClick(purchase?: any) {
    this.purchaseData = {};
    this.isAdding = true;
    this.isNewPurchase = true;
    const arr = <FormArray>this.itemFrom.controls.credentials;
    arr.controls = [];
    this.buildForm();
    this.addItem(this.i);

  }

  onEditClick(purchase) {
    this.isEdit = true;
    this.isAdding = false;
    this.isNewPurchase = false;
    this.purchaseData = purchase;
    this.entryDate = new Date(this.purchaseData.arrivingDate)
    this.getItemsByPurchaseId(purchase, true);
    this.getStoresByProject(purchase.projectId)
    this.resetForm();
  }



  public resetForm(stopEditing: boolean = false) {
    if (!this.purchaseData) {
      this.isNewPurchase = true;
    } else {
      this.buildForm();
    }
    this.orderForm.reset({
      supplierId: this.purchaseData.supplierId || '',
      projectId: this.purchaseData.projectId || '',
      storeId: this.purchaseData.storeId || '',
      remarks: this.purchaseData.remarks || '',
      billindAddress: this.purchaseData.billingAddress || '',
      shippingAddress: this.purchaseData.shippingAddress || '',
      arrivingDate: new Date(this.purchaseData.arrivingDate) || '',
      purchaseReference: this.purchaseData.purchaseReference || ''
    });
  }




  saveOrder() {
    if (!this.orderForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    this.alertService.startLoadingMessage('Saving changes...');
    const editeditem = this.AddAllItemData();
    if (this.isNewPurchase) {
      this.accountService.AddPurchaseOrder(editeditem).subscribe(
        (response: any) => {
          this.alertService.stopLoadingMessage();
          if (response.isSuccess) {
            this.getPurchaseOrders();
            this.isAdding = false;
            this.alertService.showMessage('Success', response.endUserMessage, MessageSeverity.success)
            this.resetForm();
            this.onViewPDF(response.result);
          } else {
            this.alertService.stopLoadingMessage();
            this.alertService.showStickyMessage(response.endUserMessage, null, MessageSeverity.error);
          }
        }, error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('An error Occured', null, MessageSeverity.error);
        }
      );
    }
    else {
      this.accountService.UpdatePurchaseOrder(editeditem).subscribe(
        (response: any) => {
          this.alertService.stopLoadingMessage();
          if (response.isSuccess) {
            this.isAdding = false;
            this.isEdit = false;
            this.alertService.showMessage('Success', response.endUserMessage, MessageSeverity.success)
            this.getPurchaseOrders();
            this.onViewPDF(response.result);
          } else {
            this.alertService.stopLoadingMessage();
            this.alertService.showStickyMessage(response.endUserMessage, null, MessageSeverity.error);
          }
        }, error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('An error Occured', null, MessageSeverity.error);
        }
      );
    }
  }

  private AddAllItemData(): any {
    var purchaseItems = [];
    for (var i = 0; i < this.itemFrom.value.credentials.length; i++) {
      var itemReq = {
        "id": 0,
        "itemId": this.itemFrom.value.credentials[i].itemId,
        "purchaseId": 0,
        "quantity": parseInt(this.itemFrom.value.credentials[i].quantity),
        "expectdCost": parseFloat(this.itemFrom.value.credentials[i].expectedCost),
        "comments": this.itemFrom.value.credentials[i].comments
      }
      purchaseItems.push(itemReq);
    }
    const formModel = this.orderForm.value;
    return {
      "id": this.isNewPurchase == true ? 0 : this.purchaseData.id,
      "supplierId": formModel.supplierId,
      "arrivingDate": formModel.arrivingDate,
      "statusTypeId": DataFactory.StatusTypes.Open,
      "projectId": formModel.projectId,
      "storeId": formModel.storeId,
      "remarks": formModel.remarks,
      "billingAddress": formModel.billindAddress,
      "shippingAddress": formModel.shippingAddress,
      "fileName": "",
      "fileLocation": "",
      "fileExtention": ".pdf",
      "purchaseReference": formModel.purchaseReference,
      "isActive": true,
      "purchaseItems": purchaseItems,
      "createdBy": this.currentUser.id,
      "createdDate": new Date(),
      "updatedBy": this.currentUser.id,
      "updatedDate": new Date()
    }

  }

  get currentUser() {
    return this.authService.currentUser;
  }

  confirmDelete(order: any) {
    this.language = localStorage.getItem('language');
    if (this.language == 'en') {
      var msg = "Are you sure you want to delete this order ?"
    } else {
      var msg = "هل أنت متأكد أنك تريد حذف هذا الطلب؟"
    }
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: "Delete", msg: msg, isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Ok', cancel: 'Cancel' },
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.accountService.deletePurchaseOrder(order.id)
          .subscribe((results: any) => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success)
            if (results.isSuccess) {
              this.getPurchaseOrders();
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


  acceptClick(order: any) {
    this.language = localStorage.getItem('language');
    if (this.language == 'en') {
      var msg = "Are you sure you want to Accept this order ?"
      var title = "Accept"
    } else {
      var msg = "هل أنت متأكد أنك تريد قبول هذا الطلب؟";
      var title = "قبول"
    }
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: title, msg: msg, isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Accept', cancel: 'Cancel' },
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.accountService.AcceptPurchaseOrder(order.id)
          .subscribe((results: any) => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success)
            if (results.isSuccess) {
              this.getPurchaseOrders();
            }
          },
            error => {
              this.alertService.stopLoadingMessage();
              this.loadingIndicator = false;
              this.alertService.showStickyMessage(' Accept Error', `An error occured whilst  Accept the user.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
                MessageSeverity.error, error);
            });
      }
    });
  }

  rejectClick(order: any) {
    this.language = localStorage.getItem('language');
    if (this.language == 'en') {
      var msg = "Are you sure you want to Reject this order ?"
      var title = "Reject"
    } else {
      var msg = "هل أنت متأكد أنك تريد رفض هذا الطلب؟"
      var title = "رفض"
    }
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: title, msg: msg, isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Reject', cancel: 'Cancel' },
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.accountService.RejectPurchaseOrder(order.id)
          .subscribe((results: any) => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success)
            if (results.isSuccess) {
              this.getPurchaseOrders();
            }
          },
            error => {
              this.alertService.stopLoadingMessage();
              this.loadingIndicator = false;
              this.alertService.showStickyMessage(' Accept Error', `An error occured whilst  Accept the user.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
                MessageSeverity.error, error);
            });
      }
    });
  }

  onPdfDocument(result) {
    const dialogRef = this.dialog.open(DocumentFileComponent,
      {
        panelClass: 'mat-dialog-md',
        data: { result }
      });
    dialogRef.afterClosed().subscribe(siteresponse => {
    });
  }

  onViewDoc(row) {
    window.open(row.pdfUrl);
  }

  onViewPDF(doc) {
    window.open(doc);
  }



  onReceiveClick(row) {
    const dialogRef = this.dialog.open(ReceiveItemComponent,
      {
        panelClass: 'mat-dialog-md',
        data: { row }
      });
    dialogRef.afterClosed().subscribe(siteresponse => {

    });
  }

  onViewdetailsClick(row) {
    this.purchase = row;
    this.isView = true;
    this.isEdit = false;
  }

  closeViewpurchaseOrder() {
    this.isView = false;
  }

  //ExportToExcel
  download = function () {
    this.alertService.startLoadingMessage();
    this.accountService.ExportPurchaseOrder(this.purchasesList).subscribe((result) => {
      this.alertService.stopLoadingMessage();
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "PurchaseOrderDetails.xlsx";
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


