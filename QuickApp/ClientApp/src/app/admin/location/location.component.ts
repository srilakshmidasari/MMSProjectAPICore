import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  isAdding: boolean;
  isNewLocation: boolean;
  locationForm: FormGroup;
  siteList: any[] = [];
  projectsList: any[] = []
  locationRefData: any = {};
  displayedColumns = ['siteName', 'projectName', 'locationRef', 'lname1', 'lname2', 'isActive', 'Actions']
  locationData: any[] = [
    { siteName: 'Site 1', projectName: 'Save Blood', locationRef: 'locationRef12', lname1: 'Location Name1', lname2: 'Location Name1', isActive: true },
    { siteName: 'Site 2', projectName: 'MMS', locationRef: 'locationRef45', lname1: 'Location Name 2', lname2: 'Location Name1', isActive: true },
    { siteName: 'Site 3', projectName: 'Telugu Churches', locationRef: 'locationRef89', lname1: ' Location Name3', lname2: 'Location Name1', isActive: false },
  ];
  displayNoRecords: boolean;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.dataSource.data = this.locationData;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getSites();
    this.getProjects();
  }

  // Site Data
  private getSites() {
    this.accountService.getSiteData()
      .subscribe((results: any) => {
        this.siteList = results.listResult == null ? [] : results.listResult;
      },
        error => {
        });
  }
  // Project Data
  private getProjects() {
    this.accountService.getProject()
      .subscribe((results: any) => {
        this.projectsList = results.listResult == null ? [] : results.listResult;
      },
        error => {
        });
  }
  // Form Building
  private buildForm() {
    this.locationForm = this.fb.group({
      siteName: [''],
      projectName: [''],
      locationRef: [''],
      lName1: [''],
      lname2: [''],
      isActive: [true]
    })
  }

  //Reset Form
  private resetForm() {
    this.locationForm.reset({
      siteName: this.locationRefData.siteName || '',
      projectName: this.locationRefData.projectName || '',
      locationRef: this.locationRefData.locationRef || '',
      lName1: this.locationRefData.lname1 || '',
      lname2: this.locationRefData.lname2 || '',
      isActive: this.locationRefData.isActive || ''
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
  // On Add Or Edit  Click
  onEditLocation(location?: any) {
    this.locationRefData = {};
    if (location != undefined) {
      this.isAdding = true;
      this.isNewLocation = false;
      this.locationRefData = location;
      this.resetForm();
    }
    else {
      this.isAdding = true;
      this.isNewLocation = true;
      this.buildForm();

    }
  }
  // On Cancel Click
  onLocationCancel() {
    this.isAdding = false;
  }
  //  On Delete Location
  onDeleteLocation(location) {
    this.snackBar.open(`Delete ${location.lname1}?`, 'DELETE', { duration: 5000 }).onAction().subscribe(()=>{
      alert('are You Sure Want to delete')
    })
   
  }





}

