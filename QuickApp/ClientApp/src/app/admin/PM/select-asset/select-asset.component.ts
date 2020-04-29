import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { DataFactory } from 'src/app/shared/dataFactory';

@Component({
  selector: 'app-select-asset',
  templateUrl: './select-asset.component.html',
  styleUrls: ['./select-asset.component.scss']
})
export class SelectAssetComponent implements OnInit {
  assetList: any[] = [];
  editAssetList: any[] = [];
  assetIds: any[] = [];
  displayedColumns = ['isChecked', 'name1', 'assetRef', 'daysApplicable', 'astFixedDate'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;
  assetData: any[] = [];
  TypeId: any;
  textDir: any;
  //isChecked: boolean = false;
  constructor(private accountService: AccountService, private alertService: AlertService,
    public dialogRef: MatDialogRef<SelectAssetComponent>, @Inject(MAT_DIALOG_DATA) public data: { data, assetList,typeId }) { 
      this.textDir = localStorage.getItem('textdir')
      this.TypeId =this.data.typeId;
      this.assetList = this.data.assetList;
  
    }

  ngOnInit() {
    this.assetList.forEach((obj) => {
      if(obj.isChecked){
        this.assetData.push({
          "Id": obj.id,
          "name1": obj.name1,
          "daysApplicable":obj.daysApplicable,
          "assetRef":obj.assetRef,
          "astFixedDate":obj.astFixedDate
        });
      }
    })

    this.dataSource.data = this.assetList;
    this.editAssetList = this.assetList.map(x => Object.assign({}, x));
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

  // To Check  Asset  click
  onAssetChecked(ev, obj) {
    if (ev.checked) {
      this.assetData.push(obj);     
    } else {
      this.assetData.forEach((item) => {
        if(item.Id ==obj.id){
          let index = this.assetData.indexOf(item);
          this.assetData.splice(index, 1);
        }
      })
    }
  }

// Days validation
  onDaysEnter(enterText) {
    if (this.TypeId == DataFactory.TypeofMaintenance.Monthly) {
      if (enterText < 30) {
        this.alertService.showStickyMessage('Please Enter 30 Days above for this Monthly Procedure', null, MessageSeverity.error);
      }
    } else if (this.TypeId == DataFactory.TypeofMaintenance.Quarterly) {
      if (enterText < 90) {
        this.alertService.showStickyMessage('Please Enter 90 Days above for this Quarterly Procedure', null, MessageSeverity.error);
      }
    } else if (this.TypeId == DataFactory.TypeofMaintenance.HalfYearly) {
      if (enterText < 180) {
        this.alertService.showStickyMessage('Please Enter 180 Days above for this HalfYearly Procedure', null, MessageSeverity.error);
      }
    } else if (this.TypeId == DataFactory.TypeofMaintenance.Yearly) {
      if (enterText < 365) {
        this.alertService.showStickyMessage('Please Enter 365 Days  for this Yearly Procedure', null, MessageSeverity.error);
      }
    }
  }


  // on cancel click
  Cancel() {
    this.dialogRef.close();
  }

}
