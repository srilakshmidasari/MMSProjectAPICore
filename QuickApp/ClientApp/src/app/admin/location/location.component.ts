import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  loadingIndicator:boolean;
  isAdding:boolean;
  isNewLocation:boolean;
  locationForm:FormGroup;
  displayedColumns=['siteName','projectName','locationRef','lname1','lname2','Actions']
  locationData:any[]=[
    {siteName:'Site 1',projectName:'Save Blood',locationRef:'locationRef12',lname1:'Location Name1',lname2:'Location Name1'},
    {siteName:'Site 2',projectName:'MMS',locationRef:'locationRef45',lname1:'Location Name 2',lname2:'Location Name1'},
    {siteName:'Site 3',projectName:'Telugu Churches',locationRef:'locationRef89',lname1:' Location Name3',lname2:'Location Name1'},
  ];
  displayNoRecords:boolean;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator; 
  constructor(private fb:FormBuilder) { }

  ngOnInit() {
    this.dataSource.data=this.locationData;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.buildForm();
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

// On Add Or Edit  Click
onEditLocation(location){
  if(location!=undefined){
    this.isAdding=true;
    this.isNewLocation=false;
  }
  else
  {
    this.isAdding=true;
    this.isNewLocation=true;
  }
}

// On Cancel Click
onLocationCancel(){
this.isAdding=false;
}
// Form Building
private buildForm(){
  this.locationForm=this.fb.group({
    siteName:[''],
    projectName:[''],
    locationRef:[''],
    lName1:[''],
    lname2:[''],
    isActive:['']
  })
}

}

