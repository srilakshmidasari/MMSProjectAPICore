import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataFactory } from 'src/app/shared/dataFactory';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
@Component({
  selector: 'app-pm-order',
  templateUrl: './pm-order.component.html',
  styleUrls: ['./pm-order.component.scss']
})
export class PmOrderComponent implements OnInit {
  orderData: any = {};
  loadingIndicator: boolean;
  siteList: any[] = [];
  userProjectsList: any[] = [];
  locationsList: any[] = [];
  Project: any;
  searchText: string;
  searchLength :number;
  locationLength: number;
  assetsList: any[] = [];
  assteText: string;
  assetLength :number;
  assetListLength: number;
  selectString: any;
  selectAsset: any;
  storesList: any[] = [];
  itemList: any[] = [];
  pmOrdersList: any[]=[];
  PMOrderItemList: any[]=[];
  isEdit: boolean;
  workTypeList: any[] = [];
  workStatusList: any[] = [];
  workFaultsList: any[] = [];
  workTechList: any[] = [];
  isNewOrder: boolean = false;
  currenrDate: Date;
  orderForm: FormGroup;
  itemFrom: FormGroup;
  constructor(private accountService: AccountService, private alertService: AlertService,
    private authService: AuthService,private formBuilder: FormBuilder,) { 
      this.itemFrom = this.formBuilder.group({
        credentials: this.formBuilder.array([]),
      });
      this.currenrDate = new Date();
     
    }

  ngOnInit() {
    debugger
    this.getPMOrders();
    this.getItem();
    this.buildForm();
  }



  private getPMOrders() {
    debugger
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getPMOrder()
      .subscribe((results: any) => {
        this.pmOrdersList = results.listResult == null ? [] : results.listResult;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
       
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
        });
  }

  getItemsByworkOrderId(row, val) {
    debugger
    this.accountService.getItemsByWorkOrderId(row.id)
      .subscribe((results: any) => {
        this.PMOrderItemList = results.listResult == null ? [] : results.listResult;
        
      },
        error => {
        });
  }

  addItem(i) {
    debugger
    (this.itemFrom.controls['credentials'] as FormArray).push(this.createItem(i));
  }

  
  createItem(item) {
    return this.formBuilder.group({
      itemId: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),

    })
  }
  private getSites() {
    this.accountService.getSiteData()
      .subscribe((results: any) => {
        this.siteList = results.listResult == null ? [] : results.listResult;

      },
        error => {
        });
  }

  //Get sites data by UserId
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
     this.Project=event;
     this.getStoresByProject(event)
     this.orderForm.get('locationId').setValue(null)
  //   // this.accountService.getLocationsByProject(event).subscribe((res: any) => {
  //   //   this.locationsList = res.listResult == null ? [] : res.listResult;
  //   //   this.getStoresByProject(event)
  //   // },
  //   //   error => {
  //   //   })
   }

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

  
  onLocationSelected( obj) {
    this.selectString = obj.id;
    this.orderForm.get('assetId').setValue(null)
  }

  onAssetSelected( obj) {
    this.selectAsset = obj.id;
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
    debugger
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.WorkType).subscribe((result: any) => {
      this.workTypeList = result.listResult == null ? [] : result.listResult;
      this.getWorkStatus();
    },
      error => {
      })
  }

  getWorkStatus() {
    debugger
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.WorkStatus).subscribe((result: any) => {
      this.workStatusList = result.listResult == null ? [] : result.listResult;
      this.geworkFault();
    },
      error => {
      })
  }

  geworkFault() {
    debugger
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.WorkFaults).subscribe((result: any) => {
      this.workFaultsList = result.listResult == null ? [] : result.listResult;
      this.getWorkTech();
    },
      error => {
      })
  }

  getWorkTech() {
    debugger
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.Technician).subscribe((result: any) => {
      this.workTechList = result.listResult == null ? [] : result.listResult;
    },
      error => {
      })
  }
 

  buildForm(){
    debugger
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
  
  public resetForm(stopEditing: boolean = false) {
    if (!this.orderData) {
     // this.isNewOrder = true;
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
      startDate: this.isNewOrder ? this.currenrDate : this.orderData.startDate || '',
      endDate: this.isNewOrder ? this.currenrDate : this.orderData.endDate || '',
      workTypeId: this.orderData.workTypeId || '',
      workStatusId: this.orderData.workStatusId || '',
      workFaultId: this.orderData.workFaultId || '',
      workTechId: this.orderData.workTechnicianId || ''
    });
  }

  onEditClick(order){
    this.isEdit = true;
    this.orderData = order;

  }

  onCancelClick() {
    this.isEdit = false;
  }

 saveOrder() {
    debugger
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
            this.getPMOrders();
            //this.isAdding = false;
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
            //this.isAdding = false;
            this.isEdit = false;
            this.alertService.showMessage('Success', response.endUserMessage, MessageSeverity.success)
            this.getPMOrders();
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
    
  

  Delete(index) {
    (this.itemFrom.controls['credentials'] as FormArray).removeAt(index);
  }
  
  }


