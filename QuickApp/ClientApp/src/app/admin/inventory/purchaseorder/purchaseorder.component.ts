import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { AccountService } from 'src/app/services/account.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Utilities } from 'src/app/services/utilities';

@Component({
  selector: 'app-purchaseorder',
  templateUrl: './purchaseorder.component.html',
  styleUrls: ['./purchaseorder.component.scss']
})
export class PurchaseorderComponent implements OnInit {
  loadingIndicator: boolean;
  credentials: any[] = [];
  displayedColumns = ['supplierName', 'supplierAddress', 'arrivingDate', 'updatedDate', 'isActive', 'Actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;
  purchasesList: any[] = [];
  purchaseData: any = {};

  orderForm: FormGroup;
  isAdding: boolean = false;
  isNewPurchase: boolean = false;
  supplierList: any[] = [];
  isEdit:boolean = false;
  itemFrom: FormGroup;
  itemList: any[] = [];
  i: any;
  purchaseItemList: any[]=[];
  currenrDate: Date;
  constructor(private accountService: AccountService, private alertService: AlertService,
    private authService: AuthService, private dialog: MatDialog, private formBuilder: FormBuilder, ) {
    this.itemFrom = this.formBuilder.group({
      credentials: this.formBuilder.array([]),
    });
    this.currenrDate = new Date();
  }

  ngOnInit() {
    this.getPurchaseOrders();
    this.buildForm();
   // this.addItem(this.i);
  }


  private getPurchaseOrders() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getPurchaseOrder()
      .subscribe((results: any) => {
        this.purchasesList = results.listResult == null ? [] : results.listResult;
        this.dataSource.data = this.purchasesList;
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
      expectedCost: new FormControl('', [Validators.required])
    })
  }
  
  buildForm() {
    this.orderForm = this.formBuilder.group({
      supplierId: ['', Validators.required],
      arrivingDate: ['', Validators.required]    
    })
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
 
  // get items Data
  private getItem() {
    this.accountService.getitemdata()
      .subscribe((results: any) => {
        this.itemList = results.listResult == null ? [] : results.listResult;
      },
        error => {
        });
  }

 
   //get Suppliers data
   private getItemsByPurchaseId() {
    this.accountService.getItemsByPurchaseId(this.purchaseData.id)
      .subscribe((results: any) => {
        this.purchaseItemList = results.listResult == null ? [] : results.listResult;
        this.setAddresses(this.purchaseItemList)
      },
        error => {
        });
  }
  
  setAddresses(addresses: any[]) {    
    let control = this.formBuilder.array([]);
    addresses.forEach(x => {
      control.push(this.formBuilder.group({
        itemId: x.itemId,
        quantity: x.quantity,
        expectedCost: x.expectedCost,
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
      this.buildForm();
      this.addItem(this.i);
   
  }

  onEditClick(purchase){
    this.isEdit = true;
    this.isAdding = false;
    this.isNewPurchase = false;
    this.purchaseData = purchase;
    this.getItemsByPurchaseId();
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
      arrivingDate: this.purchaseData.arrivingDate || '',
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
        (result: any) => {
          this.alertService.stopLoadingMessage();
          if (result.isSuccess) {
            this.getPurchaseOrders();
            this.isAdding = false;
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
      this.accountService.UpdatePurchaseOrder(editeditem).subscribe(
        (result: any) => {
          this.alertService.stopLoadingMessage();
          if (result.isSuccess) {
            this.isAdding = false;
            this.isEdit = false;
            this.alertService.showMessage('Success', result.endUserMessage, MessageSeverity.success)
            this.getPurchaseOrders();

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

  private AddAllItemData(): any {
    var purchaseItems = [];
    for (var i = 0; i < this.itemFrom.value.credentials.length; i++) {
      var itemReq = {
        "id": 0,
        "itemId": this.itemFrom.value.credentials[i].itemId,
        "purchaseId": 0,
        "quantity": parseInt(this.itemFrom.value.credentials[i].quantity),
        "expectdCost": parseInt(this.itemFrom.value.credentials[i].expectedCost),
      }
      purchaseItems.push(itemReq);
    }
    const formModel = this.orderForm.value;
    return {
      "id": this.isNewPurchase == true ? 0 : this.purchaseData.id,
      "supplierId": formModel.supplierId,
      "arrivingDate": formModel.arrivingDate,
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

  confirmDelete(order:any) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: "Delete",  msg: "Are you sure you want to delete this order ?" , isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Ok', cancel: 'Cancel'},
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

  


}


