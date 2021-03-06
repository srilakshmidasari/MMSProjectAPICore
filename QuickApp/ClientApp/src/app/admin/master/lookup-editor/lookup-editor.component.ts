import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, Validators, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataFactory } from 'src/app/shared/dataFactory';
import { AccountService } from 'src/app/services/account.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
@Component({
  selector: 'app-lookup-editor',
  templateUrl: './lookup-editor.component.html',
  styleUrls: ['./lookup-editor.component.scss']
})
export class LookupEditorComponent implements OnInit {
  LookUpForm: any;
  @ViewChild('form', { static: true })
  private form: NgForm; 
  private onLookUpSaved = new Subject<any>();
  LookUpSaved$ = this.onLookUpSaved.asObservable();
  lookUplist: any[] = [];
  isLookUp: boolean;
  @Input() lookUp: any = {};
  public isSaving = false;

  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService,
    private authService: AuthService, ) {
     
     }

  ngOnInit() {  
       this.getlookUpData();
  }

  //Form creation
  private buildForm() {
    this.LookUpForm = this.fb.group({
      name1: ['', Validators.compose([Validators.required,Validators.minLength(3)])],
      name2: ['', Validators.compose([Validators.required,Validators.minLength(3)])],
      remarks: [''],
      selectCategory:['', Validators.required],
      isActive: [true],
    })
  }

  //get LookUp Details
  private getlookUpData() {
    this.accountService.getCddmtData(DataFactory.ClassTypes.LookUp).subscribe((response: any) => {
      this.lookUplist = response.listResult;
    })
  }

  //get CurrentUser
  get currentUser() {
    return this.authService.currentUser;
  }


  //Save Click Add and Update LookUp Details
  save() {
    debugger;
    if (!this.form.submitted) {
      this.form.onSubmit(null);
      return;
    }
    if (!this.LookUpForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    this.alertService.startLoadingMessage('Saving changes...');
    const AddLookUpData = this.AddLookupData();
    if (this.isLookUp) {
      this.accountService.AddLookUp(AddLookUpData).subscribe(
        (result: any) => {
          if (result.isSuccess) {
            this.saveCompleted(result);
          }
          else {
            this.saveFailed(result);
          }
        }, error => {
          this.isSaving = false;
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage(error.error.title, null, MessageSeverity.error);
        });
    } else {
      this.accountService.updateLookUp(AddLookUpData).subscribe(
        (result: any) => {
          if (result.isSuccess) {
            this.saveCompleted(result);
          }
          else {
            this.saveFailed(result);
          }
        }, error => {
          this.isSaving = false;
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage("An error as occured", null, MessageSeverity.error);
        });

    }

  }

//request Object
  AddLookupData(): any {   
    const FormModel = this.LookUpForm.value;
    return {
      "id":(this.isLookUp==true)?0:this.lookUp.id ,
      "lookUpTypeId": FormModel.selectCategory,
      "name1": FormModel.name1,
      "name2": FormModel.name2,
      "remarks": FormModel.remarks,
      "isActive":(FormModel.isActive=='')?false:FormModel.isActive ,
      "createdBy":(this.lookUp.createdBy==undefined)?this.currentUser.id:this.lookUp.createdBy,
      "createdDate":(this.lookUp.createdDate==undefined)?new Date():this.lookUp.createdDate,
      "updatedBy":  this.currentUser.id,
      "updatedDate": new Date(),
    }
  }

//SaveCompleted
  private saveCompleted(res) {    
    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.resetForm(true);   
    this.onLookUpSaved.next(res);
  }

//SaveFailed
  private saveFailed(error: any) {
    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage(error.endUserMessage, null, MessageSeverity.error);
  }

  ngOnChanges() {
    debugger;
    if (this.lookUp) {
      this.isLookUp = false;
    } else {
      this.isLookUp = true;
      this.lookUp = {};
      this.lookUp.isActive = true;
    }
    this.buildForm();
    this.resetForm();
  }

  public resetForm(stopEditing: boolean = false) { 
     this.LookUpForm.reset({
      name1: this.lookUp.name1 || '',
      name2: this.lookUp.name2 || '',
      remarks: this.lookUp.remarks || '',
      selectCategory: this.lookUp.lookUpTypeId || '',
      isActive: this.lookUp.isActive
    })
  }

}
