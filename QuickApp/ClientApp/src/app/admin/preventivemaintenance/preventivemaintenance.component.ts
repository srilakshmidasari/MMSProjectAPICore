import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { AccountService } from 'src/app/services/account.service';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { DataFactory } from 'src/app/shared/dataFactory';
import { constants } from 'os';
import { SelectAssetComponent } from '../select-asset/select-asset.component';
import { ApprovePmOrderComponent } from '../approve-pm-order/approve-pm-order.component';
@Component({
  selector: 'app-preventivemaintenance',
  templateUrl: './preventivemaintenance.component.html',
  styleUrls: ['./preventivemaintenance.component.scss']
})
export class PreventivemaintenanceComponent implements OnInit {
  isAdding: boolean;
  maitananceRefData: any = {};
  isNewMaintanance: boolean;
  maintenanceList: any[] = [];
  loadingIndicator: boolean;
  maintenanceData: any[] = [];
  jobPlanList: any[] = [];
  siteList: any[] = [];
  PMProcedure: any = {};
  isView: boolean = false;
  displayedColumns = ['preventiveRefId', 'typeOfMaintainanceName', 'daysApplicable', 'durationInHours', 'technicianName', 'statusTypeName', 'details', 'Actions']
  displayNoRecords: boolean;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  maintenanceForm: FormGroup;
  userProjectsList: any[] = [];
  locationsList: any[] = [];
  assetsList: any[] = [];
  workTechList: any[] = [];
  TypesList: any[] = [];
  currenrDate: Date;
  assetsPMList: any[] = [];
  AssetIds: any[] = [];
  jobTaskList: any[] = [];
  projectId: any;
  assetList: any[] = [];
  assetData: any;
  assetId: any;
  TypeId: any;
  JobPlanData: any;
  names: any[] = [];
  constructor(private accountService: AccountService, private alertService: AlertService,
    private authService: AuthService, private dialog: MatDialog,
    private formBuilder: FormBuilder,
  ) {
    this.buildForm();
  }

  ngOnInit() {
    debugger
    this.getMaintenance();
    this.getWorkTech();
    this.getTypeOfMaintainces();
    this.getAssets();
  }


