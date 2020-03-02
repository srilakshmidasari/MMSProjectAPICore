import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-document-file',
  templateUrl: './document-file.component.html',
  styleUrls: ['./document-file.component.scss']
})
export class DocumentFileComponent implements OnInit {
  pdfFile: string;

  constructor(public dialogRef: MatDialogRef<DocumentFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.pdfFile = this.data;
  }

  // On cancel Click
  cancel() {
    this.dialogRef.close();
  }
}
