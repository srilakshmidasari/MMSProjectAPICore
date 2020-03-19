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
  displayedColumns = ['preventiveRefId', 'typeOfMaintainanceName', 'startDate', 'durationInHours', 'technicianName', 'statusTypeName', 'details', 'isActive', 'Actions']
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
  jobTaskList: any[]=[];
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


  private getJobPlans() {
    this.accountService.getJobPlan()
      .subscribe((results: any) => {
        this.jobPlanList = results.listResult == null ? [] : results.listResult;
      },
        error => {
        });
  }

  // Get sites data by UserId
  getSitesByUserId() {
    this.accountService.getSitesByUserId(this.currentUser.id)
      .subscribe((results: any) => {
        this.siteList = results.listResult == null ? [] : results.listResult;
        this.getJobPlans();
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

  getWorkTech() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.Technician).subscribe((result: any) => {
      this.workTechList = result.listResult == null ? [] : result.listResult;
    },
      error => {
      })
  }


  onSelectProjectByLocation(event) {
    this.locationsList = [];
    this.accountService.getLocationsByProject(event).subscribe((res: any) => {
      this.locationsList = res.listResult == null ? [] : res.listResult;

    },
      error => {
      })
  }

  onSelectLocationByProject(event) {
    this.assetsList = [];
    this.accountService.getAssetsByLocationId(event).subscribe((res: any) => {
      this.assetsList = res.listResult == null ? [] : res.listResult;
    },
      error => {
      })
  }

  private getTypeOfMaintainces() {
    this.accountService.getCddmtData(DataFactory.ClassTypes.TypeOfMaintenance).subscribe((response: any) => {
      this.TypesList = response.listResult;
    })
  }

  get currentUser() {
    return this.authService.currentUser;
  }


  // Form Building
  private buildForm() {
    this.maintenanceForm = this.formBuilder.group({
      preventiveRefId: ['', Validators.required],
      assetId: ['', Validators.required],
      siteId: ['', Validators.required],
      jobId: ['', Validators.required],
      projectId: ['', Validators.required],
      locationId: ['', Validators.required],
      startDate: ['', Validators.required],
      durationInHours: ['', Validators.required],
      typeOfMaintainanceId: ['', Validators.required],
      technicianId: ['', Validators.required],
      details: ['', Validators.required],
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
      assetId: this.isNewMaintanance ? this.maitananceRefData.assetId : this.AssetIds || '',
      siteId: this.maitananceRefData.siteId || '',
      projectId: this.maitananceRefData.projectId || '',
      jobId: this.maitananceRefData.jobPlanId || '',
      locationId: this.maitananceRefData.locationId || '',
      preventiveRefId: this.maitananceRefData.preventiveRefId || '',
      startDate: this.isNewMaintanance ? this.currenrDate : this.maitananceRefData.startDate || '',
      durationInHours: this.maitananceRefData.durationInHours || '',
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
          this.maitananceRefData.siteId = item.siteId,
          this.maitananceRefData.locationId = item.locationId
        this.getProjectsByUserIdandSiteId(item.siteId)
        this.onSelectProjectByLocation(item.projectId)
        this.onSelectLocationByProject(item.locationId)
        this.resetForm();
      });
    },
      error => {
      })
  }

  onSelectJob(event) {
    debugger
    this.accountService.getJobTaskByJobPlanId(event)
      .subscribe((results: any) => {
        this.jobTaskList = results.listResult == null ? [] : results.listResult;
      },
        error => {

        });
  }

  editClick(maintanance?: any) {
    debugger
    this.AssetIds = [];
    this.jobTaskList=[];
    this.maitananceRefData = {};
    if (maintanance != undefined) {
      this.isAdding = true;
      this.isNewMaintanance = false;
      this.maitananceRefData = maintanance;
      this.getSitesByUserId();
      this.getJobPlans();
      this.getPMAssetsbyPMId(this.maitananceRefData.id)
      this.onSelectJob(this.maitananceRefData.jobPlanId)
      this.maitananceRefData.assetId.forEach(element => {
        this.AssetIds.push(element.assetId)
      });
    }
    else {
      this.isAdding = true;
      this.isNewMaintanance = true;
      this.buildForm();
      this.resetForm();
    }


    

  }

  private getAllmaitenance(): any {
    const formModel = this.maintenanceForm.value
    return {
      "id": (this.isNewMaintanance == true) ? 0 : this.maitananceRefData.id,
      "assetIds": formModel.assetId,
      "startDate": formModel.startDate,
      "preventiveRefId": formModel.preventiveRefId,
      "durationInHours": formModel.durationInHours,
      "jobPlanId": formModel.jobId,
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
    debugger
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

}
