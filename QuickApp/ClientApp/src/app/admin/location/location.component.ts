import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormBuilder, NgForm, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { Utilities } from 'src/app/services/utilities';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  isAdding: boolean;
  isNewLocation: boolean;
  loadingIndicator: boolean = false;
  locationForm: FormGroup;
  @ViewChild('form', { static: true })
  private form: NgForm;
  siteList: any[] = [];
  projectsList: any[] = []
  locationsData: any[] = [];
  locationRefData: any = {};
  displayedColumns = ['siteName1', 'projectName1', 'locationReference', 'name1', 'name2', 'updatedDate', 'isActive', 'Actions']
  displayNoRecords: boolean;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private authService: AuthService, private alertService: AlertService,
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.getLocation();
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

  // Location Data
  getLocation() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getLocationData().subscribe((res: any) => {
      this.alertService.stopLoadingMessage();
      this.loadingIndicator = false;
      this.locationsData =  res.listResult == null ? [] : res.listResult;
      this.dataSource.data = this.locationsData;
    },
      error => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
      }
    )
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  // Form Building
  private buildForm() {
    this.locationForm = this.fb.group({
      siteId: ['', Validators.required],
      projectId: ['', Validators.required],
      locationRef: ['', Validators.required],
      lName1: ['', Validators.required],
      lname2: ['', Validators.required],
      isActive: [true]
    })
  }

  //Reset Form
  private resetForm() {
    this.locationForm.reset({
      siteId: this.locationRefData.siteId || '',
      projectId: this.locationRefData.projectId || '',
      locationRef: this.locationRefData.locationReference || '',
      lName1: this.locationRefData.name1 || '',
      lname2: this.locationRefData.name2 || '',
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
  get currentUser() {
    return this.authService.currentUser;
  }
  // On Cancel Click
  onLocationCancel() {
    this.isAdding = false;
  }
  //  On Delete Location
  onDeleteLocation(location) {
    this.snackBar.open(`Delete ${location.name1}?`, 'DELETE', { duration: 5000 }).onAction().subscribe(() => {
      this.alertService.startLoadingMessage('Deleting...');
      this.loadingIndicator = true;
      this.accountService.deleteLocation(location.id).subscribe((res: any) => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        if (res.isSuccess) {
          this.alertService.showMessage('Success', res.endUserMessage, MessageSeverity.success);
          this.getLocation();
        }
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
          this.alertService.showStickyMessage('Delete Error', `An error occured whilst deleting the Location.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
            MessageSeverity.error, error);
        },
      )
    })

  }
  //Request Object  For Location
  getLocationObject() {
    const formModel = this.locationForm.value;
    return {
      "id": (this.isNewLocation == true) ? 0 : this.locationRefData.id,
      "siteId": formModel.siteId,
      "projectId": formModel.projectId,
      "name1": formModel.lName1,
      "name2": formModel.lname2,
      "locationReference": formModel.locationRef,
      "isActive": (formModel.isActive == '') ? false : formModel.isActive,
      "createdBy": (this.locationRefData.createdBy == undefined) ? this.currentUser.id : this.locationRefData.createdBy,
      "createdDate": (this.locationRefData.createdDate == undefined) ? new Date() : this.locationRefData.createdDate,
      "updatedBy": this.currentUser.id,
      "updatedDate": new Date()
    }
  }


  // On Location Save
  save() {
    if (!this.locationForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    this.alertService.startLoadingMessage('Saving changes...');
    const editedLocation = this.getLocationObject();
    if (this.isNewLocation) {
      this.accountService.addLocation(editedLocation).subscribe((res: any) => {
        if (res.isSuccess) {
          this.saveCompleted(res);
        } else {
          this.saveFailed(res);
        }
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage(error.error.title, null, MessageSeverity.error);
        })
    }
    else {
      this.accountService.upDateLocation(editedLocation).subscribe((res: any) => {
        if (res.isSuccess) {
          this.saveCompleted(res);
        } else {
          this.saveFailed(res);
        }
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage(error.error.title, null, MessageSeverity.error);
        });
    }
  }
  // On Save Completed
  saveCompleted(result) {
    this.alertService.stopLoadingMessage();
    this.alertService.showMessage('Success', result.endUserMessage, MessageSeverity.success);
    this.isAdding = false;
    this.getLocation();
  }
  // On save Failed
  saveFailed(result) {
    this.alertService.stopLoadingMessage();
    this.alertService.showMessage('error', result.endUserMessage, MessageSeverity.error);
  }

}
