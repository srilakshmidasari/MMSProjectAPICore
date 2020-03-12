import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { DataFactory } from 'src/app/shared/dataFactory';
import { Utilities } from 'src/app/services/utilities';
import { AccountService } from 'src/app/services/account.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-closeorder',
  templateUrl: './closeorder.component.html',
  styleUrls: ['./closeorder.component.scss']
})
export class CloseorderComponent implements OnInit {
  closeFrom: FormGroup;
  orderData: any;
  comments :any

  constructor(private accountService: AccountService, private alertService: AlertService, private authService: AuthService,
    public dialogRef: MatDialogRef<CloseorderComponent>, @Inject(MAT_DIALOG_DATA) public data: { row }) {
    this.orderData = this.data.row;
  }

  ngOnInit() {

  }


  CloseWorkOrderClick() {
    debugger
    var req = {
      "workOrderId": this.orderData.id,
      "statusTypeId": DataFactory.StatusTypes.Closed,
      "comments": this.comments
    }

    this.accountService.CloseWorkOrder(req)
      .subscribe((results: any) => {
        this.alertService.stopLoadingMessage();
        this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success)
        this.Cancel();
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage(' Accept Error', `An error occured whilst  Accept the user.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
            MessageSeverity.error, error);
        });
  }



  Cancel() {
    this.dialogRef.close();
  }

}
