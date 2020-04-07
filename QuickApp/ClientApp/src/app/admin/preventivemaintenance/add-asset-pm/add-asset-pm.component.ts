import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-add-asset-pm',
  templateUrl: './add-asset-pm.component.html',
  styleUrls: ['./add-asset-pm.component.scss']
})
export class AddAssetPmComponent implements OnInit {
  projectId: any;
  astGroupId: any;
  assetList: any[] = [];
  displayedColumns = ['name1', 'assetRef', 'daysApplicable', 'astFixedDate', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;
  jobPlanList: any;
  JobPlanData: any;
  pmData: any;
  isEditAsset: boolean=false;

  constructor(private accountService: AccountService, private alertService: AlertService,
    public dialogRef: MatDialogRef<AddAssetPmComponent>, @Inject(MAT_DIALOG_DATA) public data: { ProjectId, PmData }) {
    this.pmData = this.data.PmData;
    this.projectId = this.data.ProjectId;
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
      this.assetList = res.listResult == null ? [] : res.listResult;
      this.assetList.forEach((item) => {
        if(item.daysApplicable == null){
          item.daysApplicable =0;
        }
      })
      this.dataSource.data = this.assetList;
    },
      error => {
      })
  }

  private getJobPlanbyPm() {
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
  onEditAsset(row ,i) {
    this.assetList.forEach((item) => {
      if(item.id == row.id){
        
        this.isEditAsset = true;
      }
    })
  }

  onCancelAsset(row) {
    this.isEditAsset = false;
   }

   onSaveAsset(row){

   }
}
