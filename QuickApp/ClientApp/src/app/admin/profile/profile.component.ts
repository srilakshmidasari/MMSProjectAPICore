import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Role } from '../../models/role.model';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'ng2-charts';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;

  currentUserData: any = {};
  rolesData: any[] = [];


  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private authService: AuthService, ) { }

  ngOnInit() {
    debugger;
    this.UserData();
    this.buildForm(); 
  this.getRoles();
        this.resetForm();
  }

  // Form Bulding
  private buildForm() {
    this.profileForm = this.fb.group({
      empId: ['', Validators.required],
      name1: ['', Validators.required],
      name2: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]],
      roles:['',Validators.required]
    })
  }

 
  // Accepting Alpha Numaric Fields
  alphaNumaricsOnly(event: any) {
    const alphabetspattern = /^[a-z0-9]+$/i;
    let inputChar = String.fromCharCode(event.charCode);
    if (!alphabetspattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  // Accepting Only Numbers
  numberOnly(event: any) {
    const numberpattern = /[0-9\+\-.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!numberpattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // current User detais

  get currentUser() {
    return this.authService.currentUser;
  }



// Current  User Details
  UserData() {
    this.accountService.gettUserDataBYId(this.currentUser.id).subscribe((res: any) => {
      this.currentUserData = res;
    })
  }

   //  Accepting Only Alphabets
   alphabetsOnly(event: any) {
    const alphabetspattern = /^[a-zA-Z ]*$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!alphabetspattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  private resetForm(){
    this.profileForm.reset({    
  empId:this.currentUserData.employeeId ,
  name1:this.currentUserData.name1 ,
  name2:this.currentUserData.name2,
  userName:this.currentUserData.userName ,
  email:this.currentUserData.email ,
  phoneNumber:this.currentUserData.phoneNumber ,
 // roles:this.currentUserData,
 //isEnabled:this.currentUserData.isEnabled,

    })
  }

  // Role Data

  getRoles(){
    this.accountService.getRolesData().subscribe((res:any)=>{
      this.rolesData=res;

    })
  }
}
