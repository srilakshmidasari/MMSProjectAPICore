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
  displayedColumns = ['siteName', 'projectName', 'locationName', 'Actions'];
  loadingIndicator: boolean = false;
  isNewAsset: boolean = false;
  assetRefData: any = {};
  assetForm: FormGroup;
  projectsList: any[] = [];
  siteList: any[] = [];
  locationsList: any[] = [];
  assetData: any[] = [
    { siteName: 'Site Name 1', projectName: 'Project Name 1', locationName: 'Location Name1' },
    { siteName: 'Site Name 2', projectName: 'Project Name 2', locationName: 'Location Name2' }
  ];
  displayNoRecords: boolean;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private accountService: AccountService, private snackBar: MatSnackBar, private alertService: AlertService,
    private fb: FormBuilder) {
    this.buildForm();
  }

  ngOnInit() {
    this.getSites();
    this.getProjects();
    this.getLocations();
    this.dataSource.data = this.assetData;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Site Data
  private getSites() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getSiteData()
      .subscribe((results: any) => {
        this.siteList = results.listResult == null ? [] : results.listResult;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = false;
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
        });
  }
  // Project Data
  private getProjects() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getProject()
      .subscribe((results: any) => {
        this.projectsList = results.listResult == null ? [] : results.listResult;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = false;
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
        });
  }
  // Location Data
  getLocations() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getLocationData().subscribe((res: any) => {
      this.locationsList = res.listResult == null ? [] : res.listResult;
      this.alertService.stopLoadingMessage();
      this.loadingIndicator = false;
    },
      error => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
      }
    )
  }
  // Form Building
  private buildForm() {
    this.assetForm = this.fb.group({
      siteId: ['', Validators.required],
      projectId: ['', Validators.required],
      locationId:['',Validators.required],
      assetRef:[''],
      aName1:[''],
      aName2:[''],
      assGroup:[''],
      assType:[''],
      assMake:[''],
      assModel:[''],
      assSize:[''],
      assRef2:[''],
      assTrade:[''],
      assCounter:[''],
      assFixDate:['']
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
    this.isAdding = true;
    if (asset != undefined) {
      this.isAdding = true;
      this.isNewAsset = false;
      this.assetRefData = asset;
      //this.resetForm();
    }
    else {
      this.isAdding = true;
      this.isNewAsset = true;
      //this.buildForm();
    }
  }
  // On Cancel Click
  onAssetCancel() {
    this.isAdding = false;
  }


}
