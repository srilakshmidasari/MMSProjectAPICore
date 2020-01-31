import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm:FormGroup;

  constructor(private fb:FormBuilder) { }

  ngOnInit() {
  }
 private buildForm(){
   this.profileForm=this.fb.group({
    Name:['']
   })
 }
}
