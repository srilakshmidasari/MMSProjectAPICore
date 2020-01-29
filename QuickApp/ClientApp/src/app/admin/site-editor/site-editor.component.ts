import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AccountService } from '../../services/account.service';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-site-editor',
  templateUrl: './site-editor.component.html',
  styleUrls: ['./site-editor.component.scss']
})
export class SiteEditorComponent implements OnInit {
  siteForm: FormGroup;
  @ViewChild('form', { static: true })
  private form: NgForm;
  @Input() site: any = {};
  public isSaving = false;
  isNewSite: boolean;
  fileExtension: string;
  BASE64_MARKER: string = ';base64,';
  base64string: string;
  private onSiteSaved = new Subject<any>();
  siteSaved$ = this.onSiteSaved.asObservable();
  constructor(private fb: FormBuilder,
    private authService: AuthService, private alertService: AlertService,
    private accountService: AccountService) { }

  ngOnInit() {
    //this.buildForm();
  }
  private buildForm() {
    this.siteForm = this.fb.group({
      siteref: ['', Validators.required],
      sname1: ['', Validators.required],
      sname2: ['', Validators.required],
      address: ['', Validators.required],
      file: ['']
    })
  }
  ngOnChanges() {
    if (this.site) {
      this.isNewSite = false;
    } else {
      this.isNewSite = true;
      this.site = {};

    }
    this.resetForm();
  }
  public resetForm(stopEditing: boolean = false) {
    if (!this.site) {
      this.isNewSite = true;
    } else {
      this.buildForm();
    }
    this.siteForm.reset({
      siteref: this.site.siteReference || '',
      sname1: this.site.name1 || '',
      sname2: this.site.name2 || '',
      address: this.site.address || '',
    });

  }
  
  get currentUser() {
    return this.authService.currentUser;
  }
  save() {
    if (!this.form.submitted) {
      this.form.onSubmit(null);
      return;
    }

    if (!this.siteForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    this.alertService.startLoadingMessage('Saving changes...');
    const editedSite = this.getEditedSite();
    if (this.isNewSite) {
      this.accountService.AddSite(editedSite).subscribe(
        (result: any) => {
          if (result.isSuccess) {
            this.saveCompleted(result)
          } else {
            this.saveFailed(result);
          }
        }, error => {
          this.isSaving = false;
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage(error.error.title, null, MessageSeverity.error);
        });

    }

  }
  private getEditedSite(): any {
    const formModel = this.siteForm.value;
    return {
      "id": this.site.id == undefined ? 0 : this.site.id,
      "siteReference": formModel.siteref,
      "name1": formModel.sname1,
      "name2": formModel.sname2,
      "address": formModel.address,
      "fileName":  this.base64string,
      "fileLocation": null,
      "fileExtention": this.fileExtension,
      "createdBy": this.currentUser.id,
      "updatedBy": this.currentUser.id,
      "updatedDate": new Date(),
      "createdDate": new Date()
    };
  }

  private saveCompleted(res) {
    if (res) {
      this.site = res.result;
    }
    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.resetForm(true);
    this.onSiteSaved.next(res);
  }

  private saveFailed(error: any) {
    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage(error.endUserMessage, null, MessageSeverity.error);
  }

  // To convert filr to base64 string
  onSelectFiles(event) {
     var file = event.target.files[0];
     this.fileExtension = '.' + file.name.split('.').pop();
     if (file) {
         let reader = new FileReader();
         reader.onload = (e: any) => {
           var image = e.target.result

           var base64Index = e.target.result.indexOf(this.BASE64_MARKER) + this.BASE64_MARKER.length;
           this.base64string = e.target.result.substring(base64Index);
         }
         reader.readAsDataURL(file);
       }
     
   }
}