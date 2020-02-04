import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AccountService } from 'src/app/services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from 'src/app/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  loadingIndicator: boolean;
  sourceProject: any;
  ProjectsList: any[] = []
  displayedColumns = ['projectReference', 'name1', 'name2', 'projectDetails', 'siteName1', 'storeName1', 'updatedDate', 'isActive', 'Actions'];

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;

  projectForm: FormGroup;
 
  isAddingProject: boolean = false;
  isNewEvent: boolean = false;
  constructor(private accountService: AccountService, private snackBar: MatSnackBar, private alertService: AlertService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getProjects();
  }

  private getProjects() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getProject()
      .subscribe((results: any) => {
        this.ProjectsList = results.listResult == null ? [] : results.listResult;
        this.dataSource.data = this.ProjectsList;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
        });
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

}
