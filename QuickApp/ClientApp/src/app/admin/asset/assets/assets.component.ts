import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
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
import { Permission } from 'src/app/models/permission.model';
import { DataFactory } from 'src/app/shared/dataFactory';
import { MatDialog } from '@angular/material/dialog';
import { DeleteFileComponent } from '../../delete-file/delete-file.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

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

  @ViewChild("fileInput", { static: false }) myInputVariable: ElementRef;
  @Input() allowedImageExtension: string = "jpeg , jpg , png";
  @Input() allowedDocExtension: string = "pdf , docx , doc";
  @Input() maxSize: number = 2300;//1150;
  displayNoRecords: boolean;
  displayedColumns = [ 'assetLocationRef','name1', 'name2','siteName1', 'projectName1', 'locationName1', 'astGroupName1', 'astTradeName1',  'daysApplicable', 'assetSize', 'assetCapacity', 'astFixedDate', 'Actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  image: any;
  document: any
  assetRepositories: any[] = [];
  AssetFiles: any[] = [];
  documentList: any[] = [];
  editDocumentsList: any[] = [];
  isAllow: boolean;
  isImage: any;
  isDocument: any;
  fileData: any = {};
  userProjectsList: any[] = [];
  projectId: any;
  language: string;
  astFixedDate: Date;
  constructor(private accountService: AccountService, private dialog: MatDialog, private authService: AuthService, private snackBar: MatSnackBar, private alertService: AlertService, private fb: FormBuilder) {
    this.buildForm();
    this.currenrDate = new Date();
    this.counterList = this.counterListData;
    this.isImage = DataFactory.docType.Image;
    this.isDocument = DataFactory.docType.Document;
  }

  ngOnInit() {
    this.getAssets();
    this.getDocuments();
    this.getAssetGroup();
    this.getAssetTrade();
  }

  // get Asset Data
  private getAssets() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getAssets()
      .subscribe((results: any) => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.assetLocationList = results.listResult == null ? [] : results.listResult;
        this.dataSource.data = this.assetLocationList;
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

  // To get all projects by userId and Site
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

  // Asset Trade List
  getAssetTrade() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.AstTrade).subscribe((result: any) => {
      this.assetTradeList = result.listResult == null ? [] : result.listResult;
    },
      error => {
      })
  }

  // Asset Group List
  getAssetGroup() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.Group).subscribe((result: any) => {
      this.assetGroupList = result.listResult == null ? [] : result.listResult;
    },
      error => {
      })
  }

