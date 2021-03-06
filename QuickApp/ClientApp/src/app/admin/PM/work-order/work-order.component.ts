import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { DataFactory } from 'src/app/shared/dataFactory';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Utilities } from 'src/app/services/utilities';
import { CloseorderComponent } from '../../inventory/closeorder/closeorder.component';
import { Permission } from 'src/app/models/permission.model';


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
  selectString: any;
  Project: any;
  searchText: string;
  searchLength :number;
  locationLength: number;
  assteText: string;
  assetLength :number;
  assetListLength: number;
  selectAsset: any;
  language: string;
  startDate: Date;
  endDate: Date;
  

  constructor(private accountService: AccountService, private alertService: AlertService,
    private authService: AuthService, private dialog: MatDialog, private formBuilder: FormBuilder, ) {
    this.itemFrom = this.formBuilder.group({
      credentials: this.formBuilder.array([]),
    });
    this.currenrDate = new Date();
   
  }

  ngOnInit() {
    this.getworkOrderOrders();    
    this.getItem();
    this.buildForm();
  }


// Get all work orders
  private getworkOrderOrders() {
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

// get items based on work order
  getItemsByworkOrderId(row, val) {
    this.accountService.getItemsByWorkOrderId(row.id)
      .subscribe((results: any) => {
        this.workOrderItemList = results.listResult == null ? [] : results.listResult;
        this.setItems(this.workOrderItemList)
      },
        error => {
        });
  }

  //  to add multiple items to form
  addItem(i) {
    (this.itemFrom.controls['credentials'] as FormArray).push(this.createItem(i));
  }


  // Formarray item creation
  createItem(item) {
    return this.formBuilder.group({
      itemId: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),

    })
  }

  // to initialize the form
  buildForm() {
    this.orderForm = this.formBuilder.group({
      siteId: ['', Validators.required],
      projectId: ['', Validators.required],
      locationId: ['', Validators.required],
      assetId: ['', Validators.required],
      storeId: ['', Validators.required],
      reference1: ['', Validators.required],
      extraDetails: [''],
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

  // to delete item from form
  Delete(index) {
    (this.itemFrom.controls['credentials'] as FormArray).removeAt(index);
  }


  // on cancel click  
  onCancelClick() {
    this.isAdding = false;
    this.isEdit = false;
    this.itemFrom.setControl('credentials', this.formBuilder.array([]));
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

  // to get projects by based on sites and user
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

// on select location
  onSelectProjectByLocation(event) {
    this.locationsList = [];
    this.Project=event;
    this.getStoresByProject(event)
    this.orderForm.get('locationId').setValue(null)
    
  }


  // based on project to get locations by search
  onSelectProjectByLocationSearch(event) {
    this.searchText =event;
    if(this.searchText.length >2){
      this.searchLength =event.length;
      // this.locationsList = [];
      var req={
        "searchValue": this.searchText,
        "projectId": this.Project
      }
      this.accountService.getLocationsBySearch(req).subscribe((res: any) => {
        this.locationsList = res.listResult == null ? [] : res.listResult;
        this.locationLength =this.locationsList.length;
        if (res.listResult == null) {
          this.locationsList = [];
        }
        
      },
        error => {
          this.locationsList = [];
        })
    }
  }


  // based on location to get assets by search
  onSelectLocationByAssetSearch(event) {
    this.assetsList = [];
    this.assteText =event
    if(this.assteText.length>2){
      this.assetLength =event.length;
      var req={
        "searchValue": event,
        "locationId": this.selectString
      }
      this.accountService.getAssetsBySearch(req).subscribe((res: any) => {
        this.assetsList = res.listResult == null ? [] : res.listResult;
        this.assetListLength =this.assetsList.length;
        if (res.listResult == null) {
          this.assetsList = [];
        }
      },
        error => {
        })
    }
    
  }

  onSelectLocationByProject(event) {
    this.assetsList = [];
    this.accountService.getAssetsByLocationId(event).subscribe((res: any) => {
      this.assetsList = res.listResult == null ? [] : res.listResult;
    },
      error => {
      })
  }

  
  // get locationId to seleced location 
  onLocationSelected( obj) {
    this.selectString = obj.id;
    this.orderForm.get('assetId').setValue(null)
  }

  // get assetId of seleced asset 
  onAssetSelected( obj) {
    this.selectAsset = obj.id;
  }


  // Based on project to get stores
  getStoresByProject(ProjectId) {
    this.storesList = [];
    this.accountService.getStoresByProjectId(ProjectId)
      .subscribe((results: any) => {
        this.storesList = results.listResult == null ? [] : results.listResult;
      },
        error => {
        });
  }



  //To get items Data
  private getItem() {
    this.accountService.getitemdata()
      .subscribe((results: any) => {
        this.itemList = results.listResult == null ? [] : results.listResult;
        this.getWorkType();
      },
        error => {
        });
  }

// To  get work types
  getWorkType() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.WorkType).subscribe((result: any) => {
      this.workTypeList = result.listResult == null ? [] : result.listResult;
      this.getWorkStatus();
    },
      error => {
      })
  }

  // To get work status
  getWorkStatus() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.WorkStatus).subscribe((result: any) => {
      this.workStatusList = result.listResult == null ? [] : result.listResult;
      this.geworkFault();
    },
      error => {
      })
  }

  // To get work faults
  geworkFault() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.WorkFaults).subscribe((result: any) => {
      this.workFaultsList = result.listResult == null ? [] : result.listResult;
      this.getWorkTech();
    },
      error => {
      })
  }

  // To get work technicians
  getWorkTech() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.Technician).subscribe((result: any) => {
      this.workTechList = result.listResult == null ? [] : result.listResult;
    },
      error => {
      })
  }


  // on add  work order click 
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
  //on edit work order clickS
  onEditClick(order) {
    debugger
    this.isEdit = true;
    this.isAdding = false;
    this.isNewOrder = false;
    this.orderData = order;
    this.getItemsByworkOrderId(order, true);
    this.getSitesByUserId();
    this.getProjectsByUserIdandSiteId(order.siteId)
    this.startDate =new Date(this.orderData.startDate);
    this.endDate= new Date(this.orderData.endDate);
    this.onSelectProjectByLocation(order.projectId)
    this.onSelectLocationByProject(order.locationId)
    this.getStoresByProject(order.projectId);
    this.resetForm();
  }

  // on view work order details
  onViewClick(row) {
    this.workorder = row;
    this.isView = true;
  }

  // on close view order
  closeViewWorkOrder() {
    this.isView = false;

  }

  // Accepting Only Numbers
  numberOnly(event: any) {
    const numberpattern = /[0-9\+\-.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!numberpattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // on edit click items setting
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



  // to set form values
  public resetForm(stopEditing: boolean = false) {
    if (!this.orderData) {
      this.isNewOrder = true;
    } else {
      this.buildForm();
    }
    this.orderForm.reset({
      siteId: this.orderData.siteId || '',
      projectId: this.orderData.projectId || '',
      locationId: this.orderData.locationName|| '',
      assetId: this.orderData.assetName || '',
      storeId: this.orderData.storeId || '',
      reference1: this.orderData.reference1 || '',
      extraDetails: this.orderData.extraDetails || '',
      issue: this.orderData.issue || '',
      resolution: this.orderData.resolution || '',
      startDate: this.isNewOrder ? this.currenrDate :  this.startDate || '',
      endDate: this.isNewOrder ? this.currenrDate : this.endDate || '',
      workTypeId: this.orderData.workTypeId || '',
      workStatusId: this.orderData.workStatusId || '',
      workFaultId: this.orderData.workFaultId || '',
      workTechId: this.orderData.workTechnicianId || ''
    });
  }


// to save work order click
  saveOrder() {
    if (!this.orderForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    this.alertService.startLoadingMessage('Saving changes...');
    const editeditem = this.AddAllItemData();
    console.log(editeditem)
    if (this.isNewOrder) {
      this.accountService.AddWorkOrder(editeditem).subscribe(
        (response: any) => {
          this.alertService.stopLoadingMessage();
          if (response.isSuccess) {
            this.getworkOrderOrders();
            this.isAdding = false;
            this.alertService.showMessage('Success', response.endUserMessage, MessageSeverity.success)
            this.resetForm();
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


// setting request object to save click
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
      "assetId": this.selectAsset ==undefined ?this.orderData.assetId :this.selectAsset ,
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
      "pmProcedureId": null,
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

  // on delete work order click
  confirmDelete(order: any) {
    this.language = localStorage.getItem('language');
    if(this.language == 'en'){
     var msg="Are you sure you want to delete this order ?"
    }else{
      var msg="هل أنت متأكد أنك تريد حذف هذا الطلب؟"
     }
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: "Delete", msg: msg, isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Ok', cancel: 'Cancel' },
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


  // on accept work order click
  acceptClick(order: any) {
    this.language = localStorage.getItem('language');
    if(this.language == 'en'){
     var msg="Are you sure you want to Accept this order ?"
     var title = "Accept Work Order"
    }else{
      var msg="هل أنت متأكد أنك تريد قبول هذا الطلب؟";
      var title = "قبول أمر العمل"
     }
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: title, msg: msg, isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Ok', cancel: 'Cancel' },
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


  // on reject work order click
  rejectClick(order: any) {
    this.language = localStorage.getItem('language');
    if(this.language == 'en'){
     var msg="Are you sure you want to Reject this order ?"
     var title = "Reject Work Order"
    }else{
      var msg="هل أنت متأكد أنك تريد رفض هذا الطلب؟"
      var title = "رفض أمر العمل"
     }
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: title, msg: msg, isCheckbox: false, isChecked: false, chkMsg: null, ok: 'OK', cancel: 'Cancel' },
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

  // On close work order click
  CloseWorkOrderClick(row) {
    const dialogRef = this.dialog.open(CloseorderComponent,
      {
        panelClass: 'mat-dialog-sm',
        data: { row }
      });
    dialogRef.afterClosed().subscribe(siteresponse => {
      this.getworkOrderOrders();
    });
  }

      // permissions
      get canAddOrders() {
        return this.accountService.userHasPermission(Permission.addOrderPermission);
      }
    
      get canEditOrders() {
        return this.accountService.userHasPermission(Permission.editOrderPermission);
      }
    
      get canDeleteOrders() {
        return this.accountService.userHasPermission(Permission.deleteOrderPermission);
      }

     


}
