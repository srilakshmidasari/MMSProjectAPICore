import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { DataFactory } from 'src/app/shared/dataFactory';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Utilities } from 'src/app/services/utilities';
import { CloseorderComponent } from '../closeorder/closeorder.component';

@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.scss']
})
export class WorkOrderComponent implements OnInit {
  projectsList: any[] = [];
  orderData: any = {};
  workorder: any = {};
  loadingIndicator: boolean;
  credentials: any[] = [];
  workOrdersList: any[] = [];
  workOrderItemList: any[] = [];
  itemFrom: FormGroup;
  itemList: any[] = [];
  i: any;
  purchaseItemList: any[] = [];
  currenrDate: Date;
  storesList: any[] = [];
  siteList: any[] = [];
  locationsList: any[] = [];
  assetsList: any[] = [];
  workTypeList: any[] = [];
  workStatusList: any[] = [];
  workFaultsList: any[] = [];
  workTechList: any[] = [];
  orderForm: FormGroup;
  isAdding: boolean = false;
  isNewOrder: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  ProjectId: any;

  userProjectsList: any[] = [];
  itemId: string;
  showHide: boolean;

  constructor(private accountService: AccountService, private alertService: AlertService,
    private authService: AuthService, private dialog: MatDialog, private formBuilder: FormBuilder, ) {
    this.itemFrom = this.formBuilder.group({
      credentials: this.formBuilder.array([]),
    });
    this.currenrDate = new Date();
   
  }

  ngOnInit() {
    debugger
    this.getworkOrderOrders();
    //  this.getSites();
    this.getItem();
    this.buildForm();
  }



  private getworkOrderOrders() {
    debugger
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getWorkOrder()
      .subscribe((results: any) => {
        this.workOrdersList = results.listResult == null ? [] : results.listResult;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.getSitesByUserId();
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
        });
  }


  getItemsByworkOrderId(row, val) {
    this.accountService.getItemsByWorkOrderId(row.id)
      .subscribe((results: any) => {
        this.workOrderItemList = results.listResult == null ? [] : results.listResult;
        this.setItems(this.workOrderItemList)
      },
        error => {
        });
  }

  addItem(i) {
    debugger
    (this.itemFrom.controls['credentials'] as FormArray).push(this.createItem(i));
  }
  handleSelectedValue(){
    if(this.credentials==this.credentials){
     this.showHide = true;

    }
  }

