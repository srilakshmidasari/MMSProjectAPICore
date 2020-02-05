import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Role } from '../../models/role.model';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'ng2-charts';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { DataFactory } from 'src/app/shared/dataFactory';
import { DeleteFileComponent } from '../delete-file/delete-file.component';
import { MatDialog } from '@angular/material/dialog';
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
  documentList: any[] = [];
  fileRepositories: any[] = [];
  BASE64_MARKER: string = ';base64,';
  fileExtension: any;
  editUserFilesList: any[] = [];
  isEditing: boolean = false;
  isChangePassword = false;
  @Input() allowedImageExtension: string = "jpeg , jpg , png";
  @Input() allowedDocsExtension: string = "pdf , docx , doc";
  @ViewChild("fileInput", { static: false }) myInputVariable: ElementRef;
  isImageFile: boolean;
  isDocFile: boolean;
  isAllow: boolean;
  editDocumentList: any[] = [];
  currentUserFiles: any[] = [];
  @Input() maxSize: number = 2300;//1150;

  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private authService: AuthService,
    private alertService: AlertService,
    private dialog: MatDialog) {
    this.buildForm();
  }

  ngOnInit() {
    debugger;
    this.getDocuments();

    this.UserData();
    // this.getRoles();

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
      file: [''],
      isEnabled: ['']
    })
  }

  private resetForm() {
    this.buildForm();
    this.profileForm.reset({
      empId: this.currentUserData.employeeId || '',
      name1: this.currentUserData.name1 || '',
      name2: this.currentUserData.name2 || '',
      userName: this.currentUserData.userName || '',
      email: this.currentUserData.email || '',
      phoneNumber: this.currentUserData.phoneNumber || '',
      isEnabled: this.currentUserData.isEnabled || '',
      roles: this.currentUser.roles[0] || []
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
      this.getCurrentUserFiles(this.currentUser.id);
      this.profileForm.disable();
      this.resetForm();
    }, error => {
      this.alertService.stopLoadingMessage();
    })
  }

  // Current User Files
  getCurrentUserFiles(id) {
    this.editUserFilesList = [];  
    this.accountService.getUserFileData(id).subscribe((res: any) => {
      this.editUserFilesList = JSON.parse(JSON.stringify(this.editDocumentList));
      this.currentUserFiles = res;
      this.currentUserFiles.forEach((item) => {
        this.editUserFilesList.forEach((item1) => {
          if (item.documentType == item1.typeCdDmtId) {
            const index: number = this.editUserFilesList.indexOf(item1);
            if (index !== -1) {
              this.editUserFilesList.splice(index, 1);
            }
          }
        }
        );
      });
    }
      , error => {
        this.alertService.stopLoadingMessage();
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

  // Documents Type
  private getDocuments() {
    var classTypeId = 1
    this.accountService.getCddmtData(classTypeId).subscribe((response: any) => {
      this.documentList = response.listResult;
      this.editDocumentList = JSON.parse(JSON.stringify(this.documentList));
    })
  }

  // On Edit click
  onEditProfile() {
    this.isEditing = true;
    this.profileForm.enable();
  }

  //On cancel Click
  onCancelProfile() {
    this.profileForm.disable();
    this.isEditing = false;
    this.UserData();
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
            this.isImageFile = true;
          }
        }
      }
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
            this.isDocFile = true;
          }
        }
      }
    }
    if (this.isAllow) {
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
            "userId": this.currentUser.id,
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

  }

  // On Update Click
  public onUpdateProfile() {
    debugger
    if (!this.form.submitted) {
      // Causes validation to update.
      this.form.onSubmit(null);
      return;
    }
    if (!this.profileForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    this.isSaving = true;
    this.alertService.startLoadingMessage('Saving changes...');    
    const editedUser = this.getEditedUser();
    const formModel = this.profileForm.value;
    this.accountService.UpdateUser(editedUser).subscribe((res: any) => {
      this.alertService.stopLoadingMessage();
      this.isSaving = false;
      this.isEditing=false;
      this.alertService.showMessage('Success', 'Profile Updated Sucessfully', MessageSeverity.success);
      this.UserData();

    }
      , error => {
        this.alertService.stopLoadingMessage();
        this.alertService.showMessage('Error',' One or more errors occured whilst saving your change', MessageSeverity.error);
      })
  }

  // Request Object Forming
  private getEditedUser(): any {
    const formModel = this.profileForm.value;
    return {
      id: this.currentUser.id,
      jobTitle: '',
      userName: this.currentUser.userName,
      fullName: '',
      friendlyName: '',
      email: this.currentUser.email,
      emailConfirmed: '',
      phoneNumber: formModel.phoneNumber,
      roles: this.currentUser.roles,
      currentPassword: '',
      newPassword: null,
      confirmPassword: null,
      isEnabled: formModel.isEnabled,
      isLockedOut: '',
      employeeId: formModel.empId,
      name1: formModel.name1,
      name2: formModel.name2,
      fileRepositories: this.fileRepositories
    };
  }

  // On Deleting File
  onDeleteFile(file) {
    const dialogRef = this.dialog.open(DeleteFileComponent, {
      panelClass: 'mat-dialog-sm',
      data: file
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getCurrentUserFiles(file.userId);
    })

  }
}


