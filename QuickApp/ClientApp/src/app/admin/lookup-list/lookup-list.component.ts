import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MessageSeverity, AlertService } from 'src/app/services/alert.service';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { LookupDialogComponent } from '../lookup-dialog/lookup-dialog.component';

@Component({
  selector: 'app-lookup-list',
  templateUrl: './lookup-list.component.html',
  styleUrls: ['./lookup-list.component.scss']
})
export class LookupListComponent implements OnInit {
  displayedColumn = ['description','name1', 'name2', 'remarks', 'updatedDate','updatedByUser', 'isActive','Actions'];
  dataSource = new MatTableDataSource<any>();
  lookUpData: any[] = [];
  sourcelookup:any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;
  
  constructor(private authService: AuthService, private alertService: AlertService,
    private accountService: AccountService,
    private dialog: MatDialog) { }

  ngOnInit() {
    debugger
    this.getLookUp();   
  }

  // Look Up Data
  getLookUp() {
    this.accountService.getLookUPData().subscribe((result: any) => {
      this.lookUpData = result.listResult;
      this.dataSource.data= this.lookUpData;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    })
    
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

  private updateLookUp(response:any){
   if(this.sourcelookup){
     this.getLookUp();
     this.alertService.showMessage('Success', response.endUserMessage, MessageSeverity.success)
     this.sourcelookup = null;
     } else {
    this.getLookUp();
    this.alertService.showMessage('Success', response.endUserMessage, MessageSeverity.success)
      }
  }

   editlookup(lookUp?:any){
    this.sourcelookup=lookUp;
    const dialogRef = this.dialog.open(LookupDialogComponent,
      {
        panelClass: 'mat-dialog-md',
        data: {lookUp}
      });
      dialogRef.afterClosed().subscribe(LookUPresponse => {
        if (LookUPresponse) {
          this.updateLookUp(LookUPresponse);
        }
      });
  }

}
