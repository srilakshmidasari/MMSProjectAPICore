import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, Validators, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AccountService } from '../../services/account.service';
import { AuthService } from 'src/app/services/auth.service';
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
    debugger;
    if(this.isLookUp){
      this.buildForm();
    }   
    this.getlookUpData();
  }


  private buildForm() {
    debugger;
    this.LookUpForm = this.fb.group({
      name1: ['', Validators.required],
      name2: ['', Validators.required],
      remarks: ['', Validators.required],
      selectCategory: [''],
      isActive: [true],
    })
  }

  private getlookUpData() {
    var classTypeId = 2
    this.accountService.getCddmtData(classTypeId).subscribe((response: any) => {
      this.lookUplist = response.listResult;

    })
  }

  get currentUser() {
    return this.authService.currentUser;
  }
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
          if (result.issucess) {
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
          if (result.issucess) {
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

  AddLookupData(): any {
    debugger;
    console.log(this.currentUser)
    const FormModel = this.LookUpForm.value;
    return {
      "id":(this.isLookUp=true)?0:this.lookUp.id ,
      "lookUpTypeId": FormModel.selectCategory,
      "name1": FormModel.name1,
      "name2": FormModel.name2,
      "remarks": FormModel.remarks,
      "isActive": true,
      "createdBy": this.currentUser.id,
      "createdDate":new Date(),
      "updatedBy":  this.currentUser.id,
      "updatedDate": new Date(),
    }
  }
  private saveCompleted(res) {
    if (res) {
      this.lookUp = res.result;
    }
    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.resetForm(true);
    this.onLookUpSaved.next(res);
    this.alertService.showStickyMessage('Success',res.endUserMessage, null, MessageSeverity.success);
  }

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
    this.resetForm();
  }
  public resetForm(stopEditing: boolean = false) {
    debugger;
    if (!this.lookUp) {
      this.isLookUp = true;
    }
    else {
      this.buildForm();
    }
    this.LookUpForm.reset({
      name1: this.lookUp.name1 || '',
      name2: this.lookUp.name2 || '',
      remarks: this.lookUp.remarks || '',
      selectCategory: this.lookUp.selectCategory || '',
      isActive: this.lookUp.isActive
    })
  }

}
