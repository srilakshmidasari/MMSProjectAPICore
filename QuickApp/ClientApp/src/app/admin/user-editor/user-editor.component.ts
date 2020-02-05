// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Component, OnDestroy, ViewChild, Input, OnChanges, NgZone, ElementRef } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';

import { AccountService } from '../../services/account.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { Utilities } from '../../services/utilities';
import { LocalStoreManager } from '../../services/local-store-manager.service';
import { DBkeys } from '../../services/db-keys';
import { User } from '../../models/user.model';
import { UserEdit } from '../../models/user-edit.model';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { EqualValidator } from '../../shared/validators/equal.validator';
import { AuthService } from 'src/app/services/auth.service';
import { DataFactory } from 'src/app/shared/dataFactory';
import { AppDialogComponent } from 'src/app/shared/app-dialog/app-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteFileComponent } from '../delete-file/delete-file.component';

@Component({
  selector: 'user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnChanges, OnDestroy {
  @ViewChild('form', { static: true })
  private form: NgForm;
  userFileInfo: any = [];
  isNewUser = false;
  isChangePassword = false;
  emailConfirmed: boolean;
  public isSaving = false;
  pDocdata: any = [];
  public isSendingEmail = false;
  private passwordWatcher: Subscription;
  private onUserSaved = new Subject<User>();
  roleData: any[] = [];
  @Input() user: any = new User();
  @Input() roles: Role[] = [];
  userFileData: any[] = [];
  editUserDocs: any[] = [];
  isEditMode: boolean;
  isAllow: boolean;
  BASE64_MARKER: string = ';base64,';
  fileExtension: any;
  editUserFilesList: any[] = [];
  @Input() allowedImageExtension: string = "jpeg , jpg , png";
  @Input() allowedDocsExtension: string = "pdf , docx , doc";
  @ViewChild("fileInput", { static: false }) myInputVariable: ElementRef;

  isImageFile: boolean;
  isDocFile: boolean;
  @Input() maxSize: number = 2300;//1150;
  documentList: any[] = [];
  userProfileForm: FormGroup;
  userSaved$ = this.onUserSaved.asObservable();
  fileRepositories: any[] = [];

  get confirmedEmailChanged() {
    return this.emailConfirmed && this.email.value != this.user.email;
  }

  get userName() {
    return this.userProfileForm.get('userName');
  }

  get email() {
    return this.userProfileForm.get('email');
  }

  get password() {
    return this.userProfileForm.get('password');
  }

  get currentPassword() {
    return this.password.get('currentPassword');
  }

  get newPassword() {
    return this.password.get('newPassword');
  }

  get confirmPassword() {
    return this.password.get('confirmPassword');
  }

  get assignedRoles() {
    return this.userProfileForm.get('roles');
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permission.viewRolesPermission);
  }

  get canAssignRoles() {
    return this.accountService.userHasPermission(Permission.assignRolesPermission);
  }

  get isEditingSelf() {
    return this.accountService.currentUser ? this.user.id == this.accountService.currentUser.id : false;
  }

  get assignableRoles(): Role[] {
    return this.roles;
  }

  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private accountService: AccountService,
    private localStorage: LocalStoreManager,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private ngZone: NgZone,
    private dialog: MatDialog
  ) {
    this.buildForm();
  }

  ngOnChanges() {
    if (this.user) {
      this.isNewUser = false;
      this.emailConfirmed = this.user.emailConfirmed;

      const verificationEmailSent = this.localStorage.getDataObject<boolean>(this.getDBkey_VERIFICATION_EMAIL_SENT(this.user.id));

      if (this.isEditingSelf && !verificationEmailSent && !this.emailConfirmed) {
        const sendVerificationEmail_WindowsFuncName = 'userEditor_sendVerificationEmail';
        window[sendVerificationEmail_WindowsFuncName] = this.sendVerificationEmail.bind(this);

        const confirmEmailMsg = 'Your account email has not been verified. <a href="javascript:;" ' +
          `onclick="window.${sendVerificationEmail_WindowsFuncName}()">Click here to resend verification email</a>`;
        this.alertService.showStickyMessage('Email not verified!', confirmEmailMsg, MessageSeverity.info, null, () => window[sendVerificationEmail_WindowsFuncName] = null);
      }
    } else {
      this.isNewUser = true;
      this.user = new User();
      this.user.isEnabled = true;
    }
    this.getDocuments();
    this.setRoles();
    this.resetForm();
  }

  ngOnDestroy() {
    this.passwordWatcher.unsubscribe();
  }

  public setUser(user?: User, roles?: Role[]) {
    this.user = user;
    if (roles) {
      this.roles = [...roles];
    }

    this.ngOnChanges();
  }

  // Get Documents List
  private getDocuments() {
    var classTypeId = 1
    this.accountService.getCddmtData(classTypeId).subscribe((response: any) => {
      this.documentList = response.listResult;
      this.editUserDocs = JSON.parse(JSON.stringify(this.documentList))
      this.getCurrentUserFiles();
    })
  }

  // Building userProfileForm 
  private buildForm() {
    this.userProfileForm = this.formBuilder.group({
      empId: ['', Validators.required],
      name1: ['', Validators.required],
      name2: ['', Validators.required],
      jobTitle: '',
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: this.formBuilder.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/)]],
        confirmPassword: ['', [Validators.required, EqualValidator('newPassword')]],
      }),
      roles: ['', Validators.required],
      //fullName: '',
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]],
      isEnabled: ['true'],
      file: ''
    });

    this.passwordWatcher = this.newPassword.valueChanges.subscribe(() => this.confirmPassword.updateValueAndValidity());
  }

  //  Restting  userProfileForm
  public resetForm(stopEditing: boolean = false) {
    if (stopEditing) {
      this.isEditMode = false;
    }

    if (!this.user) {
      this.isNewUser = true;
      this.user = new User();
    }

    if (this.isNewUser) {
      this.isChangePassword = true;
      this.addNewPasswordValidators();
    } else {

      this.isChangePassword = false;
      this.newPassword.clearValidators();
      this.confirmPassword.clearValidators();
    }

    this.currentPassword.clearValidators();

    this.userProfileForm.reset({
      jobTitle: this.user.jobTitle || '',
      userName: this.user.userName || '',
      email: this.user.email || '',
      name1: this.user.name1 || '',
      name2: this.user.name2 || '',
      empId: this.user.employeeId || '',
      password: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      roles: this.user.roles || [],
      //fullName: this.user.fullName || '',
      phoneNumber: this.user.phoneNumber || '',
      isEnabled: this.user.isEnabled
    });
  }

  private setRoles() {
    if (this.user.roles) {
      for (const role of this.user.roles) {
        if (!this.roles.some(r => r.name == role)) {
          this.roles.unshift(new Role(role));
        }
      }
    }
  }

  //  File  Change Event
  uploadFile(doc, event) {
    debugger
    var doc1 = doc;
    var file = event.target.files[0];
    if (doc.typeCdDmtId == DataFactory.TypeOfFile.Image) {
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
    let reader = new FileReader();
    reader.onload = (e: any) => {
      if (this.isAllow) {
        this.userFileInfo.push({
          "fileLocation": e.target.result,
          "fileTypeName": doc.typeCdDmtId == 1 ? 'Image' : 'Document',
          "documentType": doc.typeCdDmtId
        })
      if (!this.isNewUser) {
        this.editUserFilesList.forEach((item1) => {
          if (item1.typeCdDmtId == doc.typeCdDmtId) this.editUserFilesList.splice(item1, 1);
        });
      }
      else if (this.isNewUser) {
        this.documentList.forEach((item1) => {
          if (item1.typeCdDmtId == doc.typeCdDmtId) this.documentList.splice(item1, 1);
        });
      }
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
  }
    reader.readAsDataURL(file);
  }


  public beginEdit() {
    this.isEditMode = true;
    this.isChangePassword = false;
  }

  // Current User Details
  get currentUser() {
    return this.authService.currentUser;
  }

  // On save Click
  public save() {
    debugger
    if (!this.form.submitted) {
      // Causes validation to update.
      this.form.onSubmit(null);
      return;
    }
    if (!this.userProfileForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    this.isSaving = true;
    this.alertService.startLoadingMessage('Saving changes...');

    const editedUser = this.getEditedUser();
    const formModel = this.userProfileForm.value;
    if (this.isNewUser) {
      this.accountService.newUser(editedUser).subscribe(
        user => this.saveCompleted(user),
        error => this.saveFailed(error));
    } else {
      this.accountService.UpdateUser(editedUser).subscribe(
        () => this.saveCompleted(editedUser),
        error => this.saveFailed(error));
    }
  }

  // Request Object For Add User
  private getEditedUser(): any {
    const formModel = this.userProfileForm.value;
    return {
      id: this.user.id,
      jobTitle: formModel.jobTitle,
      userName: formModel.userName,
      // fullName: formModel.fullName,
      fullName: '',
      friendlyName: formModel.friendlyName,
      email: formModel.email,
      emailConfirmed: this.user.emailConfirmed,
      phoneNumber: formModel.phoneNumber,
      roles: formModel.roles,
      currentPassword: formModel.password.currentPassword,
      newPassword: this.isChangePassword ? formModel.password.newPassword : null,
      confirmPassword: this.isChangePassword ? formModel.password.confirmPassword : null,
      isEnabled: formModel.isEnabled,
      isLockedOut: this.user.isLockedOut,
      employeeId: formModel.empId,
      name1: formModel.name1,
      name2: formModel.name2,
      fileRepositories: this.fileRepositories
    };
  }
  // On Cancel Click
  public cancel() {
    this.fileRepositories = [];
    this.resetForm();
    this.isEditMode = false;

    this.alertService.resetStickyMessage();
  }


  // Save Comleted
  private saveCompleted(user?: User) {
    if (user) {
      this.raiseEventIfRolesModified(this.user, user);
      this.user = user;
    }
    this.fileRepositories = [];
    this.isImageFile = false;
    this.isDocFile = false;
    this.isSaving = false;
    this.alertService.stopLoadingMessage();

    this.resetForm(true);

    this.onUserSaved.next(this.user);
  }

  //  Save Failed
  private saveFailed(error: any) {
    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Save Error', 'One or more errors occured whilst saving your changes:', MessageSeverity.error, error);
    this.alertService.showStickyMessage(error, null, MessageSeverity.error);
  }

  private raiseEventIfRolesModified(currentUser: User, editedUser: User) {
    const rolesAdded = this.isNewUser ? editedUser.roles : editedUser.roles.filter(role => currentUser.roles.indexOf(role) == -1);
    const rolesRemoved = this.isNewUser ? [] : currentUser.roles.filter(role => editedUser.roles.indexOf(role) == -1);

    const modifiedRoles = rolesAdded.concat(rolesRemoved);

    if (modifiedRoles.length) {
      setTimeout(() => this.accountService.onRolesUserCountChanged(modifiedRoles));
    }
  }

  // Email Sending
  sendVerificationEmail() {
    this.ngZone.run(() => {
      this.isSendingEmail = true;
      this.alertService.resetStickyMessage();
      this.alertService.startLoadingMessage('Sending verification email...');

      this.accountService.sendConfirmEmail()
        .subscribe(result => {
          this.isSendingEmail = false;
          this.alertService.stopLoadingMessage();
          this.alertService.showMessage('Verification Email Sent', 'Please check your email', MessageSeverity.success);
          this.localStorage.saveSyncedSessionData(true, this.getDBkey_VERIFICATION_EMAIL_SENT(this.user.id));
        },
          error => {
            this.isSendingEmail = false;
            this.alertService.stopLoadingMessage();
            this.alertService.showStickyMessage('Verification Email Not Sent', `Unable to send verification email.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
              MessageSeverity.error, error);
          });
    });
  }

  private getDBkey_VERIFICATION_EMAIL_SENT(userId: string) {
    return `verification_email_sent:${userId}`;
  }

  // On Change Password Click
  public changePassword() {
    this.isChangePassword = true;
    this.addCurrentPasswordValidators();
    this.addNewPasswordValidators();
  }

  //Validation For  Current Password
  private addCurrentPasswordValidators() {
    this.currentPassword.setValidators(Validators.required);
  }

  // Validations For New Password And Confirm Password
  private addNewPasswordValidators() {
    this.newPassword.setValidators([Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/)]);
    this.confirmPassword.setValidators([Validators.required, EqualValidator('newPassword')]);
  }

  public unlockUser() {
    this.isSaving = true;
    this.alertService.startLoadingMessage('Unblocking user...');

    this.accountService.unblockUser(this.user.id)
      .subscribe(() => {
        this.isSaving = false;
        this.user.isLockedOut = false;
        this.userProfileForm.patchValue({
          isLockedOut: this.user.isLockedOut
        });
        this.alertService.stopLoadingMessage();
        this.alertService.showMessage('Success', 'User has been successfully unlocked', MessageSeverity.success);
      },
        error => {
          this.isSaving = false;
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('Unblock Error', 'The below errors occured whilst unlocking the user:', MessageSeverity.error, error);
          this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        });
  }

  // Accepting Only Numbers
  numberOnly(event: any) {
    const numberpattern = /[0-9\+\-.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!numberpattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  //  Accepting Only Alphabets
  alphabetsOnly(event: any) {
    const alphabetspattern = /^[a-zA-Z ]*$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!alphabetspattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  alphaNumaricsOnly(event: any) {
    const alphabetspattern = /^[a-z0-9]+$/i;
    let inputChar = String.fromCharCode(event.charCode);
    if (!alphabetspattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Current User Files
  getCurrentUserFiles() {
    this.editUserFilesList = [];
    this.accountService.getUserFileData(this.user.id).subscribe(res => {
      this.editUserFilesList = JSON.parse(JSON.stringify(this.editUserDocs));
      this.userFileInfo = res;
      console.log(this.userFileInfo)
      this.userFileInfo.forEach((item) => {
        this.editUserFilesList.forEach((item1) => {
          if (item.documentType == item1.typeCdDmtId) {
            const index: number = this.editUserFilesList.indexOf(item1);
            if (index !== -1) {
              this.editUserFilesList.splice(index, 1);
            }
            console.log(this.editUserFilesList)
          }
        });
      });
    })

  }

  //  On Delete File
  onDeleteFile(file) { 
    const dialogRef = this.dialog.open(DeleteFileComponent, {
      panelClass: 'mat-dialog-sm',
      data: file
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getCurrentUserFiles();
    })

  }

  getfileRepositoryDelete(UserId, file) {
    if (this.editUserFilesList.length > 0) {
    } else {
      this.editUserFilesList = [];
    }

    this.accountService.getUserFileData(this.user.id).subscribe((response: any) => {
      this.userFileInfo = response;
      this.documentList.forEach((item, index) => {
        if (item.typeCdDmtId === file.documentType) {
          this.editUserFilesList.push(item);
        }
      });
    },
      error => {
      });
  }
}





