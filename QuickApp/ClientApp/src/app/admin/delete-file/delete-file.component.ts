import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountService } from '../../services/account.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
@Component({
  selector: 'app-delete-file',
  templateUrl: './delete-file.component.html',
  styleUrls: ['./delete-file.component.scss']
})
export class DeleteFileComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private accountService: AccountService,
    private alertService: AlertService) { }

  ngOnInit() {
  }

  // On Cancel Click
  cancel() {
    this.dialogRef.close();
  }

  onDeleteClick(){
    if(this.data.userId){
      this.onDeleteFile();
    }else if(this.data.projectId){
      this.onDeleteProjectFile();
    }else{
      this.onDeleteAssetFile();
    }
  }
  // On  Delete Click
  onDeleteFile() {
    this.accountService.deleteUserFile(this.data.repositoryId)
      .subscribe((results: any) => {
        if (results.isSuccess)
          this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success);
        this.dialogRef.close();
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('Delete Error', `An error occured whilst deleting the file.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
            MessageSeverity.error, error);
        });
  }

  onDeleteProjectFile() {
    this.accountService.deleteProjectFile(this.data.repositoryId)
      .subscribe((results: any) => {
        if (results.isSuccess)
          this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success);
        this.dialogRef.close();
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('Delete Error', `An error occured whilst deleting the file.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
            MessageSeverity.error, error);
        });
  }

  onDeleteAssetFile() {
    this.accountService.deleteAssetRepository(this.data.repositoryId)
      .subscribe((results: any) => {
        if (results.isSuccess)
          this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success);
        this.dialogRef.close();
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('Delete Error', `An error occured whilst deleting the file.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
            MessageSeverity.error, error);
        });
  }
}
