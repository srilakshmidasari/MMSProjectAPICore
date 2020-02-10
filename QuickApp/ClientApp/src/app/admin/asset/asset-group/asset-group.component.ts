import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-asset-group',
  templateUrl: './asset-group.component.html',
  styleUrls: ['./asset-group.component.scss']
})
export class AssetGroupComponent implements OnInit {
  assetGroupForm:FormGroup;
  constructor( private fb:FormBuilder) { 
    this.buildForm();
  }

  ngOnInit() {
  }
 // form Building
 private buildForm(){
   this.assetGroupForm=this.fb.group({
    agName1:['',Validators.required],
    agName2:['',Validators.required],
    agRef1:['',Validators.required],
    agMake:['',Validators.required],
    agModel:['',Validators.required],
    agType:['',Validators.required],
    agCapacity:['',Validators.required],
    agRef2:['',Validators.required],
    isActive:['',Validators.required]
   })
 }
}
