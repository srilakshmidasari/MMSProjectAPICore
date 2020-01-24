import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss']
})
export class SiteListComponent implements OnInit { 
  loadingIndicator:boolean;
   displayedColumns=['siteRef','name1','name2','Actions'];
  siteData: any=[
    {siteRef:'Hyd',name1:'Hyderadad',name2:'Jntu'}
  ];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private accountService:AccountService ) { }

  ngOnInit() {
   this.dataSource.paginator = this.paginator;
   this.dataSource.data=this.siteData;
   this.dataSource.sort = this.sort;
  }

  getSites(){
this.accountService.getSiteData().subscribe(result=>{
  this.siteData= result;

})
  }
}