  private getMaintenance() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getpreventive().subscribe((results: any) => {
      this.alertService.stopLoadingMessage();
      this.loadingIndicator = false;
      this.maintenanceData = results.listResult == null ? [] : results.listResult;
      this.dataSource.data = this.maintenanceData;
      this.getSitesByUserId();
    },
      error => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
      });
  }

  private getAssets() {
    this.accountService.getAssets()
      .subscribe((results: any) => {
        this.assetList = results.listResult == null ? [] : results.listResult;
      },
        error => {
        });
  }

  getAssetsByProjects() {
    this.names = [];
    var req = {
      "projectId": this.projectId,
      "astGroupId": this.JobPlanData.assetGroupId
    }
    this.accountService.getAssetsByProject(req).subscribe((res: any) => {
      if (this.isNewMaintanance) {
        res.listResult.map(function (obj) {
          obj.isChecked = false;
        })
      } else {
        res.listResult.forEach((item) => {
          this.maitananceRefData.assetId.forEach(element => {
            if (element.assetId == item.id) {
              this.names.push(item.name1);
              item.isChecked = true;
            }
          });
          this.maintenanceForm.get('assetId').setValue(this.names.join());
        })
      }
      this.assetsList = res.listResult == null ? [] : res.listResult;
    },
      error => {
      })
  }

  private getJobPlans(Id) {
    this.accountService.getJobPlansByProject(Id)
      .subscribe((results: any) => {
        this.jobPlanList = results.listResult == null ? [] : results.listResult;
        if (!this.isNewMaintanance) {
          this.JobPlanData = this.jobPlanList.filter(job => job.id === this.maitananceRefData.jobPlanId)[0];
          this.getAssetsByProjects();

          this.onSelectJob(this.maitananceRefData.jobPlanId)

        }

      },
        error => {
        });
  }

  // Get sites data by UserId
  getSitesByUserId() {
    this.accountService.getSitesByUserId(this.currentUser.id)
      .subscribe((results: any) => {
        this.siteList = results.listResult == null ? [] : results.listResult;

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
        if (this.isNewMaintanance == false) {
          this.onSelectProjectByAssets(this.maitananceRefData.projectId)

        }
      },
        error => {
        });
  }

  getWorkTech() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.Technician).subscribe((result: any) => {
      this.workTechList = result.listResult == null ? [] : result.listResult;
    },
      error => {
      })
  }




  onSelectProjectByAssets(event) {
    this.projectId = event;
    this.assetsList = [];
    this.getJobPlans(event);
  }



  private getTypeOfMaintainces() {
    this.accountService.getCddmtData(DataFactory.ClassTypes.TypeOfMaintenance).subscribe((response: any) => {
      this.TypesList = response.listResult;
    })
  }

  get currentUser() {
    return this.authService.currentUser;
  }

  // Accepting Only Numbers
  numberOnly(event: any) {
    const numberpattern = /[0-9\+\-.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!numberpattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  // Form Building
  private buildForm() {
    this.maintenanceForm = this.formBuilder.group({
      preventiveRefId: ['', Validators.required],
      assetId: ['', Validators.required],
      siteId: ['', Validators.required],
      jobId: ['', Validators.required],
      projectId: ['', Validators.required],
      locationId: [''],
      priority: ['', Validators.required],
      // startDate: ['', Validators.required],
      durationInHours: ['', Validators.required],
      daysApplicable: ['', Validators.required],
      typeOfMaintainanceId: ['', Validators.required],
      technicianId: ['', Validators.required],
      details: [''],
      isActive: [true]
    })
  }
  private resetForm(stopEditing: boolean = false) {
    if (!this.maitananceRefData) {
      this.isNewMaintanance = true;
    } else {
      this.buildForm();
    }
    this.maintenanceForm.reset({
      // assetId: this.isNewMaintanance ? this.maitananceRefData.assetId : this.AssetIds || '',
      siteId: this.maitananceRefData.siteId || '',
      projectId: this.maitananceRefData.projectId || '',
      jobId: this.maitananceRefData.jobPlanId || '',
      locationId: this.maitananceRefData.locationId || '',
      priority: this.maitananceRefData.priority || '',
      preventiveRefId: this.maitananceRefData.preventiveRefId || '',
      // startDate: this.isNewMaintanance ? this.currenrDate : this.maitananceRefData.startDate || '',
      durationInHours: this.maitananceRefData.durationInHours || '',
      daysApplicable: this.maitananceRefData.daysApplicable || '',
      typeOfMaintainanceId: this.maitananceRefData.typeOfMaintainanceId || '',
      technicianId: this.maitananceRefData.technicianId || '',
      details: this.maitananceRefData.details || '',
      isActive: this.maitananceRefData.isActive || ''
    });
  }

  getPMAssetsbyPMId(Id) {
    this.assetsPMList = [];
    this.accountService.getPMAssetsbyPMId(Id).subscribe((res: any) => {
      this.assetsPMList = res.listResult == null ? [] : res.listResult;
      this.assetsPMList.forEach((item) => {
        this.maitananceRefData.projectId = item.projectId,
          this.assetId = item.assetId;
        this.maitananceRefData.siteId = item.siteId,
          this.maitananceRefData.locationId = item.locationId
        this.getProjectsByUserIdandSiteId(item.siteId)


        this.resetForm();
      });
    },
      error => {
      })
  }

  onTypeChange(event) {
    this.TypeId = event;
    this.maintenanceForm.get('daysApplicable').setValue(null)

  }

  onDaysEnter(enterText) {
    debugger
    if (this.TypeId == DataFactory.TypeofMaintenance.Monthly) {
      if (enterText < 30) {
        this.alertService.showStickyMessage('Please Enter 30 Days above for this Monthly Procedure', null, MessageSeverity.error);
      }
    } else if (this.TypeId == DataFactory.TypeofMaintenance.Quarterly) {
      if (enterText < 90) {
        this.alertService.showStickyMessage('Please Enter 90 Days above for this Quarterly Procedure', null, MessageSeverity.error);
      }
    } else if (this.TypeId == DataFactory.TypeofMaintenance.HalfYearly) {
      if (enterText < 180) {
        this.alertService.showStickyMessage('Please Enter 180 Days above for this HalfYearly Procedure', null, MessageSeverity.error);
      }
    } else if (this.TypeId == DataFactory.TypeofMaintenance.Yearly) {
      if (enterText < 365) {
        this.alertService.showStickyMessage('Please Enter 365 Days  for this Yearly Procedure', null, MessageSeverity.error);
      }
    }


  }



  onSelectJob(event) {
    this.accountService.getJobTaskByJobPlanId(event)
      .subscribe((results: any) => {
        this.jobTaskList = results.listResult == null ? [] : results.listResult;
        if (this.isNewMaintanance) {
          this.JobPlanData = this.jobPlanList.filter(job => job.id === event)[0];
          this.maintenanceForm.get('technicianId').setValue(this.JobPlanData.technicianId);
          this.maintenanceForm.get('durationInHours').setValue(this.JobPlanData.duration);
          this.getAssetsByProjects();
        }
      },
        error => {
        });
  }

  editClick(maintanance?: any) {
    debugger
    this.AssetIds = [];
    this.jobTaskList = [];
    this.maitananceRefData = {};
    if (maintanance != undefined) {
      this.isAdding = true;
      this.isNewMaintanance = false;
      this.maitananceRefData = maintanance;
      this.TypeId = this.maitananceRefData.typeOfMaintainanceId;
      this.maitananceRefData.assetId.forEach(element => {
        this.AssetIds.push(element.assetId)
      });
      this.getSitesByUserId();
      this.getPMAssetsbyPMId(this.maitananceRefData.id);


    }
    else {
      this.isAdding = true;
      this.isNewMaintanance = true;
      this.buildForm();
      this.resetForm();
    }
  }

    onViewClick(row) {
      this.PMProcedure = row;
      this.isView = true;
    }
  
    closeViewWorkOrder() {
      this.isView = false;
  
    }

  private getAllmaitenance(): any {
    const formModel = this.maintenanceForm.value
    return {
      "id": (this.isNewMaintanance == true) ? 0 : this.maitananceRefData.id,
      "assetIds": this.AssetIds,
      "startDate": null,
      "preventiveRefId": formModel.preventiveRefId,
      "durationInHours": formModel.durationInHours,
      "daysApplicable": formModel.daysApplicable,
      "jobPlanId": formModel.jobId,
      "priority": parseInt(formModel.priority),
      "details": formModel.details,
      "statusTypeId": DataFactory.StatusTypes.Open,
      "typeOfMaintenance": formModel.typeOfMaintainanceId,
      "workTechnicianId": formModel.technicianId,
      "isActive": true,
      "createdBy": this.currentUser.id,
      "updatedBy": this.currentUser.id,
      "updatedDate": new Date(),
      "createdDate": new Date(),
    }
  }

  saveMaintenance() {
    if (!this.maintenanceForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    this.alertService.startLoadingMessage('Saving changes...');
    const editedSupplier = this.getAllmaitenance();
    if (this.isNewMaintanance) {
      this.accountService.Addmaintenance(editedSupplier).subscribe(
        (result: any) => {
          this.alertService.stopLoadingMessage();
          if (result.isSuccess) {
            this.getMaintenance();
            this.isAdding = false;
            this.alertService.showMessage('Success', result.endUserMessage, MessageSeverity.success)
            this.resetForm();
          } else {
            this.alertService.stopLoadingMessage();
            this.alertService.showStickyMessage(result.endUserMessage, null, MessageSeverity.error);
          }
        }, error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('An error Occured', null, MessageSeverity.error);
        }
      );
    }
    else {
      this.accountService.UpdateMaintenance(editedSupplier).subscribe(
        (result: any) => {
          this.alertService.stopLoadingMessage();
          if (result.isSuccess) {

            this.isAdding = false;
            this.alertService.showMessage('Success', result.endUserMessage, MessageSeverity.success)
            this.getMaintenance();

          } else {
            this.alertService.stopLoadingMessage();
            this.alertService.showStickyMessage(result.endUserMessage, null, MessageSeverity.error);
          }
        }, error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('An error Occured', null, MessageSeverity.error);
        }
      );
    }
  }

  confirmDelete() {

  }

  // On Search
  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
    if (this.dataSource.filteredData.length == 0) {
      this.displayNoRecords = true;
    } else {
      this.displayNoRecords = false;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onCancelClick() {
    this.isAdding = false;
  }


  onSelectAssetClick(data) {
    const dialogRef = this.dialog.open(SelectAssetComponent,
      {
        panelClass: 'mat-dialog-md',
        data: { data, assetList: [...this.assetsList] }
      });
    dialogRef.afterClosed().subscribe(response => {
      if (response != null) {
        debugger
        response.forEach(element => {
          this.names.push(element.assetName);
          this.AssetIds.push(element.Id);
        });
        this.maintenanceForm.get('assetId').setValue(this.names.join());
        this.assetData = response;
      }
    });
  }

  OnAcceptPmProcedure(row) {
    const dialogRef = this.dialog.open(ApprovePmOrderComponent,
      {
        data: { row }
      });
    dialogRef.afterClosed().subscribe(response => {
      debugger
      this.getMaintenance();
    });
  }



}
