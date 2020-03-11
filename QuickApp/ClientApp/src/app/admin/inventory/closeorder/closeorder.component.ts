import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-closeorder',
  templateUrl: './closeorder.component.html',
  styleUrls: ['./closeorder.component.scss']
})
export class CloseorderComponent implements OnInit {
  closeFrom: FormGroup;

  constructor(public dialogRef: MatDialogRef<CloseorderComponent>, private formBuilder: FormBuilder) { }

  ngOnInit() {
  
}

Cancel() {
    this.dialogRef.close();
  }

}
