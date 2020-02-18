import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  loadingIndicator: boolean;
  sourceitem:any;
  displayedColumns=['itemReference','category','name1','name2','averageCost','unit','unitconversion','isActive','Actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;
  @Input() item:any={}
  itemForm: FormGroup;
  itemData:any = {};
  isNewitem:boolean = false;
  isAddingitem: boolean = false;
  itemlist:any[]=[];
  itemDataSource:any[]=[{
    itemReference:'computer',category:'electronics',name1:'keyboards',name2:'mouse',averageCost:'200',unit:'2',unitconversion:'integer',isActive:'true'
  }];
  constructor( private accountService: AccountService,
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder,) { }

  ngOnInit() {
    debugger;
    this.dataSource.data = this.itemDataSource;
    this.getlookUpData();
    this.buildForm();
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
  private buildForm() {
    debugger
    this.itemForm=this.formBuilder.group({
      itemReference:['',Validators.required],
      selectCategory: [''],
     // SelectUOMId:[''],
      name1:['',Validators.required],
      name2:['',Validators.required],
      averageCost:['',Validators.required],
      unit:['',Validators.required],
      unitconversion:['',Validators.required],
      isActive:[true]
    })
  }

  private getlookUpData() {
    var classTypeId = 2
    this.accountService.getCddmtData(classTypeId).subscribe((response: any) => {
      this.itemlist = response.listResult;
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

  public resetForm(stopEditing: boolean = false){
    debugger
    if (!this.itemData) {
      this.isNewitem = true;
    } else {
      this.buildForm();
    }
    this.itemForm.reset({
      itemReference:this.itemData.itemReference || '',
      selectCategory: this.itemData.lookUpTypeId || '',
      //SelectUOMId:this.itemData.lookUpTypeId || '',
      name1:this.itemData.name1 || '',
      name2:this.itemData.name2 || '',
      averageCost:this.itemData.averageCost || '',
      unit:this.itemData.unit || '',
      unitconversion:this.itemData.unitconversion || '',
      isActive:this.itemData.isActive || '',
    });
  }
  saveitem(){

  }
  onCancelClick(){
 this.isAddingitem = false;
  }
  confirmDelete(){

  }
}

