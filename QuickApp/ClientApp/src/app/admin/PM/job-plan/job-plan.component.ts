import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { DataFactory } from 'src/app/shared/dataFactory';
import { Utilities } from 'src/app/services/utilities';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Permission } from 'src/app/models/permission.model';

@Component({
  selector: 'app-job-plan',
  templateUrl: './job-plan.component.html',
  styleUrls: ['./job-plan.component.scss']
})
export class JobPlanComponent implements OnInit {
  loadingIndicator: boolean;
  jobPlanList: any[] = [];
  jobTaskList: any[] = [];
  isAdding: boolean = false;
  isEdit: boolean = false;
  TaskFrom: FormGroup;
  jobPlanForm: FormGroup;
  siteList: any[] = [];
  userProjectsList: any[] = [];
  technicianList: any[] = [];
  assetGroupList: any[] = [];
  jobPlanData: any = {};
  isNewJobPlan: boolean;
  i: any;
  duration: any;
  tradeList: any[] = [];
  language: string;
  constructor(private accountService: AccountService, private alertService: AlertService,
    private authService: AuthService, private dialog: MatDialog, private formBuilder: FormBuilder) {
    this.TaskFrom = this.formBuilder.group({
      credentials: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    this.getJobPlans();
    this.buildForm();
  }


  //To get all jobplans
  private getJobPlans() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getJobPlan()
      .subscribe((results: any) => {
        this.jobPlanList = results.listResult == null ? [] : results.listResult;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.getSitesByUserId();
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
        });
  }


  // To get all job taks By jobplanId
  getJobTaskByJobPlanId(row, val) {
    this.accountService.getJobTaskByJobPlanId(row.id)
      .subscribe((results: any) => {
        this.jobTaskList = results.listResult == null ? [] : results.listResult;
        this.setTasks(this.jobTaskList)
      },
        error => {
        });
  }


  // To get all work technicians
  getWorkTech() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.Technician).subscribe((result: any) => {
      this.technicianList = result.listResult == null ? [] : result.listResult;
      this.getAssetTrade();
    },
      error => {
      })
  }

  // To get all Asset groups
  getAssetGroup() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.Group).subscribe((result: any) => {
      this.assetGroupList = result.listResult == null ? [] : result.listResult;
      this.getWorkTech();
    },
      error => {
      })
  }


  // Form creation
  buildForm() {
    this.jobPlanForm = this.formBuilder.group({
      jobName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      totalDuration: ['', Validators.required],
      jobReference: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      jobDescription: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      siteId: [''],
      projectId: [''],
      assetGroupId: ['', Validators.required],
      technicianId: ['', Validators.required]
    })
  }


  // To Add task to form
  addTask(i) {
    (this.TaskFrom.controls['credentials'] as FormArray).push(this.createTask(i));
  }


  // Create task form
  createTask(task) {
    return this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      tradeId: new FormControl('', [Validators.required])
    })
  }


  // To add job plan click
  addClick(jobPlan?: any) {
    this.jobPlanData = {};
    this.isAdding = true;
    this.isNewJobPlan = true;
    const arr = <FormArray>this.TaskFrom.controls.credentials;
    arr.controls = [];
    this.buildForm();
    this.addTask(this.i);
  }


  Delete(index) {
    (this.TaskFrom.controls['credentials'] as FormArray).removeAt(index);
  }

  // on cancel click
  onCancelClick() {
    this.isAdding = false;
    this.isEdit = false;
    this.TaskFrom.setControl('credentials', this.formBuilder.array([]));
  }

  // Get sites data by UserId
  getSitesByUserId() {
    this.accountService.getSitesByUserId(this.currentUser.id)
      .subscribe((results: any) => {
        this.siteList = results.listResult == null ? [] : results.listResult;
        this.getAssetGroup();
      },
        error => {
        });
  }

  // To get all projects by site and user
  getProjectsByUserIdandSiteId(event) {
    this.userProjectsList = [];
    var req = {
      "siteId": event,
      "userId": this.currentUser.id
    }
    this.accountService.getProjectsByUserIdandSiteId(req)
      .subscribe((results: any) => {
        this.userProjectsList = results.listResult == null ? [] : results.listResult;
      },
        error => {
        });
  }

  // Asset Trade List
  getAssetTrade() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.AstTrade).subscribe((result: any) => {
      this.tradeList = result.listResult == null ? [] : result.listResult;
    },
      error => {
      })
  }

  get currentUser() {
    return this.authService.currentUser;
  }

  //  To set task to form
  setTasks(itemsArray: any[]) {
    let control = this.formBuilder.array([]);
    itemsArray.forEach(x => {
      control.push(this.formBuilder.group({
        name: x.name,
        duration: x.duration,
        tradeId: x.astTradeId
      }))
    })
    this.TaskFrom.setControl('credentials', control);
  }


  // Accepting Only Numbers
  numberOnly(event: any) {
    const numberpattern = /[0-9\+\-.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!numberpattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // On save jobplan Click
  saveJobPlan() {
    if (!this.jobPlanForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    this.alertService.startLoadingMessage('Saving changes...');
    const editeditem = this.AddJobPlanData();
    if (this.isNewJobPlan) {
      this.accountService.AddJobPlan(editeditem).subscribe(
        (response: any) => {
          this.alertService.stopLoadingMessage();
          if (response.isSuccess) {
            this.getJobPlans();
            this.isAdding = false;
            this.alertService.showMessage('Success', response.endUserMessage, MessageSeverity.success)
          } else {
            this.alertService.stopLoadingMessage();
            this.alertService.showStickyMessage(response.endUserMessage, null, MessageSeverity.error);
          }
        }, error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('An error Occured', null, MessageSeverity.error);
        }
      );
    }
    else {
      this.accountService.UpdateJobPlan(editeditem).subscribe(
        (response: any) => {
          this.alertService.stopLoadingMessage();
          if (response.isSuccess) {
            this.isAdding = false;
            this.isEdit = false;
            this.alertService.showMessage('Success', response.endUserMessage, MessageSeverity.success)
            this.getJobPlans();

          } else {
            this.alertService.stopLoadingMessage();
            this.alertService.showStickyMessage(response.endUserMessage, null, MessageSeverity.error);
          }
        }, error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('An error Occured', null, MessageSeverity.error);
        }
      );
    }
  }
  // Setting Save click request object
  private AddJobPlanData(): any {
    var jobTasks = [];
    this.duration = "";
    for (var i = 0; i < this.TaskFrom.value.credentials.length; i++) {
      var itemReq = {
        "id": 0,
        "jobPlanId": 0,
        "name": this.TaskFrom.value.credentials[i].name,
        "duration": this.TaskFrom.value.credentials[i].duration,
        "astTradeId": this.TaskFrom.value.credentials[i].tradeId
      }
      jobTasks.push(itemReq);
    }
    const formModel = this.jobPlanForm.value;
    return {
      "id": this.isNewJobPlan == true ? 0 : this.jobPlanData.id,
      "jobReference": formModel.jobReference,
      "name": formModel.jobName,
      "jobDescription": formModel.jobDescription,
      "siteId": formModel.siteId == "" ? null : formModel.siteId,
      "projectId": formModel.projectId == "" ? null : formModel.projectId,
      "statusTypeId": 25,
      "technicianId": formModel.technicianId,
      "assetGroupId": formModel.assetGroupId,
      "duration": formModel.totalDuration,
      "isActive": true,
      "jobPlanTasks": jobTasks,
      "createdBy": this.currentUser.id,
      "createdDate": new Date(),
      "updatedBy": this.currentUser.id,
      "updatedDate": new Date()
    }
  }

  // On Edit job Plan click
  onEditClick(job) {
    this.isEdit = true;
    this.isAdding = false;
    this.isNewJobPlan = false;
    this.jobPlanData = job;
    this.getSitesByUserId();
    this.getProjectsByUserIdandSiteId(job.siteId)
    this.getJobTaskByJobPlanId(job, true);
    this.getAssetTrade();
    this.resetForm();
  }
  // To set values to form
  public resetForm(stopEditing: boolean = false) {
    if (!this.jobPlanData) {
      this.isNewJobPlan = true;
    } else {
      this.buildForm();
    }
    this.jobPlanForm.reset({
      jobName: this.jobPlanData.name || '',
      totalDuration: this.jobPlanData.duration || '',
      jobReference: this.jobPlanData.jobReference || '',
      jobDescription: this.jobPlanData.jobDescription || '',
      siteId: this.jobPlanData.siteId || '',
      projectId: this.jobPlanData.projectId || '',
      assetGroupId: this.jobPlanData.assetGroupId || '',
      technicianId: this.jobPlanData.technicianId || '',
    });

  }

  // Delete Job Plan
  onDeleteJob(job: any) {

    this.language = localStorage.getItem('language');
    if (this.language == 'en') {
      var msg = "Are you sure you want to delete this Location with relevant Information ?"
    } else {
      var msg = "هل أنت متأكد أنك تريد حذف هذا الموقع بالمعلومات ذات الصلة؟"
    }
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: "Delete" + " " + job.jobReference, msg: msg, isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Ok', cancel: 'Cancel' },
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.accountService.deleteJobPlan(job.id)
          .subscribe((results: any) => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success)
            if (results.isSuccess) {
              this.getJobPlans();
            }
          },
            error => {
              this.alertService.stopLoadingMessage();
              this.loadingIndicator = false;
              this.alertService.showStickyMessage('Delete Error', `An error occured whilst deleting the user.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
                MessageSeverity.error, error);
            });
      }
    });
  }

  //ExportToExcel
  download = function () {
    this.alertService.startLoadingMessage();
    this.accountService.ExportJobPlan(this.jobPlanList).subscribe((result) => {
      this.alertService.stopLoadingMessage();
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "JobPlabDetails.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      else {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage('An error Occured', null, MessageSeverity.error);
      }
    },
      error => {
        this.alertService.showStickyMessage('An error Occured', null, MessageSeverity.error);
      })
  }

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

    // permissions
    get canAddJobPlans() {
      return this.accountService.userHasPermission(Permission.addJobPlansPermission);
    }
  
    get canEditJobPlans() {
      return this.accountService.userHasPermission(Permission.editJobPlansPermission);
    }
  
    get canDeleteJobPlans() {
      return this.accountService.userHasPermission(Permission.deleteJobPlansPermission);
    }

}
