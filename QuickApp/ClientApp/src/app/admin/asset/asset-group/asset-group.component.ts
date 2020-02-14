import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { AccountService } from 'src/app/services/account.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Utilities } from 'src/app/services/utilities';
import { Permission } from 'src/app/models/permission.model';

@Component({
  selector: 'app-asset-group',
  templateUrl: './asset-group.component.html',
  styleUrls: ['./asset-group.component.scss']
})
export class AssetGroupComponent implements OnInit {
  assetGroupForm: FormGroup;
  displayNoRecords: boolean;
  isAdding: boolean;
  dataSource = new MatTableDataSource<any>();
  loadingIndicator: boolean;
  assetGroupList: any[] = [];
  assetGroupData: any = {};
  isNewAssetGroup: boolean;
  displayedColumns = ['name1', 'name2', 'assetRef1', 'assetRef2', 'assetMake', 'assetModel', 'assetType', 'assetCapacity', 'updatedDate', 'isActive', 'Actions']
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private fb: FormBuilder, private authService: AuthService, private alertService: AlertService,
    private snackBar: MatSnackBar, private accountService: AccountService) {
    this.buildForm();
  }

  ngOnInit() {
    this.getAllAssetGroups();
  }

  // Asset Group Data
  getAllAssetGroups() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getAssetGroupData().subscribe((result: any) => {
      this.assetGroupList = result.listResult == null ? [] : result.listResult;
      this.dataSource.data = this.assetGroupList;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.alertService.stopLoadingMessage();
      this.loadingIndicator = false;
    })
  }
  // Current User Details
  get currentUser() {
    return this.authService.currentUser;
  }
  // form Building
  private buildForm() {
    this.assetGroupForm = this.fb.group({
      agName1: ['', Validators.required],
      agName2: ['', Validators.required],
      agRef1: ['', Validators.required],
      agMake: ['', Validators.required],
      agModel: ['', Validators.required],
      agType: ['', Validators.required],
      agCapacity: ['', Validators.required],
      agRef2: ['', Validators.required],
      isActive: [true, Validators.required]
    })
  }
  //  Reset Form data
  private resetForm() {
    this.assetGroupForm.reset({
      agName1: this.assetGroupData.name1,
      agName2: this.assetGroupData.name2,
      agRef1: this.assetGroupData.assetRef1,
      agRef2: this.assetGroupData.assetRef2,
      agMake: this.assetGroupData.assetMake,
      agModel: this.assetGroupData.assetModel,
      agType: this.assetGroupData.assetType,
      agCapacity: this.assetGroupData.assetCapacity,
      isActive: this.assetGroupData.isActive

    })
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
  // On Cancel Click
  onAssetGroupCancel() {
    this.isAdding = false;
  }
  // On  Add Or Edit Click
  onEditAssetGroup(assGroup?: any) {
    this.assetGroupData = {};
    this.isAdding = true;
    if (assGroup != undefined) {
      this.isAdding = true;
      this.isNewAssetGroup = false;
      this.assetGroupData = assGroup;
      this.resetForm();
    }
    else {
      this.isAdding = true;
      this.isNewAssetGroup = true;
      this.buildForm();
    }
  }
  //Request Object For Asset Group Adding And Editing
  getAssetGroupReq() {
    const formModel = this.assetGroupForm.value;
    return {
      "id": (this.isNewAssetGroup == true) ? 0 : this.assetGroupData.id,
      "name1": formModel.agName1,
      "name2": formModel.agName2,
      "assetRef1": formModel.agRef1,
      "assetRef2": formModel.agRef2,
      "assetMake": formModel.agMake,
      "assetModel": formModel.agModel,
      "assetCapacity": formModel.agCapacity,
      "assetType": formModel.agType,
      "isActive": formModel.isActive,
      "createdBy": (this.isNewAssetGroup == true) ? this.currentUser.id : this.assetGroupData.createdBy,
      "createdDate": (this.isNewAssetGroup == true) ? new Date() : this.assetGroupData.createdDate,
      "updatedBy": this.currentUser.id,
      "updatedDate": new Date()
    }
  }
  // On Save Click
  save() {
    if (!this.assetGroupForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    this.alertService.startLoadingMessage('Saving changes...');
    const editedAssGroup = this.getAssetGroupReq();
    if (this.isNewAssetGroup) {
      this.accountService.addAssetGroup(editedAssGroup).subscribe((res: any) => {
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
      this.accountService.upDateAssetGroup(editedAssGroup).subscribe((res: any) => {
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
    this.getAllAssetGroups();
  }
  // On save Failed
  saveFailed(result) {
    this.alertService.stopLoadingMessage();
    this.alertService.showMessage('error', result.endUserMessage, MessageSeverity.error);
  }
  // On Delete Click
  confirmDelete(assGroup) {
    this.snackBar.open(`Delete ${assGroup.name1}?`, 'DELETE', { duration: 5000 }).onAction().subscribe(() => {
      this.alertService.startLoadingMessage('Deleting...');
      this.loadingIndicator = true;
      this.accountService.deleteAssetGroup(assGroup.id).subscribe((res: any) => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        if (res.isSuccess) {
          this.alertService.showMessage('Success', res.endUserMessage, MessageSeverity.success);
          this.getAllAssetGroups();
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

  get canAddAssetsGroup() {
    return this.accountService.userHasPermission(Permission.addAssetGroupsPermission);
  }

  get canEditAssetsGroup() {
    return this.accountService.userHasPermission(Permission.editAssetGroupsPermission);
  }

  get canDeleteAssetsGroup() {
    return this.accountService.userHasPermission(Permission.deleteAssetGroupsPermission);
  }



  // onFirstCapital(event: any) {
  //   const alphabetspattern = /^[A-Z][a-z0-9_-]{3,19}$/;
  //   let inputChar = String.fromCharCode(event.charCode);
  //   if (!alphabetspattern.test(inputChar)) {
  //     event.preventDefault();
  //   }

  // }

}
