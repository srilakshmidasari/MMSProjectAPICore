import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AccountService } from '../../services/account.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss']
})
export class SiteListComponent implements OnInit {
  loadingIndicator: boolean;
  siteInfo: any = [];
  sourceSite:any;

  displayedColumns = ['siteRef', 'name1', 'name2', 'Actions'];
  siteData: any = [
    { siteRef: 'Hyd', name1: 'Hyderadad', name2: 'Jntu' }
  ];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private accountService: AccountService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = this.siteData;
    this.dataSource.sort = this.sort;
    this.getSites();
  }

  getSites() {
    debugger
    this.accountService.getSiteData().subscribe(result => {
      console.log('result data', result);
      this.siteInfo = result;
      //this.dataSource.data=this.siteInfo.listResult;
      this.siteData = result;
    })
  }
  public editRole(site?) {
    this.sourceSite = site;

    // const dialogRef = this.dialog.open(EditRoleDialogComponent,
    //   {
    //     panelClass: 'mat-dialog-md',
    //     data: { site }
    //   });
    // dialogRef.afterClosed().subscribe(role => {
    //   if (role && this.canManageRoles) {
    //     this.updateRoles(role);
    //   }
    // });
  }
}