// Based on project to get locations
  onSelectProjectByLocation(event) {
    this.locationsList = [];
    this.accountService.getLocationsByProject(event).subscribe((res: any) => {
      this.locationsList = res.listResult == null ? [] : res.listResult;
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
      assetCounter: [''],
      daysApplicable: ['', Validators.required],
      assetFixDate: ['', Validators.required],
      isActive: []
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
  // On Add and Edit Asset Click
  onEditAsset(asset?: any) {
    this.document = null;
    this.assetRefData = {};
    this.isAllow = false;
    this.assetRepositories = [];
    this.editDocumentsList = [];
    this.AssetFiles = [];
    this.getDocuments();
    if (asset != undefined) {
      this.isAdding = true;
      this.isNewAsset = false;
      this.assetRefData = asset;
      this.astFixedDate= new Date(this.assetRefData.astFixedDate);
      this.resetForm();
      this.getAssetRepository();
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
      assetSize: this.assetRefData.assetSize || '',
      assetRef2: this.assetRefData.assetCapacity || '',
      assetTrade: this.assetRefData.astTradeId || '',
      assetCounter: this.assetRefData.astCounter || '',
      daysApplicable:this.assetRefData.daysApplicable || '',
      assetFixDate:  this.astFixedDate || '',
      isActive: this.assetRefData.isActive || '',
    })

  }

  // On Cancel Click
  onAssetCancel() {
    this.isAdding = false;
  }

  // Get Documents List
  private getDocuments() {
    var classTypeId = 1
    this.accountService.getCddmtData(classTypeId).subscribe((response: any) => {
      this.documentList = response.listResult;
      this.editDocumentsList = JSON.parse(JSON.stringify(this.documentList))
    }, error => {
      this.alertService.stopLoadingMessage();
    });
  }

  // Change Event For Group
  onSelectAssGroup(event) {
    this.assetGroupData = {};
    this.accountService.getAssetGroupDataById(event).subscribe((res: any) => {
      this.assetGroupData = res.result;
    },
      error => {
      })
  }


  // forming Request Object
  private getEditedAsset(): any {
    const formModel = this.assetLocationForm.value;
    if (this.isNewAsset) {
      formModel.assetFixDate.setDate(formModel.assetFixDate.getDate() + 1);
     
    } else {

    }
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
      "assetRef2": formModel.assetCapacity,
      "astCounter": parseInt(formModel.assetCounter),
      "astFixedDate": formModel.assetFixDate,      
      "assetMake": formModel.assetMake,
      "assetModel": formModel.assetModel,
      "assetSize": formModel.assetSize,
      "assetCapacity": formModel.assetRef2,
      "assetType": formModel.assetType,
      "isActive": formModel.isActive == '' || formModel.isActive == null ? false : true,
      "createdBy": this.isNewAsset ? this.currentUser.id : this.assetRefData.createdBy,
      "createdDate": new Date(),
      "updatedBy": this.isNewAsset ? this.currentUser.id : this.assetRefData.updatedBy,
      "updatedDate": new Date(),
      "daysApplicable": parseInt(formModel.daysApplicable),
      "assetRepositories": this.assetRepositories
    };
  }

  // Current User Details
  get currentUser() {
    return this.authService.currentUser;
  }

  //  File  Change Event
  uploadFile(doc, event) {
    this.isAllow = false;
    var file = event.target.files[0];
    if (doc.typeCdDmtId == DataFactory.docType.Image) {
      var extensions = (this.allowedImageExtension.split(',')).map(function (x) { return x.toLocaleUpperCase().trim() });
      if (file != undefined) {
        this.fileExtension = '.' + file.name.split('.').pop();
        // Get file extension
        var ext = file.name.toUpperCase().split('.').pop() || file.name;
        // Check the extension exists
        var exists = extensions.includes(ext);
        if (!exists) {
          this.alertService.showStickyMessage("This File is not allowed. Allowed File Extensions are " + this.allowedImageExtension + " only.", null, MessageSeverity.error);
          this.myInputVariable.nativeElement.value = '';
          this.isAllow = true;
        } else {
          var fileSizeinMB = file.size / (1024 * 1000);
          var size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
          if (size > this.maxSize) {
            this.alertService.showStickyMessage("File Size exceeds the limit. Max. Allowed Size is : 1 GB", null, MessageSeverity.error);
            this.myInputVariable.nativeElement.value = '';
            this.isAllow = true;
          } else {
          }
        }
      }
    } else {
      var extensions = (this.allowedDocExtension.split(',')).map(function (x) { return x.toLocaleUpperCase().trim() });
      if (file != undefined) {
        this.fileExtension = '.' + file.name.split('.').pop();
        // Get file extension
        var ext = file.name.toUpperCase().split('.').pop() || file.name;
        // Check the extension exists
        var exists = extensions.includes(ext);
        if (!exists) {
          this.alertService.showStickyMessage("This File is not allowed. Allowed File Extensions are " + this.allowedDocExtension + " only.", null, MessageSeverity.error);
          this.myInputVariable.nativeElement.value = '';
          this.isAllow = true;
        } else {
          var fileSizeinMB = file.size / (1024 * 1000);
          var size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
          if (size > this.maxSize) {
            this.alertService.showStickyMessage("File Size exceeds the limit. Max. Allowed Size is : 1 GB", null, MessageSeverity.error);
            this.myInputVariable.nativeElement.value = '';
            this.isAllow = true;
          } else {
          }
        }
      }
    }
    let reader = new FileReader();
    reader.onload = (e: any) => {
      var base64Index = e.target.result.indexOf(this.BASE64_MARKER) + this.BASE64_MARKER.length;
      this.fileExtension = '.' + file.name.split('.').pop();
      if (!this.isNewAsset) {
        // this.editDocumentsList.forEach((item1) => {
        //   if (item1.typeCdDmtId == doc.typeCdDmtId) this.editDocumentsList.splice(item1, 1);
        // });
        this.assetRepositories.forEach((item1) => {
          if (item1.documentTypeId == doc.typeCdDmtId) this.assetRepositories.splice(item1, 1);
        });
      }
      else if (this.isNewAsset) {
        this.assetRepositories.forEach((item1) => {
          if (item1.documentTypeId == doc.typeCdDmtId) this.assetRepositories.splice(item1, 1);
        });
      }
      if (!this.isAllow) {
        this.assetRepositories.push(
          {
            "assetRpositoryId": 0,
            "assetId": 0,
            "fileName": e.target.result.substring(base64Index),
            "fileLocation": null,
            "fileExtention": this.fileExtension,
            "documentTypeId": doc.typeCdDmtId,
            "createdBy": this.currentUser.id,
            "updatedBy": this.currentUser.id,
            "updatedDate": new Date(),
            "createdDate": new Date(),
          })
      } else {
        this.assetRepositories = [];
      }
    }
    reader.readAsDataURL(file);
  }


// on Save asset Click
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

  // premissions
  get canAddAssets() {
    return this.accountService.userHasPermission(Permission.addAssetsPermission);
  }

  get canEditAssets() {
    return this.accountService.userHasPermission(Permission.editAssetsPermission);
  }

  get canDeleteAssets() {
    return this.accountService.userHasPermission(Permission.deleteAssetsPermission);
  }


  // To get asset Files
  getAssetRepository() {
    this.alertService.startLoadingMessage();
    this.accountService.getAssetRepository(this.assetRefData.id).subscribe((res: any) => {
      this.alertService.stopLoadingMessage();
      this.AssetFiles = res.listResult == null ? [] : res.listResult;
      this.AssetFiles.forEach((item) => {
        this.editDocumentsList.forEach((item1) => {
          if (item.documentType == item1.typeCdDmtId) {
            const index: number = this.editDocumentsList.indexOf(item1);
            if (index !== -1) {
              this.editDocumentsList.splice(index, 1);
            }
          }
        });
      });
    },
      error => {
        this.alertService.stopLoadingMessage();
      })
  }


  //  On Delete File
  onDeleteFile(file) {
    const dialogRef = this.dialog.open(DeleteFileComponent, {
      // panelClass: 'mat-dialog-sm',
      data: file
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getAssetRepository();
      this.fileData = file;
      this.documentList.forEach((item) => {
        if (item.typeCdDmtId === file.documentType) this.editDocumentsList.push(item);
      });
    })
  }

  //Delete Assets 
  confirmDelete(asset: any) {
    this.language = localStorage.getItem('language');
    if(this.language == 'en'){
     var msg="Are you sure you want to delete this Asset with relevant Information(PM Orders) ?"
    }else{
      var msg="هل أنت متأكد أنك تريد حذف هذا الأصل مع المعلومات ذات الصلة (أوامر PM)؟"
     }
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: "Delete" + " " + asset.assetLocationRef, msg:msg,  isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Ok', cancel: 'Cancel' },
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.accountService.deleteAsset(asset.id)
          .subscribe((results: any) => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success)
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
      }
    });
  }

   //ExportToExcel
   download = function () {
    this.alertService.startLoadingMessage();
    this.accountService.ExportAsset(this.assetLocationList).subscribe((result) => {
      this.alertService.stopLoadingMessage();
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "AssetDetails.xlsx";
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
