import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/services/alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from 'src/app/services/account.service';
import { ThemeService } from 'ng2-charts';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-asset-location',
  templateUrl: './asset-location.component.html',
  styleUrls: ['./asset-location.component.scss']
})
export class AssetLocationComponent implements OnInit {
  isAdding: boolean = false;
  displayedColumns = ['siteName', 'projectName', 'locationName', 'assName', 'Actions'];
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
  assetData: any[] = [
    { siteName: 'Site Name 1', projectName: 'Project Name 1', locationName: 'Location Name1', assName: 'Asset Name 1' },
    { siteName: 'Site Name 2', projectName: 'Project Name 2', locationName: 'Location Name2', assName: ' Asset Name 2 ' }
  ];
  counterList: any[] = [];
  counterListData: any[] = [
    { id: 1, value: 1 }, { id: 2, value: 2 }, { id: 3, value: 3 }, { id: 4, value: 4 }, { id: 5, value: 5 }, { id: 6, value: 6 },
    { id: 7, value: 7 }, { id: 8, value: 8 }, { id: 9, value: 9 }, { id: 10, value: 10 }, { id: 11, value: 11 }, { id: 12, value: 12 },
  ];

  displayNoRecords: boolean;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private accountService: AccountService, private snackBar: MatSnackBar, private alertService: AlertService, private fb: FormBuilder) {
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
        console.log(this.assetLocationList )
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
      assetRef: [''],
      aName1: [''],
      aName2: [''],
      assGroup: [''],
      assType: [''],
      assMake: [''],
      assModel: [''],
      assSize: [''],
      assRef2: [''],
      assTrade: [''],
      assCounter: [''],
      assFixDate: ['']
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
    }
  }
  // Reseting Form Values
  private resetForm() {
    this.assetLocationForm.reset({
      siteId: this.assetRefData.siteName,
      projectId: this.assetRefData.projectName,
      locationId: this.assetRefData.locationName,
      aName1: this.assetRefData.assName
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

}
