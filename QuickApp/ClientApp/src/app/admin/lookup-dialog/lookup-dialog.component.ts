import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { LookupEditorComponent } from '../lookup-editor/lookup-editor.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-lookup-dialog',
  templateUrl: './lookup-dialog.component.html',
  styleUrls: ['./lookup-dialog.component.scss']
})
export class LookupDialogComponent implements OnInit {

  @ViewChild(LookupEditorComponent, { static: true })
  lookupeditor: LookupEditorComponent
  lookUpHeading:string;
  constructor(public dialogRef: MatDialogRef<LookupDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {
   
   }

  ngOnInit() {
    debugger
    this.lookUpHeading=(this.data.lookUp==undefined)?'Add LookUp':'Update LookUp'
  }
  cancel() {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    this.lookupeditor.LookUpSaved$.subscribe(lookup => this.dialogRef.close(lookup));
  }

}