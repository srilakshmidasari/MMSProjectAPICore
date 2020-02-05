import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Role } from '../../models/role.model';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'ng2-charts';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { DataFactory } from 'src/app/shared/dataFactory';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  @ViewChild('form', { static: true })
  private form: NgForm;
  currentUserData: any = {};
  public isSaving = false;
  rolesData: any[] = [];
  documentList: any[] = [];
  fileRepositories:any[]=[];
  BASE64_MARKER: string = ';base64,';
  fileExtension: any;
  isEditing:boolean=false;
  isChangePassword = false;
  @Input() allowedImageExtension: string = "jpeg , jpg , png";
  @Input() allowedDocsExtension: string = "pdf , docx , doc";
  @ViewChild("fileInput", { static: false }) myInputVariable: ElementRef;
  isImageFile: boolean;
  isDocFile: boolean;
  isAllow: boolean;
  @Input() maxSize: number = 2300;//1150;

  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private authService: AuthService,
    private alertService:AlertService ) { }

  ngOnInit() {
    debugger;
    this.UserData();
    this.buildForm();
    this.getRoles();
    this.resetForm();
    this.getDocuments();
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
      roles: ['', Validators.required],
      file:['']
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

  private resetForm() {
    this.profileForm.reset({
      empId: this.currentUserData.employeeId,
      name1: this.currentUserData.name1,
      name2: this.currentUserData.name2,
      userName: this.currentUserData.userName,
      email: this.currentUserData.email,
      phoneNumber: this.currentUserData.phoneNumber,
      // roles:this.currentUserData,
      //isEnabled:this.currentUserData.isEnabled,

    })
  }
  // Role Data
  getRoles() {
    this.accountService.getRolesData().subscribe((res: any) => {
      this.rolesData = res;
    })
  }

// Documents Type
  private getDocuments() {
    var classTypeId = 1
    this.accountService.getCddmtData(classTypeId).subscribe((response: any) => {
      this.documentList = response.listResult;
    })
  }

// On Edit click
onEditProfile(){
this.isEditing=true;
}

//On cancel Click
onCancelProfile(){
  this.profileForm.reset();
  this.isEditing=false;
}

 //  File  Change Event
 uploadFile(doc, event) {
  debugger
  var doc1 = doc;
  var file = event.target.files[0];
  if (doc.typeCdDmtId == DataFactory.docType.Image) {
    var extensions = (this.allowedImageExtension.split(',')).map(function (x) { return x.toLocaleUpperCase().trim() });
    if (file != undefined) {
      this.fileExtension = '.' + file.name.split('.').pop();
      // Get file extension
      var ext = file.name.toUpperCase().split('.').pop() || file.name;
      // Check the extension exists
      var exists = extensions.includes(ext);
      if (!exists) {
        this.alertService.showStickyMessage("This File is not allowed. Allowed File Extensions are " + this.allowedImageExtension + " only.", null, MessageSeverity.error);
        this.myInputVariable.nativeElement.value = '';
        this.isAllow = false;
      } else {
        var fileSizeinMB = file.size / (1024 * 1000);
        var size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
        if (size > this.maxSize) {
          this.alertService.showStickyMessage("File Size exceeds the limit. Max. Allowed Size is : 1 GB", null, MessageSeverity.error);
          this.myInputVariable.nativeElement.value = '';
          this.isAllow = false;
        } else {
          this.isAllow = true;
        }
      }
    }
    this.isImageFile = true;
  } else {
    var extensions = (this.allowedDocsExtension.split(',')).map(function (x) { return x.toLocaleUpperCase().trim() });
    if (file != undefined) {
      this.fileExtension = '.' + file.name.split('.').pop();
      // Get file extension
      var ext = file.name.toUpperCase().split('.').pop() || file.name;
      // Check the extension exists
      var exists = extensions.includes(ext);
      if (!exists) {
        this.alertService.showStickyMessage("This File is not allowed. Allowed File Extensions are " + this.allowedDocsExtension + " only.", null, MessageSeverity.error);
        this.myInputVariable.nativeElement.value = '';
        this.isAllow = false;
      } else {
        var fileSizeinMB = file.size / (1024 * 1000);
        var size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
        if (size > this.maxSize) {
          this.alertService.showStickyMessage("File Size exceeds the limit. Max. Allowed Size is : 1 GB", null, MessageSeverity.error);
          this.myInputVariable.nativeElement.value = '';
          this.isAllow = false;
        } else {
          this.isAllow = true;
        }
      }
    }
    this.isDocFile = true;
  }
  let reader = new FileReader();
  reader.onload = (e: any) => {
    
     
   
   
    var base64Index = e.target.result.indexOf(this.BASE64_MARKER) + this.BASE64_MARKER.length;
    this.fileExtension = '.' + file.name.split('.').pop();
    if (this.isDocFile || this.isImageFile) {
      this.fileRepositories.forEach((item1) => {
        if (item1.fileExtention == this.fileExtension) this.fileRepositories.splice(item1, 1);
      });
    }
    this.fileRepositories.push(
      {
        "repositoryId": 0,
        "userId": null,
        "fileName": e.target.result.substring(base64Index),
        "fileLocation": null,
        "fileExtention": this.fileExtension,
        "documentTypeId": doc1.typeCdDmtId,
        "createdBy": this.currentUser.id,
        "updatedBy": this.currentUser.id,
        "updatedDate": new Date(),
        "createdDate": new Date(),
      })
  }
  reader.readAsDataURL(file);
}


// On Update Click
  // public save() {
  //   debugger
  //   if (!this.form.submitted) {
  //     // Causes validation to update.
  //     this.form.onSubmit(null);
  //     return;
  //   }
  //   if (!this.profileForm.valid) {
  //     this.alertService.showValidationError();
  //     return;
  //   }
  //   this.isSaving = true;
  //   this.alertService.startLoadingMessage('Saving changes...');

  //   const editedUser = this.getEditedUser();
  //   const formModel = this.profileForm.value;
  
  //     this.accountService.UpdateUser(editedUser).subscribe((res:any)=>{
  //       this.alertService.stopLoadingMessage();
  //       if (res.isSuccess) {
  //         this.isSaving=false;
  //         this.alertService.showMessage('Success', res.endUserMessage, MessageSeverity.success);
  //       }
  //       else {
  //         this.alertService.stopLoadingMessage();
  //         this.alertService.showMessage('Error', res.endUserMessage, MessageSeverity.error);
  //       }
  //     }
  //     , error => {
  //       this.alertService.stopLoadingMessage();
  //       this.alertService.showMessage('Error', error.error.title, MessageSeverity.error);
  //     })    
    
  // }
// private getEditedUser(): any {
//   const formModel = this.profileForm.value;
//   return {
//     id: this.currentUser.id,
//     jobTitle: formModel.jobTitle,
//     userName: this.currentUser.userName,
//     // fullName: formModel.fullName,
//     fullName: '',
//     friendlyName: formModel.friendlyName,
//     email:this.currentUser.email,
//     emailConfirmed: this.user.emailConfirmed,
//     phoneNumber: formModel.phoneNumber,
//     roles: formModel.roles,
//     currentPassword: formModel.password.currentPassword,
//     newPassword: this.isChangePassword ? formModel.password.newPassword : null,
//     confirmPassword: this.isChangePassword ? formModel.password.confirmPassword : null,
//     isEnabled: formModel.isEnabled,
//     isLockedOut: this.user.isLockedOut,
//     employeeId: formModel.empId,
//     name1: formModel.name1,
//     name2: formModel.name2,
//     fileRepositories: this.fileRepositories
//   };
// }


 //  File  Change Event
}


