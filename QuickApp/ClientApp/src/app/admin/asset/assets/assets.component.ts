import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from 'src/app/services/account.service';
import { ThemeService } from 'ng2-charts';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Utilities } from 'src/app/services/utilities';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {
  fileExtension: string;
  BASE64_MARKER: string = ';base64,';
  base64string: string;
  isAdding: boolean = false;
  loadingIndicator: boolean = false;
  isNewAsset: boolean = false;
  assetRefData: any = {};
  assetLocationForm: FormGroup;
  assetLocationList: any[] = [];
  projectsList: any[] = [];
  siteList: any[] = [];
  assetTradeList: any[] = [];
  locationsList: any[] = [];
  assetGroupList: any[] = [];
  assetGroupData: any = {};
  currenrDate: Date;
  assetGroupList1: any[] = [];
  counterList: any[] = [];
  counterListData: any[] = [
    { id: 1, value: 1 }, { id: 2, value: 2 }, { id: 3, value: 3 }, { id: 4, value: 4 }, { id: 5, value: 5 }, { id: 6, value: 6 },
    { id: 7, value: 7 }, { id: 8, value: 8 }, { id: 9, value: 9 }, { id: 10, value: 10 }, { id: 11, value: 11 }, { id: 12, value: 12 },
  ];

  displayNoRecords: boolean;
  displayedColumns = ['siteName', 'projectName', 'locationName', 'assetGroupName', 'assetTradeName', 'name1', 'name2', 'assetRefrerence', 'assetCounter', 'assetFixedDate', 'updatedDate', 'isActive', 'Actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  image: any;
  constructor(private accountService: AccountService, private authService: AuthService, private snackBar: MatSnackBar, private alertService: AlertService, private fb: FormBuilder) {
    this.buildForm();
    this.currenrDate = new Date();
    this.counterList = this.counterListData;
  }

  ngOnInit() {
    this.getAssets();
    this.getAllAssetGroups();
    this.getAssetTrade();
  }

  // get Asset Data
  private getAssets() {
    debugger
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getAssets()
      .subscribe((results: any) => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.assetLocationList = results.listResult == null ? [] : results.listResult;
        this.dataSource.data = this.assetLocationList;
        this.getSites();
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
        });
  }


  // Site Data
  private getSites() {
    this.accountService.getSiteData()
      .subscribe((results: any) => {
        this.siteList = results.listResult == null ? [] : results.listResult;
        this.getProjects();
      },
        error => {
        });
  }
  // Project Data
  private getProjects() {
    this.accountService.getProject()
      .subscribe((results: any) => {
        this.projectsList = results.listResult == null ? [] : results.listResult;
        this.getLocations();
      },
        error => {
        });
  }


  // Location Data
  getLocations() {
    this.accountService.getLocationData().subscribe((res: any) => {
      this.locationsList = res.listResult == null ? [] : res.listResult;

    },
      error => {
      }
    )
  }
  // Asset Group List
  getAllAssetGroups() {
    this.accountService.getAssetGroupData().subscribe((result: any) => {
      this.assetGroupList1 = result.listResult == null ? [] : result.listResult;
      this.assetGroupList = this.assetGroupList1.filter(x => x.isActive == true);
    },
      error => {

      }
    )
  }
  // Asset Trade List
  getAssetTrade() {
    const typeCddId = 5;
    this.accountService.getLookUpDetailsByTypeId(typeCddId).subscribe((result: any) => {
      this.assetTradeList = result.listResult == null ? [] : result.listResult;
    },
      error => {
      })
  }

  // Form Building
  private buildForm() {
    this.assetLocationForm = this.fb.group({
      siteId: ['', Validators.required],
      projectId: ['', Validators.required],
      locationId: ['', Validators.required],
      assetRef: ['', Validators.required],
      name1: ['', Validators.required],
      name2: ['', Validators.required],
      assetGroup: ['', Validators.required],
      assetType: [''],
      assetMake: [''],
      assetModel: [''],
      assetSize: [''],
      assetRef2: [''],
      assetTrade: ['', Validators.required],
      assetCounter: ['', Validators.required],
      assetFixDate: ['', Validators.required],
      isActive: [true]
    })
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
  // On Edit Asset Click
  onEditAsset(asset?: any) {
    this.assetRefData = {};
    if (asset != undefined) {
      this.isAdding = true;
      this.isNewAsset = false;
      this.assetRefData = asset;
      this.resetForm();
    }
    else {
      this.isAdding = true;
      this.isNewAsset = true;
      this.buildForm();
      this.assetRefData.isActive = true;
    }
    this.resetForm();
  }


  // Reseting Form Values
  private resetForm() {
    this.assetLocationForm.reset({
      siteId: this.assetRefData.siteId || '',
      projectId: this.assetRefData.projectId || '',
      locationId: this.assetRefData.locationId || '',
      assetRef: this.assetRefData.assetLocationRef || '',
      name1: this.assetRefData.name1 || '',
      name2: this.assetRefData.name2 || '',
      assetGroup: this.assetRefData.astGroupId || '',
      assetType: this.assetRefData.assetType || '',
      assetMake: this.assetRefData.assetMake || '',
      assetModel: this.assetRefData.assetModel || '',
      assetSize: this.assetRefData.assetCapacity || '',
      assetRef2: this.assetRefData.assetGroupRef2 || '',
      assetTrade: this.assetRefData.astTradeId || '',
      assetCounter: this.assetRefData.astCounter || '',
      assetFixDate: this.assetRefData.astFixedDate || '',
      isActive: this.assetRefData.isActive || '',
    })

  }

  // On Cancel Click
  onAssetCancel() {
    this.isAdding = false;
  }


  // Change Evene For Group
  onSelectAssGroup(event) {
    this.assetGroupData = {};
    this.accountService.getAssetGroupDataById(event).subscribe((res: any) => {
      this.assetGroupData = res.result;
    },
      error => {

      })
  }

  // To convert filr to base64 string
  onSelectFiles(event) {
    this.fileExtension = '';
    var file = event.target.files[0];
    this.fileExtension = '.' + file.name.split('.').pop();
    if (file) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.isNewAsset) {
          this.image = e.target.result
        } else {
         this.assetRefData.fileLocation =e.target.result
           
        }
        var base64Index = e.target.result.indexOf(this.BASE64_MARKER) + this.BASE64_MARKER.length;
        this.base64string = e.target.result.substring(base64Index);
      }
      reader.readAsDataURL(file);
    }
  }

  // forming Request Object
  private getEditedAsset(): any {
    const formModel = this.assetLocationForm.value;
    return {
      "id": this.isNewAsset ? 0 : this.assetRefData.id,
      "siteId": formModel.siteId,
      "projectId": formModel.projectId,
      "astTradeId": formModel.assetTrade,
      "astGroupId": formModel.assetGroup,
      "locationId": formModel.locationId,
      "name1": formModel.name1,
      "name2": formModel.name2,
      "assetRef": formModel.assetRef,
      "astCounter": parseInt(formModel.assetCounter),
      "astFixedDate": formModel.assetFixDate,
      "fileName": this.base64string,
      "fileLocation": "",
      "fileExtention": this.fileExtension,
      "isActive":formModel.isActive =='' || formModel.isActive == null ? false:true,
      "createdBy": this.isNewAsset ? this.currentUser.id : this.assetRefData.createdBy,
      "createdDate": new Date(),
      "updatedBy": this.isNewAsset ? this.currentUser.id : this.assetRefData.updatedBy,
      "updatedDate": new Date()
    };
  }

  // Current User Details
  get currentUser() {
    return this.authService.currentUser;
  }


  saveAssets() {
    if (!this.assetLocationForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    this.alertService.startLoadingMessage('Saving changes...');
    const editedAsset = this.getEditedAsset();
    if (this.isNewAsset) {
      this.accountService.addAsset(editedAsset).subscribe(
        (result: any) => {
          this.alertService.stopLoadingMessage();
          if (result.isSuccess) {
            this.getAssets();
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
    } else {
      this.accountService.updateAsset(editedAsset).subscribe(
        (result: any) => {
          this.alertService.stopLoadingMessage();
          if (result.isSuccess) {
            this.getAssets();
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
  }


  public confirmDelete(asset: any) {
    this.snackBar.open(`Delete ${asset.name1}?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage('Deleting...');
        this.loadingIndicator = true;
        this.accountService.deleteAsset(asset.id)
          .subscribe((results: any) => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            if (results.isSuccess) {
              this.getAssets();
            }
          },
            error => {
              this.alertService.stopLoadingMessage();
              this.loadingIndicator = false;
              this.alertService.showStickyMessage('Delete Error', `An error occured whilst deleting the user.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
                MessageSeverity.error, error);
            });
      });
  }

}
