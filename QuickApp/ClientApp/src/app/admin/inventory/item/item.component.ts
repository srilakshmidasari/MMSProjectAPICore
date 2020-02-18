import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  loadingIndicator: boolean;
  sourceitem: any;
  displayedColumns = ['itemReference', 'category', 'name1', 'name2', 'averageCost', 'unit', 'unitconversion', 'isActive', 'Actions'];
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
  itemCategory: any[]=[];
  UOMId:any[]=[];
  form: any;
  isitem: boolean;
  public isSaving = false;
  // itemDataSource:any[]=[{
  //   itemReference:'computer',category:'electronics',name1:'keyboards',name2:'mouse',averageCost:'200',unit:'2',unitconversion:'integer',isActive:'true'
  // }];
  constructor(private accountService: AccountService,
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder, ) { }

  ngOnInit() {
    debugger;
    // this.dataSource.data = this.itemDataSource;
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
      itemReference: ['', Validators.required],
      selectCategory: [''],
      name1: ['', Validators.required],
      name2: ['', Validators.required],
      uomId: ['', Validators.required],
      averageCost: ['', Validators.required],
      unit: ['', Validators.required],
      unitconversion: ['', Validators.required],
      isActive: [true]
    })
  }

  private getlookUpData() {
    debugger
    var lookUpTypeId = 9
    this.accountService.getLookUpDetailsByTypeId(lookUpTypeId).subscribe((response: any) => {
      this.itemCategory = response.listResult;

    })
  }
  private getUOMIdData() {
    debugger
    var lookUpTypeId = 10
    this.accountService.getLookUpDetailsByTypeId(lookUpTypeId).subscribe((response: any) => {
    this.UOMId = response.listResult;

    })
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
      selectCategory: this.itemData.lookUpTypeId || '',
      uomId: this.itemData.lookUpTypeId || '',
      name1: this.itemData.name1 || '',
      name2: this.itemData.name2 || '',
      averageCost: this.itemData.averageCost || '',
      unit: this.itemData.unit || '',
      unitconversion: this.itemData.unitconversion || '',
      isActive: this.itemData.isActive || '',
    });
  }

  saveitem() {
    debugger
    if(!this.itemForm.valid){
      this.alertService.showValidationError();
      return;
    }
    this.alertService.startLoadingMessage('Saving changes...');
    const editeditem = this.AddAllItemData();
    if(this.isitem)
    {
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
    
}

 private AddAllItemData():any{
  const FormModel = this.itemForm.value;
   return {
    "id":(this.isitem==true)?0:this.itemData.id ,
    "itemReference": FormModel.itemReference,
    "itemCategory":FormModel.itemCategory,
    "name1": FormModel.name1,
    "name2": FormModel.name2,
    "averageCost":FormModel.averageCost,
    "uomId":FormModel.uomId,
    "unitOfConversion":FormModel.unitOfConversion,
    "units": FormModel.units,
    "isActive":FormModel.isActive
    }
 }
  onCancelClick() {
    this.isAddingitem = false;
  }
  confirmDelete() {

  }
}

