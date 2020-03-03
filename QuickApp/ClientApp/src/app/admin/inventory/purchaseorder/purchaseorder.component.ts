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

@Component({
  selector: 'app-purchaseorder',
  templateUrl: './purchaseorder.component.html',
  styleUrls: ['./purchaseorder.component.scss']
})
export class PurchaseorderComponent implements OnInit {
  loadingIndicator: boolean;
  credentials: any[] = [];
  displayedColumns = ['purchaseReference', 'supplierName', 'supplierAddress', 'projectName','storeName', 'arrivingDate', 'statusName', 'updatedDate','billindAddress','shippingAddress', 'remarks', 'isActive', 'Actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;
  purchasesList: any[] = [];
  purchaseData: any = {};
  isViewItem: boolean = false;
  orderForm: FormGroup;
  isAdding: boolean = false;
  isNewPurchase: boolean = false;
  supplierList: any[] = [];
  isEdit: boolean = false;
  itemFrom: FormGroup;
  itemList: any[] = [];
  i: any;
  purchaseItemList: any[] = [];
  currenrDate: Date;
  projectsList: any[] = [];
  storesList: any[]=[];
  isAccepted: number;
  constructor(private accountService: AccountService, private alertService: AlertService,
    private authService: AuthService, private dialog: MatDialog, private formBuilder: FormBuilder, ) {
    this.itemFrom = this.formBuilder.group({
      credentials: this.formBuilder.array([]),
    });
    this.currenrDate = new Date();
    this.isAccepted= DataFactory.StatusTypes.Approved;
  }

  ngOnInit() {
    debugger
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
  }

  createItem(item) {
    return this.formBuilder.group({
      itemId: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      expectedCost: new FormControl('', [Validators.required]),
      comments :new FormControl('')
    })
  }

  buildForm() {
    this.orderForm = this.formBuilder.group({
      supplierId: ['', Validators.required],
      projectId :['', Validators.required],
      storeId :['', Validators.required],
      purchaseReference: ['', Validators.required],
      arrivingDate: ['', Validators.required],
      remarks :[],
      billindAddress:[''],
      shippingAddress:['']
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
      },
        error => {
        });
  }

  getStoresByProject(event){
    debugger
    this.storesList =[];
    this.orderForm.get('storeId').setValue(null)
    this.accountService.getStoresByProjectId(event)
      .subscribe((results: any) => {
        this.storesList = results.listResult == null ? [] : results.listResult;
        console.log(this.storesList)
      },
        error => {
        });
  }


  //get Suppliers data
  private getItemsByPurchaseId(row) {
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
        comments:x.comments
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
    debugger
    this.isEdit = true;
    this.isAdding = false;
    this.isNewPurchase = false;
    this.purchaseData = purchase;
    this.getItemsByPurchaseId(purchase);
    this.getStoresByProject(purchase.projectId)
    this.resetForm();

  }

  public resetForm(stopEditing: boolean = false) {
    debugger
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
      billindAddress:this.purchaseData.billindAddress ||'',
      shippingAddress:this.purchaseData.shippingAddress ||'',
      arrivingDate: this.purchaseData.arrivingDate || '',
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
        "comments":this.itemFrom.value.credentials[i].comments
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
      "billindAddress":formModel.billindAddress,
      "shippingAddress":formModel.shippingAddress,
      "fileName": "",
      "fileLocation": "",
      "fileExtention": ".png",
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
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: "Delete", msg: "Are you sure you want to delete this order ?", isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Ok', cancel: 'Cancel' },
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


  acceptClick(order: any){
    debugger
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: "Accept", msg: "Are you sure you want to Accept this order ?", isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Accept', cancel: 'Cancel' },
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
  rejectClick(order: any){
    debugger
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: "Reject", msg: "Are you sure you want to Reject this order ?", isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Accept', cancel: 'Reject' },
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

}


