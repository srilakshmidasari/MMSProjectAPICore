import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-select-asset',
  templateUrl: './select-asset.component.html',
  styleUrls: ['./select-asset.component.scss']
})
export class SelectAssetComponent implements OnInit {
  assetList: any[] = [];
  editAssetList: any[] = [];
  assetIds: any[] = [];
  displayedColumns = ['isChecked', 'name1', 'assetRef', 'assetCounter', 'astFixedDate'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;
  assetData: any[] = [];
  //isChecked: boolean = false;
  constructor(private accountService: AccountService, private alertService: AlertService,
    public dialogRef: MatDialogRef<SelectAssetComponent>, @Inject(MAT_DIALOG_DATA) public data: { data, assetList }) { }

  ngOnInit() {
    debugger
    this.assetList = this.data.assetList;
    this.assetList.forEach((obj) => {
      if(obj.isChecked){
        this.assetData.push({
          "Id": obj.id,
          "assetName": obj.name1
        });
      }
    })

    this.dataSource.data = this.assetList;
    this.editAssetList = this.assetList.map(x => Object.assign({}, x));

    // this.getAssets();
  }

  getRecord(row) {
    this.assetList.forEach((obj) => {
      if (obj.id == row.id) {
        row.isChecked = true;
        this.assetData = row;
      } else {
        obj.isChecked = false;
      }
    })
  }
  onCheckBoxChecked() {

  }

  // getRecord(row){
  //   this.assetList.forEach((obj) => {
  //     if(obj.id ==row.id){
  //       row.isChecked = true;
  //       this.assetData =row;
  //     }else{
  //       obj.isChecked = false;
  //     }
  //   })
  // }

  // private getAssets() {
  //   debugger
  //   this.accountService.getAssets()
  //     .subscribe((results: any) => {
  //       results.listResult.map(function (obj) {
  //         obj.isChecked = false;
  //       })
  //       this.assetList = results.listResult == null ? [] : results.listResult;
  //       this.dataSource.data = this.assetList;
  //     },
  //       error => {
  //       });
  // }

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

  // To Check Single Assets 
  onAssetChecked(ev, obj) {
    debugger
    if (ev.checked) {
      this.assetData.push({
        "Id": obj.id,
        "assetName": obj.name1
      });
    } else {
      this.assetData.forEach((item) => {
        if(item.Id ==obj.id){
          let index = this.assetData.indexOf(item);
          this.assetData.splice(index, 1);
        }
      })
     

    }
  }

  //To Check All Assets
  checkAllAssets(ev) {
    if (ev.target.checked) {
      this.assetList.forEach((obj) => {
        obj.isChecked = true;
        // this.invoices.push({
        //   "invoiceIds": obj.invoiceNumber,
        //   "amount": obj.balanceAmount
        // });
      })
    } else {
      this.assetList.forEach((obj) => {
        obj.isChecked = false;
        // this.invoices = [];
      })
    }
  }


  Cancel() {
    this.dialogRef.close();
  }

}
