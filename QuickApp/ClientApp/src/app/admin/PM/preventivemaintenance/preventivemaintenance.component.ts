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

import { timingSafeEqual } from 'crypto';
import { AddAssetPmComponent } from '../add-asset-pm/add-asset-pm.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Utilities } from 'src/app/services/utilities';
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
  displayedColumns = ['preventiveRefId', 'typeOfMaintainanceName', 'durationInHours', 'technicianName', 'statusTypeName', 'details', 'Actions']
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
  
  assetData: any;
  assetId: any;
  TypeId: any;
  JobPlanData: any;
  names: any[] = [];
  rowId: any;
  assetDataLength: any;
  language: string;
  constructor(private accountService: AccountService, private alertService: AlertService,
    private authService: AuthService, private dialog: MatDialog,
    private formBuilder: FormBuilder,
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.getMaintenance();
    this.getWorkTech();
    this.getTypeOfMaintainces();
   
  }

// To get all  Pm Procedures
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


 
// To get assets by Project and astGroup
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
        debugger
        this.assetData = [];
        res.listResult.forEach((item) => {
          this.maitananceRefData.assetId.forEach(element => {
            if (element.assetId == item.id) {
              this.names.push(item.name1);
              item.isChecked = true;
              this.assetData.push({
                "Id": item.id,
                "name1": item.name1,
                "assetRef": item.assetRef,
                "daysApplicable": item.daysApplicable,
                "astFixedDate": item.astFixedDate
              });
              this.assetDataLength = this.assetData.length;
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


  // To get all Job Plas
  private getJobPlans(Id) {
    this.accountService.getJobPlansByProject(Id)
      .subscribe((results: any) => {
        this.jobPlanList = results.listResult == null ? [] : results.listResult;
        if (!this.isNewMaintanance) {
          this.JobPlanData = this.jobPlanList.filter(job => job.id === this.maitananceRefData.jobPlanId)[0];
          this.getAssetsByProjects();
          this.onSelectJob(this.maitananceRefData.jobPlanId);
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
// To get all projects  by site and user
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

  //To  get all Work technicians
  getWorkTech() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.Technician).subscribe((result: any) => {
      this.workTechList = result.listResult == null ? [] : result.listResult;
    },
      error => {
      })
  }



// On Project change event
  onSelectProjectByAssets(event) {
    this.projectId = event;
    this.assetsList = [];
    this.getJobPlans(event);
  }


// To get all Type Of Maintainces
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
      preventiveRefId: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      assetId: ['', Validators.required],
      siteId: ['', Validators.required],
      jobId: ['', Validators.required],
      projectId: ['', Validators.required],
      locationId: [''],
      priority: ['', Validators.required],
      // startDate: ['', Validators.required],
      durationInHours: ['', Validators.required],
      // daysApplicable: [''],
      typeOfMaintainanceId: ['', Validators.required],
      technicianId: ['', Validators.required],
      details: [''],
      isActive: [true]
    })
  }

  // Setting form values
  private resetForm(stopEditing: boolean = false) {
    if (!this.maitananceRefData) {
      this.isNewMaintanance = true;
    } else {
      this.buildForm();
    }
    this.maintenanceForm.reset({
      siteId: this.maitananceRefData.siteId || '',
      projectId: this.maitananceRefData.projectId || '',
      jobId: this.maitananceRefData.jobPlanId || '',
      locationId: this.maitananceRefData.locationId || '',
      priority: this.maitananceRefData.priority || '',
      preventiveRefId: this.maitananceRefData.preventiveRefId || '',
      // startDate: this.isNewMaintanance ? this.currenrDate : this.maitananceRefData.startDate || '',
      durationInHours: this.maitananceRefData.durationInHours || '',
      //daysApplicable: this.maitananceRefData.daysApplicable || '',
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
        this.getProjectsByUserIdandSiteId(item.siteId);
        this.resetForm();
      });
    },
      error => {
      })
  }

  // TYpe changes event
  onTypeChange(event) {
    this.TypeId = event;
    this.maintenanceForm.get('daysApplicable').setValue(null)
  }


  //To get Job Details by JobplanId
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

  // Add and Edit Jobplan Click
  editClick(maintanance?: any) {
    this.AssetIds = [];
    this.jobTaskList = [];
    this.assetData = [];
    this.maitananceRefData = {};
    if (maintanance != undefined) {
      this.isAdding = true;
      this.isNewMaintanance = false;
      this.maitananceRefData = maintanance;
      this.TypeId = this.maitananceRefData.typeOfMaintainanceId;
      this.maitananceRefData.assetId.forEach(element => {       
        this.AssetIds.push({
          "id": 0,
          "assetId": element.assetId,
          "preventiveMaintenanceId": element.preventiveMaintenanceId,
          "astFixedDate": element.astFixedDate,
          "daysApplicable": element.daysApplicable
        });
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


  // On View Pm Procedure Click
  onViewClick(row) {
    this.PMProcedure = row;
    this.isView = true;
    this.accountService.getPMAssetsbyPMId(this.PMProcedure.id).subscribe((res: any) => {
      this.assetsPMList = res.listResult == null ? [] : res.listResult;
    },
      error => {
      })
  }

  closeViewWorkOrder() {
    this.isView = false;

  }

  // Set Request object form
  private getAllmaitenance(): any {
   
    const formModel = this.maintenanceForm.value
    return {
      "id": (this.isNewMaintanance == true) ? 0 : this.maitananceRefData.id,
      "pmAssets": this.AssetIds,
      "startDate": null,
      "preventiveRefId": formModel.preventiveRefId,
      "durationInHours": formModel.durationInHours,
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

  // on Save Pm Procedure
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

  // on Delete Pm Procedure
  confirmDelete(row) {
    this.language = localStorage.getItem('language');
    if (this.language == 'en') {
      var msg = "Are you sure you want to delete this PM Procedure with relevant Information ?"
    } else {
      var msg = "هل أنت متأكد أنك تريد حذف إجراء PM هذا مع المعلومات ذات الصلة؟"
    }
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: "Delete" + " " + row.preventiveRefId, msg: msg, isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Ok', cancel: 'Cancel' },
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.accountService.deletePMProcedure(row.id)
          .subscribe((results: any) => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success)
            if (results.isSuccess) {
              this.getMaintenance();
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

// On select asset 
  onSelectAssetClick(data) {
    const dialogRef = this.dialog.open(SelectAssetComponent,
      {
        panelClass: 'mat-dialog-md',
        data: { data, assetList: [...this.assetsList], typeId: this.maintenanceForm.value.typeOfMaintainanceId }
      });
    dialogRef.afterClosed().subscribe(response => {
      if (response != null) {
        this.names = [];
        this.AssetIds = [];
        this.assetData = [];
        response.forEach(element => {
          this.names.push(element.name1);
          this.AssetIds.push({
            "id": 0,
            "assetId": element.Id,
            "preventiveMaintenanceId": 0,
            "astFixedDate": element.astFixedDate,
            "daysApplicable": parseInt(element.daysApplicable)
          });

        });

        this.maintenanceForm.get('assetId').setValue(this.names.join());
        this.assetData = JSON.parse(JSON.stringify(response));
        this.assetDataLength = this.assetData.length;
      }
    });
  }


  OnAcceptPmProcedure(row) {
    const dialogRef = this.dialog.open(ApprovePmOrderComponent,
      {
        data: { row }
      });
    dialogRef.afterClosed().subscribe(response => {
      this.getMaintenance();
    });
  }


  // To add Asset to Pm Procedure
  onSelectAsset(req) {
    this.accountService.getPMAssetsbyPMId(req.id).subscribe((res: any) => {
      this.assetsPMList = res.listResult == null ? [] : res.listResult;
      if (this.assetsPMList != null)
        this.assetsPMList.forEach((item) => {
          this.rowId = item.projectId;
        });
      const dialogRef = this.dialog.open(AddAssetPmComponent,
        {
          panelClass: 'mat-dialog-md',
          data: { ProjectId: this.rowId, PmData: req }
        });
      dialogRef.afterClosed().subscribe(response => {
        // this.getMaintenance();
      });
    },
      error => {
      })
  }
  
  //ExportToExcel
  download = function () {
    this.alertService.startLoadingMessage();
    this.accountService.ExportPMProcedure(this.maintenanceData).subscribe((result) => {
      this.alertService.stopLoadingMessage();
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "PmProcedureDetails.xlsx";
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



}
