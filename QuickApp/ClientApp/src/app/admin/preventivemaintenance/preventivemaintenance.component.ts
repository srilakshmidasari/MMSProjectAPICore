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
  isNewMaintanance:boolean;
  maintenanceList: any[] = [];
  loadingIndicator: boolean;
  maintenanceData: any[] = [];
  siteList: any[] = [];
  displayedColumns =['assetName','siteName','projectName','locationName','startDate','durationInHours','typeOfMaintainanceName','technicianName', 'details','statusTypeName','isActive','Actions']
  displayNoRecords: boolean;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  maintenanceForm: FormGroup;
  userProjectsList: any[]=[];
  locationsList: any[]=[];
  assetsList: any[]=[];
  workTechList: any[]=[];
  TypesList: any[]=[];
  currenrDate: Date;
  constructor(private accountService: AccountService,private alertService: AlertService,
    private authService: AuthService,private dialog: MatDialog,
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
    debugger
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getpreventive().subscribe((results: any) => {
      this.alertService.stopLoadingMessage();
        this.maintenanceData = results.listResult == null ? [] : results.listResult;
        this.dataSource.data = this.maintenanceData;
        this.getSitesByUserId();
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
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
    assetId: ['', Validators.required],
    siteId: ['', Validators.required],
    projectId: ['', Validators.required],
    locationId: ['', Validators.required],
    startDate:['',Validators.required],
    durationInHours:['',Validators.required],
    typeOfMaintainanceId:['',Validators.required],
    statusTypeId:['',Validators.required],
    technicianId:['',Validators.required],
    details:['',Validators.required],
    isActive:[true]
  })
}
private resetForm(stopEditing: boolean = false) {
  if (!this.maitananceRefData) {
    this.isNewMaintanance = true;
  } else {
    this.buildForm();
  }
  this.maintenanceForm.reset({
    assetId: this.maitananceRefData.assetId || '',
    siteId: this.maitananceRefData.projectId || '',
    projectId: this.maitananceRefData.projectId || '',
    locationId: this.maitananceRefData.locationId || '',
    startDate:this.isNewMaintanance ? this.currenrDate : this.maitananceRefData.startDate || '',
    durationInHours:this.maitananceRefData.durationInHours ||'',
    typeOfMaintainanceId:this.maitananceRefData.typeOfMaintainanceId || '',
    statusTypeId:this.maitananceRefData.statusTypeId ||'',
    technicianId:this.maitananceRefData.technicianId ||'',
    details:this.maitananceRefData.statusTypeId ||'',
    isActive: this.maitananceRefData.isActive || ''
  });
}


editClick(maintanance?: any){
  this.maitananceRefData={};
  if(maintanance!=undefined){
    this.isAdding=true;
    this.isNewMaintanance=false;
    this.maitananceRefData=maintanance;
    this.resetForm();
  }
  else {
    this.isAdding = true;
    this.isNewMaintanance = true;
    this.buildForm();
  } 
}

private getAllmaitenance(): any{
  const formModel=this.maintenanceForm.value
  return{
  "id": (this.isNewMaintanance == true) ? 0 : this.maitananceRefData.id,
   "assetId":formModel.assetId,
   "startDate":formModel.startDate,
   "durationInHours":formModel.durationInHours,
   "details":formModel.details,
   "statusTypeId":formModel.statusTypeId,
   "typeOfMaintenance":formModel.typeOfMaintenance,
   "workTechnicianId":formModel.workTechnicianId,
   "isActive": true,
   "createdBy": this.currentUser.id,
   "updatedBy": this.currentUser.id,
   "updatedDate":new Date(),
   "createdDate": new Date(),

  }
}
saveMaintenance(){
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

confirmDelete(){

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
  onCancelClick(){
    this.isAdding = false;
  }

}
