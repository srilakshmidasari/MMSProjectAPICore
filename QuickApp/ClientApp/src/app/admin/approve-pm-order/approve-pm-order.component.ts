import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AccountService } from 'src/app/services/account.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataFactory } from 'src/app/shared/dataFactory';

@Component({
  selector: 'app-approve-pm-order',
  templateUrl: './approve-pm-order.component.html',
  styleUrls: ['./approve-pm-order.component.scss']
})
export class ApprovePmOrderComponent implements OnInit {
  pmOrderForm: FormGroup;
  pmProcedureData: any;
  pmOrderData: any[] = [];
  send_date = new Date();
  formattedDate: any;
  assetsPMList: any[] = [];
  astFixDate: any;
  orderDate: any;

  constructor(public dialogRef: MatDialogRef<ApprovePmOrderComponent>, @Inject(MAT_DIALOG_DATA) public data: { row },
    private accountService: AccountService, private alertService: AlertService, private authService: AuthService,
    private formBuilder: FormBuilder) {
    debugger
    this.pmProcedureData = this.data.row;
  }

  get currentUser() {
    return this.authService.currentUser;
  }


  ngOnInit() {
    this.getPMAssetsbyPMId();
  }

  getPMAssetsbyPMId() {
    debugger
    this.assetsPMList = [];
    this.accountService.getPMAssetsbyPMId(this.pmProcedureData.id).subscribe((res: any) => {
      this.assetsPMList = res.listResult == null ? [] : res.listResult;
      //  console.log(this.assetsPMList)
    },
      error => {
      })
  }

  onAceptClick() {
    debugger
    this.pmOrderData = [];
    this.assetsPMList.forEach((item) => {
      var d = new Date(item.assetFixedDate);
      var astday = d.getDate();
      var dt = new Date();
      var year = dt.getFullYear();
      var month = dt.getMonth();
      this.astFixDate = new Date(year, month, astday);
      if (this.pmProcedureData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.Monthly) {
        var monthsCount = parseInt(this.pmProcedureData.daysApplicable) / 30;
      } else if (this.pmProcedureData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.Quarterly) {
       var monthsCount = parseInt(this.pmProcedureData.daysApplicable) / 90;
      } else if (this.pmProcedureData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.HalfYearly) {
        var monthsCount = parseInt(this.pmProcedureData.daysApplicable) / 180;
      } else {
        var monthsCount = 1
      }
      for (var i = 0; i < monthsCount; i++) {
        if (i == 0) {
          this.orderDate = new Date(this.astFixDate)
        } else {
          this.orderDate = new Date(this.orderDate)
        }
        if (this.pmProcedureData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.Monthly) {
          var astDt = this.orderDate.setMonth(this.orderDate.getMonth() + 1);
        } else if (this.pmProcedureData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.Quarterly) {
          var astDt = this.orderDate.setMonth(this.orderDate.getMonth() + 4);
        } else if (this.pmProcedureData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.HalfYearly) {
          var astDt = this.orderDate.setMonth(this.orderDate.getMonth() + 6);
        } else {
          var astDt = this.orderDate.setMonth(this.orderDate.getMonth() + 11);
        }
       
        var req = {
          "id": 0,
          "assetId": item.assetId,
          "startDate": this.orderDate,
          "endDate": this.orderDate,
          "reference1": this.pmProcedureData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.Monthly ? this.pmProcedureData.preventiveRefId + "PM" + i : this.pmProcedureData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.Quarterly ? this.pmProcedureData.preventiveRefId + "PMQ" + i : this.pmProcedureData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.HalfYearly ? this.pmProcedureData.preventiveRefId + "PMH" + i : this.pmProcedureData.preventiveRefId + "PMY" + i,
          "extradetails": this.pmProcedureData.details,
          "issue": "",
          "resolution": "",
          "statusTypeId": DataFactory.StatusTypes.Open,
          "workTypeId": DataFactory.PMOrderTypes.WorkType,
          "workStatusId": DataFactory.PMOrderTypes.WorkStatus,
          "workTechnicianId": this.pmProcedureData.technicianId,
          "workFaultId": DataFactory.PMOrderTypes.WorkFault,
          "storeId": null,
          "pmProcedureId": this.pmProcedureData.id,
          "orderTypeId": DataFactory.OrderTypes.PMOrder,
          "isActive": true,
          "workOrderItems": [],
          "createdBy": this.currentUser.id,
          "createdDate": new Date(),
          "updatedBy": this.currentUser.id,
          "updatedDate": new Date()
        }
        this.pmOrderData.push(req);

      }
      console.log(this.pmOrderData);
      // this.alertService.startLoadingMessage('Saving changes...');
      // this.accountService.addPmOrder(this.pmOrderData).subscribe(
      //   (response: any) => {
      //     this.alertService.stopLoadingMessage();
      //     if (response.isSuccess) {
      //       this.alertService.showMessage('Success', response.endUserMessage, MessageSeverity.success)
      //       this.Cancel();
      //     } else {
      //       this.alertService.stopLoadingMessage();
      //       this.alertService.showStickyMessage(response.endUserMessage, null, MessageSeverity.error);
      //     }
      //   }, error => {
      //     this.alertService.stopLoadingMessage();
      //     this.alertService.showStickyMessage('An error Occured', null, MessageSeverity.error);
      //   }
      // );

    })


  }

  Cancel() {
    this.dialogRef.close();
  }




}
