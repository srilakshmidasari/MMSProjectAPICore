import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { DataFactory } from 'src/app/shared/dataFactory';
import { Utilities } from 'src/app/services/utilities';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { concat } from 'rxjs';

@Component({
  selector: 'app-job-plan',
  templateUrl: './job-plan.component.html',
  styleUrls: ['./job-plan.component.scss']
})
export class JobPlanComponent implements OnInit {
  loadingIndicator: boolean;
  jobPlanList: any[]=[];
  jobTaskList: any[]=[];
  isAdding:boolean = false;
  isEdit:boolean = false;
  TaskFrom: FormGroup;
  jobPlanForm: FormGroup;
  siteList: any[]=[];
  userProjectsList: any[]=[];
  technicianList: any[]=[];
  assetGroupList: any[]=[];
  jobPlanData: any = {};
  isNewJobPlan: boolean;
  i: any;
  duration: any;
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



  private getJobPlans() {
    debugger
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

  getJobTaskByJobPlanId(row, val) {
    this.accountService.getJobTaskByJobPlanId(row.id)
      .subscribe((results: any) => {
        this.jobTaskList = results.listResult == null ? [] : results.listResult;
        this.setItems(this.jobTaskList)
      },
        error => {
        });
  }

  getWorkTech() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.Technician).subscribe((result: any) => {
      this.technicianList = result.listResult == null ? [] : result.listResult;
   
    },
      error => {
      })
  }

  getAssetGroup() {
    const typeCddId = 4;
    this.accountService.getLookUpDetailsByTypeId(typeCddId).subscribe((result: any) => {
      this.assetGroupList = result.listResult == null ? [] : result.listResult;
      this.getWorkTech();
    },
      error => {
      })
  }



  addItem(i) {
    (this.TaskFrom.controls['credentials'] as FormArray).push(this.createItem(i));
  }

  createItem(item) {
    return this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),

    })
  }

  buildForm() {
    this.jobPlanForm = this.formBuilder.group({
      jobName: ['', Validators.required],      
      jobReference: ['', Validators.required],
      jobDescription: ['', Validators.required],   
      siteId: [''],
      projectId: [''],  
      assetGroupId: ['', Validators.required],
      technicianId: ['', Validators.required]
    })
  }

  addClick(jobPlan?: any) {
    this.jobPlanData = {};
    this.isAdding = true;
    this.isNewJobPlan = true;
    const arr = <FormArray>this.TaskFrom.controls.credentials;
    arr.controls = [];
    this.buildForm();
    this.addItem(this.i);
  }

  
  Delete(index) {
    (this.TaskFrom.controls['credentials'] as FormArray).removeAt(index);
  }


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

    get currentUser() {
      return this.authService.currentUser;
    }

    setItems(itemsArray: any[]) {
      let control = this.formBuilder.array([]);
      itemsArray.forEach(x => {
        control.push(this.formBuilder.group({
          name: x.name,
          duration: x.duration,
        }))
      })
      this.TaskFrom.setControl('credentials', control);
    }
  

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

    private AddJobPlanData(): any {
      debugger
      var jobTasks = [];
      this.duration ='';
      for (var i = 0; i < this.TaskFrom.value.credentials.length; i++) {
        var itemReq = {
          "id": 0,
          "jobPlanId": this.jobPlanData.id,
          "name": this.TaskFrom.value.credentials[i].name,
          "duration": this.TaskFrom.value.credentials[i].duration,
        }
        var str = this.TaskFrom.value.credentials[i].duration; 
        var matches = str.match(/\d+/g); 
        var addstring = this.duration==undefined || this.duration == "" ?  parseInt(matches[0]) :addstring + parseInt(matches[0]);
        this.duration = String(addstring) +"hrs"
        jobTasks.push(itemReq);
      }
      const formModel = this.jobPlanForm.value;
      return  {
        "id": this.isNewJobPlan == true ? 0 : this.jobPlanData.id,
        "jobReference": formModel.jobReference,
        "name": formModel.jobName,
        "jobDescription": formModel.jobDescription,
        "siteId": formModel.siteId,
        "projectId": formModel.projectId,
        "statusTypeId": 25,
        "technicianId":formModel.technicianId,
        "assetGroupId": formModel.assetGroupId,
        "duration": this.duration,
        "isActive": true,
        "jobPlanTasks": jobTasks,
        "createdBy": this.currentUser.id,
        "createdDate": new Date(),
        "updatedBy": this.currentUser.id,
        "updatedDate": new Date()
      }
    }

    onEditClick(job) {
      this.isEdit = true;
      this.isAdding = false;
      this.isNewJobPlan = false;
      this.jobPlanData = job;
      this.getSitesByUserId();
      this.getProjectsByUserIdandSiteId(job.siteId)
      this.getJobTaskByJobPlanId(job, true);
      this.resetForm();
    }

    public resetForm(stopEditing: boolean = false) {
      if (!this.jobPlanData) {
        this.isNewJobPlan = true;
      } else {
        this.buildForm();
      }
      this.jobPlanForm.reset({
        jobName:  this.jobPlanData.name || '',   
        jobReference: this.jobPlanData.jobReference || '',
        jobDescription: this.jobPlanData.jobDescription || '', 
        siteId: this.jobPlanData.siteId || '',
        projectId: this.jobPlanData.projectId || '',
        assetGroupId: this.jobPlanData.assetGroupId || '',
        technicianId: this.jobPlanData.technicianId || '',
      });
    }

    confirmDelete(job: any) {
      debugger
      let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: { title: "Delete" + " " + job.jobReference, msg: "Are you sure you want to delete this Job Plan with relevant Information ?", isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Ok', cancel: 'Cancel' },
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
  
}
