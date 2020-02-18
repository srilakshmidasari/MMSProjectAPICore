import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
 export class ConfirmationDialogComponent implements OnInit {
    
 
  msg: any; 
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private dialogRef: MatDialogRef<ConfirmationDialogComponent>) {
 
   }

  ngOnInit() {
    this.data.msg=this.data.msg.replace(new RegExp('\n', 'g'), "<br />");
    this.data = this.data;
  }

  onCloseConfirm() {
     this.dialogRef.close(true);
  }

  onCancelClick() {
    this.dialogRef.close();
  }
  

}
