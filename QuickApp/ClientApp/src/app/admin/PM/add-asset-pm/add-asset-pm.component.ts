import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { DataFactory } from 'src/app/shared/dataFactory';

@Component({
  selector: 'app-add-asset-pm',
  templateUrl: './add-asset-pm.component.html',
  styleUrls: ['./add-asset-pm.component.scss']
})
export class AddAssetPmComponent implements OnInit {
  projectId: any;
  astGroupId: any;
  selectedRow: Number;
  loadingIndicator: boolean = false;
  assetList: any[] = [];
  displayedColumns = ['isChecked','name1', 'assetRef', 'daysApplicable', 'astFixedDate'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;
  jobPlanList: any;
  JobPlanData: any;
  pmData: any;
  astFixDate: any;
  orderDate: any;
  isEditAsset: boolean = false;
  enableEditIndex = null;
  AssetIds: any[] = [];
  pmOrderData: any[] = [];
  row: any;
  editAssetList: any[]=[];
  textDir: any;

  constructor(private accountService: AccountService, private dialog: MatDialog, private authService: AuthService, private alertService: AlertService,
    public dialogRef: MatDialogRef<AddAssetPmComponent>, @Inject(MAT_DIALOG_DATA) public data: { ProjectId, PmData }) {
    this.pmData = this.data.PmData;
    this.projectId = this.data.ProjectId;
    this.textDir = localStorage.getItem('textdir')
    console.log(this.pmData)
  }

  ngOnInit() {
    debugger
    this.getJobPlanbyPm();
  }


  getAssetsByProjects() {
    var req = {
      "projectId": this.projectId,
      "astGroupId": this.JobPlanData.assetGroupId
    }
    this.accountService.getAssetsByProject(req).subscribe((res: any) => {
      this.loadingIndicator = false;
      this.assetList = res.listResult == null ? [] : res.listResult;
      this.assetList.map(row => {
        row.isEditable = false;
      });
      debugger
      this.assetList.forEach((item) => {
        this.pmData.assetId.forEach((obj) => {
          if (obj.assetId == item.id) {
            item.daysApplicable = obj.daysApplicable;
          } else {
            if (item.daysApplicable == null) {
              item.daysApplicable = 0;
            }
          }
        })
      })
      this.dataSource.data = this.assetList;
      this.editAssetList = this.assetList.map(x => Object.assign({}, x));
    },
      error => {
        this.loadingIndicator = false;
      })
  }


  private getJobPlanbyPm() {
    this.loadingIndicator = true;
    this.accountService.getJobPlansByProject(this.projectId)
      .subscribe((results: any) => {
        this.jobPlanList = results.listResult == null ? [] : results.listResult;
        this.JobPlanData = this.jobPlanList.filter(job => job.id === this.pmData.jobPlanId)[0];
        if (this.JobPlanData != null) {
          this.getAssetsByProjects();
        }
      },
        error => {
        });
  }

  Cancel() {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // For search
  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
    if (this.dataSource.filteredData.length == 0) {
      this.displayNoRecords = true;
    } else {
      this.displayNoRecords = false;
    }
  }


  //on edit asset click
  onEditAsset(event, row) {
    this.row = row;
    if(event.checked){
      this.assetList.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
      row.isEditable = true;
      this.pmData.assetId.forEach((obj) => {
        if (obj.assetId == row.id) {
          this.alertService.showStickyMessage('This asset is already assigned to this procedure', null, MessageSeverity.error);
        } 
      })
    }else{
      
    }
  }


  onDaysEnter(enterText) {
    debugger
    if (this.pmData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.Monthly) {
      if (enterText < 30) {
        this.alertService.showStickyMessage('Please Enter 30 Days above for this Monthly Procedure', null, MessageSeverity.error);
      }
    } else if (this.pmData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.Quarterly) {
      if (enterText < 90) {
        this.alertService.showStickyMessage('Please Enter 90 Days above for this Quarterly Procedure', null, MessageSeverity.error);
      }
    } else if (this.pmData.typeOfMaintainanceId== DataFactory.TypeofMaintenance.HalfYearly) {
      if (enterText < 180) {
        this.alertService.showStickyMessage('Please Enter 180 Days above for this HalfYearly Procedure', null, MessageSeverity.error);
      }
    } else if (this.pmData.typeOfMaintainanceId== DataFactory.TypeofMaintenance.Yearly) {
      if (enterText < 365) {
        this.alertService.showStickyMessage('Please Enter 365 Days  for this Yearly Procedure', null, MessageSeverity.error);
      }
    }


  }


  onCancelAsset(row) {
    row.isEditable = false;
    this.assetList = this.editAssetList.map(x => Object.assign({}, x));

  }



  private getAllmaitenance(row): any {
    this.AssetIds = [];
    this.pmData.assetId.forEach((item) => {
      this.AssetIds.push({
        "id": 0,
        "assetId": item.assetId,
        "preventiveMaintenanceId": this.pmData.id,
        "astFixedDate": item.astFixedDate,
        "daysApplicable": item.daysApplicable
      })
    })
    this.AssetIds.push({
      "id": 0,
      "assetId": row.id,
      "preventiveMaintenanceId": this.pmData.id,
      "astFixedDate": row.astFixedDate,
      "daysApplicable": parseInt(row.daysApplicable)
    })
    return {
      "id": this.pmData.id,
      "pmAssets": this.AssetIds,
      "startDate": null,
      "preventiveRefId": this.pmData.preventiveRefId,
      "durationInHours": this.pmData.durationInHours,
      "daysApplicable": this.pmData.daysApplicable,
      "jobPlanId": this.pmData.jobPlanId,
      "priority": this.pmData.priority,
      "details": this.pmData.details,
      "statusTypeId": this.pmData.statusTypeId,
      "typeOfMaintenance": this.pmData.typeOfMaintainanceId,
      "workTechnicianId": this.pmData.technicianId,
      "isActive": true,
      "createdBy": this.currentUser.id,
      "updatedBy": this.currentUser.id,
      "updatedDate": new Date(),
      "createdDate": new Date(),
    }
  }
  get currentUser() {
    return this.authService.currentUser;
  }


  saveMaintenance() {
    this.alertService.startLoadingMessage('Saving changes...');
    const editedSupplier = this.getAllmaitenance(this.row);
    this.accountService.UpdateMaintenance(editedSupplier).subscribe(
      (result: any) => {
        this.alertService.stopLoadingMessage();
        if (result.isSuccess) {
         this.dialogRef.close();
          this.onOrderCofirmation();
        }
      }, error => {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage('An error Occured', null, MessageSeverity.error);
      }
    );
  }

  onOrderCofirmation() {
    debugger
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: "PM Order Generation" + " ", msg: "Are you sure you want to generate the PM Order for this procedure to this asset " + this.row.name1 + "?", isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Ok', cancel: 'Cancel' },
      width: 'auto',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.onOrderGenerate();
      }
    });
  }


  onOrderGenerate() {
    this.pmOrderData = [];
    this.AssetIds.forEach((item) => {
      // this.pmOrderData = [];
      var d = new Date(item.astFixedDate);
      var astday = d.getDate();
      var dt = new Date();
      var year = dt.getFullYear();
      var month = dt.getMonth();
      this.astFixDate = new Date(year, month, astday + 1);
      if (this.pmData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.Monthly) {
        var monthsCount = parseInt(item.daysApplicable) / 30;
        var monthCount = parseInt(monthsCount.toFixed(0));
      } else if (this.pmData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.Quarterly) {
        var monthsCount = parseInt(item.daysApplicable) / 90;
        var monthCount = parseInt(monthsCount.toFixed(0));
      } else if (this.pmData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.HalfYearly) {
        var monthsCount = parseInt(item.daysApplicable) / 180;
        var monthCount = parseInt(monthsCount.toFixed(0));
      } else {
        var monthsCount = parseInt(item.daysApplicable) / 365;
        var monthCount = parseInt(monthsCount.toFixed(0));
        // var monthsCount = 1
      }

      for (var i = 0; i < monthCount; i++) {
        if (i == 0) {
          this.orderDate = new Date(this.astFixDate)
        } else {
          this.orderDate = new Date(this.orderDate)
        }
        if (this.pmData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.Monthly) {
          var astDt = this.orderDate.setMonth(this.orderDate.getMonth() + 1);
        } else if (this.pmData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.Quarterly) {
          var astDt = this.orderDate.setMonth(this.orderDate.getMonth() + 3);
        } else if (this.pmData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.HalfYearly) {
          var astDt = this.orderDate.setMonth(this.orderDate.getMonth() + 6);
        } else {
          var astDt = this.orderDate.setMonth(this.orderDate.getMonth() + 12);
        }

        var req = {
          "id": 0,
          "assetId": item.assetId,
          "startDate": this.orderDate,
          "endDate": this.orderDate,
          "reference1": this.pmData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.Monthly ? this.pmData.preventiveRefId + "PM" + i : this.pmData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.Quarterly ? this.pmData.preventiveRefId + "PMQ" + i : this.pmData.typeOfMaintainanceId == DataFactory.TypeofMaintenance.HalfYearly ? this.pmData.preventiveRefId + "PMH" + i : this.pmData.preventiveRefId + "PMY" + i,
          "extradetails": this.pmData.details,
          "issue": "",
          "resolution": "",
          "statusTypeId": DataFactory.StatusTypes.Open,
          "workTypeId": DataFactory.PMOrderTypes.WorkType,
          "workStatusId": DataFactory.PMOrderTypes.WorkStatus,
          "workTechnicianId": this.pmData.technicianId,
          "workFaultId": DataFactory.PMOrderTypes.WorkFault,
          "storeId": null,
          "pmProcedureId": this.pmData.id,
          "orderTypeId": DataFactory.OrderTypes.PMOrder,
          "isActive": true,
          "workOrderItems": [],
          "createdBy": this.currentUser.id,
          "createdDate": new Date(),
          "updatedBy": this.currentUser.id,
          "updatedDate": new Date()
        }
        this.pmOrderData.push(req);
      }
    })
    this.alertService.startLoadingMessage('Saving changes...');
    this.accountService.addPmOrder(this.pmOrderData).subscribe(
      (response: any) => {
        this.alertService.stopLoadingMessage();
        if (response.isSuccess) {
          this.dialogRef.close();
          this.alertService.showMessage('Success', "PM Order Generated Successfully", MessageSeverity.success)

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
