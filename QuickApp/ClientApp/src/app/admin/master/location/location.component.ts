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
import { Permission } from 'src/app/models/permission.model';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';

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
  displayedColumns = ['siteName1', 'projectName1', 'locationReference', 'name1', 'name2', 'isActive', 'Actions']
  displayNoRecords: boolean;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  sitesList: any[] = [];
  userProjectsList: any[] = [];
  language: string;

  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private snackBar: MatSnackBar, private dialog: MatDialog,
    private authService: AuthService, private alertService: AlertService,
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.getLocation();
    this.getSitesByUserId()
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

  // To get Projects by site and userId
  getProjectsByUserIdandSiteId(event) {
    this.userProjectsList = [];
    var req = {
      "siteId": event,
      "userId": this.currentUser.id
    }
    this.accountService.getProjectsByUserIdandSiteId(req)
      .subscribe((results: any) => {
        this.userProjectsList = results.listResult == null ? [] : results.listResult;
        console.log(this.userProjectsList)
      },
        error => {
        });
  }




  //To get all  Location Data
  getLocation() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getLocationData().subscribe((res: any) => {
      this.alertService.stopLoadingMessage();
      this.loadingIndicator = false;
      this.locationsData = res.listResult == null ? [] : res.listResult;
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
      this.getProjectsByUserIdandSiteId(location.siteId)
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

  // permissions
  get canAddLocation() {
    return this.accountService.userHasPermission(Permission.addLocationsPermission);
  }

  get canEditLocation() {
    return this.accountService.userHasPermission(Permission.editLocationsPermission);
  }

  get canDeleteLocation() {
    return this.accountService.userHasPermission(Permission.deleteLocationsPermission);
  }

  //Delete Location 
  onDeleteLocation(location: any) {
    this.language = localStorage.getItem('language');
    if (this.language == 'en') {
      var msg = "Are you sure you want to delete this Location with relevant Information ?"
    } else {
      var msg = " هل أنت متأكد أنك تريد حذف هذا الموقع بالمعلومات ذات الصلة؟ "
    }
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: "Delete" + " " + location.locationReference, msg: msg, isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Ok', cancel: 'Cancel' },
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.accountService.deleteLocation(location.id)
          .subscribe((results: any) => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success)
            if (results.isSuccess) {
              this.getLocation();
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

  //ExportToExcel
  download = function () {
    debugger
    this.alertService.startLoadingMessage();
    this.accountService.ExportLocation(this.locationsData).subscribe((result) => {
      this.alertService.stopLoadingMessage();
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "LocationDetails.xlsx";
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

