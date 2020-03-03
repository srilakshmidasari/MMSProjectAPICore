import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { DataFactory } from 'src/app/shared/dataFactory';

@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.scss']
})
export class WorkOrderComponent implements OnInit {
  projectsList: any[] = [];
  orderData: any = {};
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
  assetsList :any[]=[];
  workTypeList: any[]=[];
  workStatusList: any[]=[];
  workFaultsList: any[]=[];
  workTechList: any[]=[];
  orderForm: FormGroup;
  isAdding: boolean = false;
  isNewOrder: boolean = false;
  isEdit: boolean = false;
  constructor(private accountService: AccountService, private alertService: AlertService,
    private authService: AuthService, private dialog: MatDialog, private formBuilder: FormBuilder, ) { }

  ngOnInit() {
    this.getworkOrderOrders();
    this.getSites();
    this.getItem();
  }



  private getworkOrderOrders() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getWorkOrder()
      .subscribe((results: any) => {
        this.workOrdersList = results.listResult == null ? [] : results.listResult;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        console.log(this.workOrdersList)
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
        });
  }


  private getItemsByworkOrderId(row) {
    this.accountService.getItemsByWorkOrderId(row.id)
      .subscribe((results: any) => {
        this.workOrderItemList = results.listResult == null ? [] : results.listResult;
      },
        error => {
        });
  }

  addItem(i) {
    (this.itemFrom.controls['credentials'] as FormArray).push(this.createItem(i));
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
      projectId :['', Validators.required],
      locationId: ['', Validators.required],
      assetId: ['', Validators.required],
      storeId :['', Validators.required],
      reference1: ['', Validators.required],
      reference2: ['', Validators.required],
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

  onSelectSiteByProject(event) {
    this.projectsList = [];
    this.accountService.getProjectsBySite(event).subscribe((res: any) => {
      this.projectsList = res.listResult == null ? [] : res.listResult;
    },
      error => {
      })
  }

  onSelectProjectByLocation(event) {
    this.locationsList = [];
    this.accountService.getLocationsByProject(event).subscribe((res: any) => {
      this.locationsList = res.listResult == null ? [] : res.listResult;
    },
      error => {
      })
  }

  onSelectLocationByProject(event) {
    this.locationsList = [];
    this.accountService.getAssetsByLocationId(event).subscribe((res: any) => {
      this.assetsList = res.listResult == null ? [] : res.listResult;
    },
      error => {
      })
  }
  

  getStoresByProject(event) {
    debugger
    this.storesList = [];
    //this.orderForm.get('storeId').setValue(null)
    this.accountService.getStoresByProjectId(event)
      .subscribe((results: any) => {
        this.storesList = results.listResult == null ? [] : results.listResult;
        console.log(this.storesList)
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
      this.getWorkStatus() ;
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
  
    }
  
    onEditClick(order) {
      debugger
      this.isEdit = true;
      this.isAdding = false;
      this.isNewOrder = false;
      this.orderData = order;
      this.getItemsByworkOrderId(order);
      this.getStoresByProject(order.projectId)
      this.resetForm();
  
    }

    public resetForm(stopEditing: boolean = false) {
      debugger
      if (!this.orderData) {
        this.isNewOrder = true;
      } else {
        this.buildForm();
      }
  
      // this.orderForm.reset({
      //   supplierId: this.orderData.supplierId || '',
      //   projectId: this.orderData.projectId || '',
      //   storeId: this.orderData.storeId || '',
      //   remarks: this.orderData.remarks || '',
      //   billindAddress:this.orderData.billindAddress ||'',
      //   shippingAddress:this.orderData.shippingAddress ||'',
      //   arrivingDate: this.orderData.arrivingDate || '',
      //   purchaseReference: this.orderData.purchaseReference || ''
      // });
    }
}
