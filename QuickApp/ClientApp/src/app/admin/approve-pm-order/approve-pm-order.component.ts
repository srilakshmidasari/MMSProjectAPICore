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
  }

  onAceptClick() {
    debugger
    this.pmProcedureData.assetId.forEach((item) => {
      var monthsCount = parseInt(this.pmProcedureData.daysApplicable) / 30;
      for (var i = 0; i < monthsCount; i++) {
        var req = {
          "id": 0,
          "assetId": item.assetId,
          "startDate": this.pmProcedureData.startDate,
          "endDate": this.pmProcedureData.startDate,
          "reference1": this.pmProcedureData.preventiveRefId+ "PM" + i,
          "extradetails": this.pmProcedureData.details,
          "issue": "",
          "resolution": "",
          "statusTypeId": DataFactory.StatusTypes.Open,
          "workTypeId": DataFactory.PMOrderTypes.WorkType,
          "workStatusId": DataFactory.PMOrderTypes.WorkStatus,
          "workTechnicianId": this.pmProcedureData.technicianId,
          "workFaultId": DataFactory.PMOrderTypes.WorkFault,
          "storeId": null,
          "orderTypeId": DataFactory.OrderTypes.PMOrder,
          "isActive": true,
          "workOrderItems": [],
          "createdBy": this.currentUser.id,
          "createdDate": new Date(),
          "updatedBy": this.currentUser.id,
          "updatedDate": new Date()
        }
        this.pmOrderData.push(req);
        console.log(this.pmOrderData);
      }
      this.alertService.startLoadingMessage('Saving changes...');
      this.accountService.addPmOrder(this.pmOrderData).subscribe(
        (response: any) => {
          this.alertService.stopLoadingMessage();
          if (response.isSuccess) {
            this.alertService.showMessage('Success', response.endUserMessage, MessageSeverity.success)
            this.Cancel();
          } else {
            this.alertService.stopLoadingMessage();
            this.alertService.showStickyMessage(response.endUserMessage, null, MessageSeverity.error);
          }
        }, error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('An error Occured', null, MessageSeverity.error);
        }
      );

    })    


  }

  Cancel() {
    this.dialogRef.close();
  }




}
