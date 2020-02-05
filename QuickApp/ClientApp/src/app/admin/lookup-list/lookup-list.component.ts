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
  displayedColumn = ['Category', 'Name1', 'Name2', 'Remarks', 'UpdatedDate', 'UpdatedBy', 'isActive', 'Actions'];
  dataSource = new MatTableDataSource<any>();
  lookUpData: any[] = [];
  sourcelookup:any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  
  constructor(private authService: AuthService, private alertService: AlertService,
    private accountService: AccountService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  // Look Up Data
  getLookUp() {
    this.accountService.getLookUPData().subscribe((result: any) => {
      this.lookUpData = result;
    })
  }

  editlookup(lookUp?:any){
    this.sourcelookup=lookUp;
    const dialogRef = this.dialog.open(LookupDialogComponent,
      {
        panelClass: 'mat-dialog-md',
        data: {  }
      });
      dialogRef.afterClosed().subscribe(LookUPresponse => {
        if (LookUPresponse) {
       
         // this.updateLookUp(siteresponse);
        }
      });
  }
}
