import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { AccountService } from 'src/app/services/account.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-preventivemaintenance',
  templateUrl: './preventivemaintenance.component.html',
  styleUrls: ['./preventivemaintenance.component.scss']
})
export class PreventivemaintenanceComponent implements OnInit {
  isAdding: boolean;
  maitananceRefData: any = {};
  isNewMaintanance:boolean;
  displayedColumns =['sitename','projectname','locationName','assetname','startDate','technician','duration','details', 'isActive','Actions']
  maintanacecoloumns:any[]=[{
    sitename:'AparnaCostructions',projectname:'B1',locationName:"WestFace Buildiing1",assetname:'Inverter',startDate:'12-3-2020',technician:'Sabitha',duration:'8 hrs',details:'working good'
  }]
  displayNoRecords: boolean;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  maintenanceForm: FormGroup;
  
  constructor(private accountService: AccountService,
    private authService: AuthService,private dialog: MatDialog,
    private formBuilder: FormBuilder,
   ) { }

  ngOnInit() {
    this.dataSource.data = this.maintanacecoloumns;
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


  confirmDelete(){

  }

// Form Building
private buildForm() {
  this.maintenanceForm = this.formBuilder.group({
    siteId: ['', Validators.required],
    projectId: ['', Validators.required],
    locationId: ['', Validators.required],
    assetId: ['', Validators.required],
    startDate:['',Validators.required],
    technician:['',Validators.required],
    duration:['',Validators.required],
    details:['',Validators.required],
    isActive:[true]
  })
}
private resetForm() {
  this.maintenanceForm.reset({
    siteId: this.maitananceRefData.siteId || '',
    projectId: this.maitananceRefData.projectId || '',
    locationId: this.maitananceRefData.locationId || '',
    assetId: this.maitananceRefData.assetId || '',
    startDate: this.maitananceRefData.startDate || '',
    technician:this.maitananceRefData.technician ||'',
    duration:this.maitananceRefData.duration || '',
    details:this.maitananceRefData.details ||'',
    isActive: this.maitananceRefData.isActive || ''
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
  onCancelClick(){
    this.isAdding = false;
  }

}
