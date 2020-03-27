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
    this.getPMOrders();
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
    this.accountService.getItemsByWorkOrderId(row.id)
      .subscribe((results: any) => {
        this.PMOrderItemList = results.listResult == null ? [] : results.listResult;
        
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
 

  buildForm(){
    this.orderForm = this.formBuilder.group({
      issue: ['', Validators.required],
      resolution: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      workTypeId: ['', Validators.required],
      workStatusId: ['', Validators.required],
      workFaultId: ['', Validators.required],
      workTechId: ['', Validators.required],
      reference1:['',Validators.required]

    })

  }
  
  public resetForm(stopEditing: boolean = false) {
    if (!this.orderData) {
     // this.isNewOrder = true;
    } else {
      this.buildForm();
    }
    this.orderForm.reset({
      issue: this.orderData.issue || '',
      resolution: this.orderData.resolution || '',
      startDate: this.isNewOrder ? this.currenrDate : this.orderData.startDate || '',
      endDate: this.isNewOrder ? this.currenrDate : this.orderData.endDate || '',
      workTypeId: this.orderData.workTypeId || '',
      workStatusId: this.orderData.workStatusId || '',
      workFaultId: this.orderData.workFaultId || '',
      workTechId: this.orderData.workTechnicianId || '',
      reference1:this.orderData.reference1 ||''
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
       "startDate": formModel.startDate,
        "endDate": formModel.endDate,
        "reference1": formModel.reference1,
        "issue": formModel.issue,
        "resolution": formModel.resolution,
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
  Delete(index) {
    (this.itemFrom.controls['credentials'] as FormArray).removeAt(index);
  }
  
  }