  createItem(item) {
    return this.formBuilder.group({
      itemId: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),

    })
  }

  buildForm() {
    this.orderForm = this.formBuilder.group({
      siteId: ['', Validators.required],
      projectId: ['', Validators.required],
      locationId: ['', Validators.required],
      assetId: ['', Validators.required],
      storeId: ['', Validators.required],
      reference1: ['', Validators.required],
      extraDetails: ['', Validators.required],
      issue: ['', Validators.required],
      resolution: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      workTypeId: ['', Validators.required],
      workStatusId: ['', Validators.required],
      workFaultId: ['', Validators.required],
      workTechId: ['', Validators.required],

    })
  }

  Delete(index) {
    (this.itemFrom.controls['credentials'] as FormArray).removeAt(index);
  }


  onCancelClick() {
    this.isAdding = false;
    this.isEdit = false;
    this.itemFrom.setControl('credentials', this.formBuilder.array([]));
  }

  private getSites() {
    this.accountService.getSiteData()
      .subscribe((results: any) => {
        this.siteList = results.listResult == null ? [] : results.listResult;

      },
        error => {
        });
  }

  // Get sites data by UserId
  getSitesByUserId() {
    this.accountService.getSitesByUserId(this.currentUser.id)
      .subscribe((results: any) => {
        this.siteList = results.listResult == null ? [] : results.listResult;
      },
        error => {
        });
  }

  getProjectsByUserIdandSiteId(event) {
    this.userProjectsList = [];
    var req = {
      "siteId": event,
      "userId": this.currentUser.id
    }
    this.accountService.getProjectsByUserIdandSiteId(req)
      .subscribe((results: any) => {
        this.userProjectsList = results.listResult == null ? [] : results.listResult;
      },
        error => {
        });
  }


  onSelectProjectByLocation(event) {
    this.locationsList = [];
    this.accountService.getLocationsByProject(event).subscribe((res: any) => {
      this.locationsList = res.listResult == null ? [] : res.listResult;
      this.getStoresByProject(event)
    },
      error => {
      })
  }

  onSelectLocationByProject(event) {
    this.assetsList = [];
    this.accountService.getAssetsByLocationId(event).subscribe((res: any) => {
      this.assetsList = res.listResult == null ? [] : res.listResult;
    },
      error => {
      })
  }


  getStoresByProject(ProjectId) {
    this.storesList = [];
    //this.orderForm.get('storeId').setValue(null)
    this.accountService.getStoresByProjectId(ProjectId)
      .subscribe((results: any) => {
        this.storesList = results.listResult == null ? [] : results.listResult;
      },
        error => {
        });
  }



  // get items Data
  private getItem() {
    this.accountService.getitemdata()
      .subscribe((results: any) => {
        this.itemList = results.listResult == null ? [] : results.listResult;
        this.getWorkType();
      },
        error => {
        });
  }


  getWorkType() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.WorkType).subscribe((result: any) => {
      this.workTypeList = result.listResult == null ? [] : result.listResult;
      this.getWorkStatus();
    },
      error => {
      })
  }

  getWorkStatus() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.WorkStatus).subscribe((result: any) => {
      this.workStatusList = result.listResult == null ? [] : result.listResult;
      this.geworkFault();
    },
      error => {
      })
  }

  geworkFault() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.WorkFaults).subscribe((result: any) => {
      this.workFaultsList = result.listResult == null ? [] : result.listResult;
      this.getWorkTech();
    },
      error => {
      })
  }

  getWorkTech() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.Technician).subscribe((result: any) => {
      this.workTechList = result.listResult == null ? [] : result.listResult;
    },
      error => {
      })
  }

  addClick(purchase?: any) {
    this.orderData = {};
    this.isAdding = true;
    this.isNewOrder = true;
    const arr = <FormArray>this.itemFrom.controls.credentials;
    arr.controls = [];
    this.buildForm();
    this.addItem(this.i);
    this.resetForm();

  }

  onEditClick(order) {
    this.isEdit = true;
    this.isAdding = false;
    this.isNewOrder = false;
    this.orderData = order;
    this.getItemsByworkOrderId(order, true);
    this.getSitesByUserId();
    this.getProjectsByUserIdandSiteId(order.siteId)
    this.onSelectProjectByLocation(order.projectId)
    this.onSelectLocationByProject(order.locationId)
    this.getStoresByProject(order.projectId);
    this.resetForm();
  }

  onViewClick(row) {
    this.workorder = row;
    this.isView = true;
  }

  closeViewWorkOrder() {
    this.isView = false;

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
        this.accountService.deleteWorkOrder(order.id)
          .subscribe((results: any) => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success)
            if (results.isSuccess) {
              this.getworkOrderOrders();
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




  // Accepting Only Numbers
  numberOnly(event: any) {
    const numberpattern = /[0-9\+\-.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!numberpattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  public resetForm(stopEditing: boolean = false) {
    if (!this.orderData) {
      this.isNewOrder = true;
    } else {
      this.buildForm();
    }
    this.orderForm.reset({
      siteId: this.orderData.siteId || '',
      projectId: this.orderData.projectId || '',
      locationId: this.orderData.locationId || '',
      assetId: this.orderData.assetId || '',
      storeId: this.orderData.storeId || '',
      reference1: this.orderData.reference1 || '',
      extraDetails: this.orderData.extraDetails || '',
      issue: this.orderData.issue || '',
      resolution: this.orderData.resolution || '',
      startDate: this.isNewOrder ? this.currenrDate : this.orderData.startDate || '',
      endDate: this.isNewOrder ? this.currenrDate : this.orderData.endDate || '',
      workTypeId: this.orderData.workTypeId || '',
      workStatusId: this.orderData.workStatusId || '',
      workFaultId: this.orderData.workFaultId || '',
      workTechId: this.orderData.workTechnicianId || ''
    });
  }

  saveOrder() {
    if (!this.orderForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    this.alertService.startLoadingMessage('Saving changes...');
    const editeditem = this.AddAllItemData();
    if (this.isNewOrder) {
      this.accountService.AddWorkOrder(editeditem).subscribe(
        (response: any) => {
          this.alertService.stopLoadingMessage();
          if (response.isSuccess) {
            this.getworkOrderOrders();
            this.isAdding = false;
            this.alertService.showMessage('Success', response.endUserMessage, MessageSeverity.success)
            this.resetForm();
            // this.onViewPDF(response.result);
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
      this.accountService.UpdateWorkOrder(editeditem).subscribe(
        (response: any) => {
          this.alertService.stopLoadingMessage();
          if (response.isSuccess) {
            this.isAdding = false;
            this.isEdit = false;
            this.alertService.showMessage('Success', response.endUserMessage, MessageSeverity.success)
            this.getworkOrderOrders();
            //  this.onViewPDF(response.result);
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
    var workOrderItems = [];
    for (var i = 0; i < this.itemFrom.value.credentials.length; i++) {
      var itemReq = {
        "id": 0,
        "itemId": this.itemFrom.value.credentials[i].itemId,
        "workOrderId": 0,
        "quantity": parseInt(this.itemFrom.value.credentials[i].quantity),
      }
      workOrderItems.push(itemReq);
    }
    const formModel = this.orderForm.value;
    if (this.isNewOrder) {
      formModel.startDate.setDate(formModel.startDate.getDate() + 1);
      formModel.endDate.setDate(formModel.endDate.getDate() + 1);
    } else {

    }

    return {
      "id": this.isNewOrder == true ? 0 : this.orderData.id,
      "assetId": formModel.assetId,
      "startDate": formModel.startDate,
      "endDate": formModel.endDate,
      "reference1": formModel.reference1,
      "extradetails": formModel.extraDetails,
      "issue": formModel.issue,
      "resolution": formModel.resolution,
      "statusTypeId": DataFactory.StatusTypes.Open,
      "workTypeId": formModel.workTypeId,
      "workStatusId": formModel.workStatusId,
      "workTechnicianId": formModel.workTechId,
      "workFaultId": formModel.workFaultId,
      "storeId": formModel.storeId,
      "orderTypeId": DataFactory.OrderTypes.NormalWorkOrder,
      "isActive": true,
      "workOrderItems": workOrderItems,
      "createdBy": this.currentUser.id,
      "createdDate": new Date(),
      "updatedBy": this.currentUser.id,
      "updatedDate": new Date()
    }
  }

  get currentUser() {
    return this.authService.currentUser;
  }


  setItems(itemsArray: any[]) {
    let control = this.formBuilder.array([]);
    itemsArray.forEach(x => {
      control.push(this.formBuilder.group({
        itemId: x.itemId,
        quantity: x.quantity,
      }))
    })
    this.itemFrom.setControl('credentials', control);
  }

  //ExportToExcel
  download = function () {
    this.alertService.startLoadingMessage();
    this.accountService.ExportWorkOrders(this.workOrdersList).subscribe((result) => {
      this.alertService.stopLoadingMessage();
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Work Order.xlsx";
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

  acceptClick(order: any) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: "Accept Work Order", msg: "Are you sure you want to Accept this order ?", isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Accept', cancel: 'Cancel' },
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        var req = {
          "workOrderId": order.id,
          "statusTypeId": DataFactory.StatusTypes.Approved
        }

        this.accountService.AcceptWorkOrder(req)
          .subscribe((results: any) => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success)
            if (results.isSuccess) {
              this.getworkOrderOrders();
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
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: "Reject Work Order", msg: "Are you sure you want to Reject this order ?", isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Reject', cancel: 'Cancel' },
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        var req = {
          "workOrderId": order.id,
          "statusTypeId": DataFactory.StatusTypes.Rejected
        }
        this.accountService.RejectWorkOrder(req)
          .subscribe((results: any) => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success)
            if (results.isSuccess) {
              this.getworkOrderOrders();
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


  CloseWorkOrderClick(row) {
    const dialogRef = this.dialog.open(CloseorderComponent,
      {
        panelClass: 'mat-dialog-sm',
        data: { row }
      });
    dialogRef.afterClosed().subscribe(siteresponse => {

    });
  }

}
