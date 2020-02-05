import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-lookup-editor',
  templateUrl: './lookup-editor.component.html',
  styleUrls: ['./lookup-editor.component.scss']
})
export class LookupEditorComponent implements OnInit {
  lookupform: any;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }
  private buildForm() {
    this.lookupform=this.fb.group({
      Category:['',Validators.required]
    })
  }
}
