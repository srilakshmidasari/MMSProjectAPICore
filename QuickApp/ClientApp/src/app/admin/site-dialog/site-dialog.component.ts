import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SiteEditorComponent } from '../site-editor/site-editor.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-site-dialog',
  templateUrl: './site-dialog.component.html',
  styleUrls: ['./site-dialog.component.scss']
})
export class SiteDialogComponent implements OnInit {
  isSite: string = '';
 
  @ViewChild(SiteEditorComponent, { static: true })
  siteEditor: SiteEditorComponent;
  constructor(
    public dialogRef: MatDialogRef<SiteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { site }
  ) { }

  ngOnInit() {
    this.isSite = this.data.site == null ? 'New Site' : 'Edit Site';
    //this.buldForm();
  }
  cancel(){
    this.dialogRef.close();
  }
  ngAfterViewInit() {
    this.siteEditor.siteSaved$.subscribe(role => this.dialogRef.close(role));
}
}

