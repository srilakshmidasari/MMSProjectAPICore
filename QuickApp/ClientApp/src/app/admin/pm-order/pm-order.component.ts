import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';
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
  constructor(private accountService: AccountService, private alertService: AlertService,
    private authService: AuthService,private formBuilder: FormBuilder,) { }

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

  saveOrder(){

  }
}
