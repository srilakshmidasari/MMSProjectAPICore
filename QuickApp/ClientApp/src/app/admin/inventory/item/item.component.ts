import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Utilities } from 'src/app/services/utilities';
import { MatDialog } from '@angular/material';
import { DataFactory } from 'src/app/shared/dataFactory';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  loadingIndicator: boolean;
  sourceitem: any;
  displayedColumns = ['itemReference', 'categoryName', 'itemTypeName', 'name1', 'name2', 'description', 'averageCost', 'uomName', 'isActive', 'Actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;
  @Input() item: any = {}
  itemForm: FormGroup;
  itemData: any = {};
  isNewitem: boolean = false;
  isAddingitem: boolean = false;
  itemlist: any[] = [];
  itemCategory: any[] = [];
  UOMData: any[] = [];
  form: any;
  isitem: boolean;
  public isSaving = false;
  itemTypes: any[] = [];
  language: string;

  constructor(private accountService: AccountService,
    private alertService: AlertService,
    private authService: AuthService, private dialog: MatDialog,
    private formBuilder: FormBuilder, ) { }

  ngOnInit() {
    debugger;
    this.getlookUpData();
    this.getUOMIdData();
    this.buildForm();
    this.getItem();

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
    if (this.dataSource.filteredData.length == 0) {
      this.displayNoRecords = true;
    } else {
      this.displayNoRecords = false;
    }
  }
  private refresh() {
    // Causes the filter to refresh there by updating with recently added data.
    this.applyFilter(this.dataSource.filter);
  }

  //get data
  private getItem() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getitemdata()
      .subscribe((results: any) => {
        this.itemlist = results.listResult == null ? [] : results.listResult;
        this.dataSource.data = this.itemlist;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
        });
  }

  private buildForm() {
    debugger
    this.itemForm = this.formBuilder.group({
      itemReference: ['', Validators.compose([Validators.required,Validators.minLength(3)])],
      selectCategory: ['', Validators.required],
      itemTypeName: ['', Validators.required],
      name1: ['', Validators.compose([Validators.required,Validators.minLength(3)])],
      name2: ['', Validators.compose([Validators.required,Validators.minLength(3)])],
      description: ['', Validators.compose([Validators.required,Validators.minLength(3)])],
      uomId: ['', Validators.required],
      averageCost: ['', Validators.required],
      unit: [''],
      unitconversion: [''],
      isActive: [true]
    })
  }

  private getlookUpData() {
    var lookUpTypeId = 9
    this.accountService.getLookUpDetailsByTypeId(lookUpTypeId).subscribe((response: any) => {
      this.itemCategory = response.listResult;
      this.getItemTypes()
    })
  }

  private getUOMIdData() {
    debugger
    var lookUpTypeId = 10
    this.accountService.getLookUpDetailsByTypeId(lookUpTypeId).subscribe((response: any) => {
      this.UOMData = response.listResult;

    })
  }

  // Get ItemsTypes List
  private getItemTypes() {
    this.accountService.getCddmtData(DataFactory.ClassTypes.ItemType).subscribe((response: any) => {
      this.itemTypes = response.listResult;
      console.log(this.itemTypes)
    }, error => {
      this.alertService.stopLoadingMessage();
    });
  }

  editClick(item?: any) {
    debugger;
    this.itemData = {};
    if (item != undefined) {
      this.isAddingitem = true;
      this.isNewitem = false;
      this.itemData = item;
      this.resetForm();
    }
    else {
      this.isAddingitem = true;
      this.isNewitem = true;
      this.buildForm();
    }
  }

  public resetForm(stopEditing: boolean = false) {
    debugger
    if (!this.itemData) {
      this.isNewitem = true;
    } else {
      this.buildForm();
    }
    this.itemForm.reset({
      itemReference: this.itemData.itemReference || '',
      selectCategory: this.itemData.itemCategory || '',
      itemTypeName: this.itemData.itemTypeId || '',
      uomId: this.itemData.uomId || '',
      name1: this.itemData.name1 || '',
      name2: this.itemData.name2 || '',
      description: this.itemData.description || '',
      averageCost: this.itemData.averageCost || '',
      unit: this.itemData.units || '',
      unitconversion: this.itemData.unitOfConversion || '',
      isActive: this.itemData.isActive || '',
    });
  }

  saveitem() {
    debugger
    if (!this.itemForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    this.alertService.startLoadingMessage('Saving changes...');
    const editeditem = this.AddAllItemData();
    if (this.isNewitem) {
      this.accountService.AddAllItems(editeditem).subscribe(
        (result: any) => {
          this.alertService.stopLoadingMessage();
          if (result.isSuccess) {
            this.getItem();
            this.isAddingitem = false;
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
    else {
      this.accountService.Updateitem(editeditem).subscribe(
        (result: any) => {
          this.alertService.stopLoadingMessage();
          if (result.isSuccess) {
            this.isAddingitem = false;
            this.alertService.showMessage('Success', result.endUserMessage, MessageSeverity.success)
            this.getItem();

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

  private AddAllItemData(): any {
    debugger
    const formModel = this.itemForm.value;
    return {
      "id": this.isNewitem == true ? 0 : this.itemData.id,
      "itemReference": formModel.itemReference,
      "itemCategory": formModel.selectCategory,
      "itemType": formModel.itemTypeName,
      "name1": formModel.name1,
      "name2": formModel.name2,
      "description": formModel.description,
      "averageCost": parseInt(formModel.averageCost),
      "uomId": formModel.uomId,
      "isActive": formModel.isActive,
      "createdBy": this.currentUser.id,
      "createdDate": new Date(),
      "updatedBy": this.currentUser.id,
      "updatedDate": new Date()
    }

  }

  get currentUser() {
    return this.authService.currentUser;
  }

  onCancelClick() {
    this.isAddingitem = false;
  }

  confirmDelete(item: any) {
    this.language = localStorage.getItem('language');
    if (this.language == 'en') {
      var msg = "Are you sure you want to delete this item ?"
    } else {
      var msg = "هل أنت متأكد أنك تريد حذف هذا البند ؟"
    }
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: "Delete" + " " + item.itemReference, msg: msg, isCheckbox: false, isChecked: false, chkMsg: null, ok: 'Ok', cancel: 'Cancel' },
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.accountService.deleteitem(item.id)
          .subscribe((results: any) => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success)
            if (results.isSuccess) {
              this.getItem();
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
  // Accepting Only Numbers
  numberOnly(event: any) {
    const numberpattern = /[0-9\+\-.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!numberpattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  //ExportToExcel
  download = function () {
    this.alertService.startLoadingMessage();
    this.accountService.ExportItem(this.itemlist).subscribe((result) => {
      this.alertService.stopLoadingMessage();
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "ItemDetails.xlsx";
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


