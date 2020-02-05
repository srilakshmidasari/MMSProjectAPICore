import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AccountService } from 'src/app/services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DataFactory } from 'src/app/shared/dataFactory';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  loadingIndicator: boolean;
  sourceProject: any;
  ProjectsList: any[] = []
  displayedColumns = ['projectReference', 'name1', 'name2', 'projectDetails', 'siteName1', 'updatedDate', 'isActive', 'Actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayNoRecords: boolean;

  storeDataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, { static: true }) storePaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) storeSort: MatSort;
  storeColumns = ['storeName1', 'storeName2', 'remarks', 'isActive', 'updatedDate'];

  projectForm: FormGroup;
  isAddingProject: boolean = false;
  isNewProject: boolean = false;
  isViewStore :boolean = false;
  siteList: any;
  projectData: any = {};
  documentList: any[] = [];
  BASE64_MARKER: string = ';base64,';
  @ViewChild("fileInput", { static: false }) myInputVariable: ElementRef;
  @Input() allowedImageExtension: string = "jpeg , jpg , png";
  @Input() allowedDocExtension: string = "pdf , docx , doc";
  @Input() maxSize: number = 2300;//1150;
  projectRepositories: any[] = [];
  fileExtension: string;
  constructor(private accountService: AccountService, private authService: AuthService, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private alertService: AlertService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getProjects();
    this.getDocuments();
    if (this.isNewProject) {
      this.buildForm();
    }
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
        this.getSites();
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
        });
  }



  private getSites() {
    this.alertService.startLoadingMessage();
    this.accountService.getSiteData()
      .subscribe((results: any) => {
        this.siteList = results.listResult == null ? [] : results.listResult;
        this.alertService.stopLoadingMessage();
      },
        error => {
          this.alertService.stopLoadingMessage();
        });
  }

  // Get Documents List
  private getDocuments() {
    var classTypeId = 1
    this.accountService.getCddmtData(classTypeId).subscribe((response: any) => {
      this.documentList = response.listResult;
    })
  }

  private buildForm() {
    this.projectForm = this.formBuilder.group({
      projectReference: [Validators.required],
      siteId: ['', Validators.required],
      storeId: ['', Validators.required],
      name1: ['', Validators.required],
      name2: ['', Validators.required],
      projectDetails: [Validators.required],
      isActive: [true],
      file: ''

    })
  }

  editClick(project?: any) {
    debugger
    this.isAddingProject = true;
    this.sourceProject = project;
    this.projectData = project;
    if (this.projectData) {
      this.isNewProject = false;
    } else {
      this.projectData = {};
      this.isNewProject = true;
      this.projectData.isActive = true;
    }
    this.resetForm();
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


  //  File  Change Event
  uploadFile(doc, event) {
    debugger
    var file = event.target.files[0];
    if (doc.typeCdDmtId == DataFactory.docType.Image) {
      var extensions = (this.allowedImageExtension.split(',')).map(function (x) { return x.toLocaleUpperCase().trim() });
      if (file != undefined) {
        this.fileExtension = '.' + file.name.split('.').pop();
        // Get file extension
        var ext = file.name.toUpperCase().split('.').pop() || file.name;
        // Check the extension exists
        var exists = extensions.includes(ext);
        if (!exists) {
          this.alertService.showStickyMessage("This File is not allowed. Allowed File Extensions are " + this.allowedImageExtension + " only.", null, MessageSeverity.error);
          this.myInputVariable.nativeElement.value = '';
        } else {
          var fileSizeinMB = file.size / (1024 * 1000);
          var size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
          if (size > this.maxSize) {
            this.alertService.showStickyMessage("File Size exceeds the limit. Max. Allowed Size is : 1 GB", null, MessageSeverity.error);
            this.myInputVariable.nativeElement.value = '';
          } else {
          }
        }
      }
    } else {
      var extensions = (this.allowedDocExtension.split(',')).map(function (x) { return x.toLocaleUpperCase().trim() });
      if (file != undefined) {
        this.fileExtension = '.' + file.name.split('.').pop();
        // Get file extension
        var ext = file.name.toUpperCase().split('.').pop() || file.name;
        // Check the extension exists
        var exists = extensions.includes(ext);
        if (!exists) {
          this.alertService.showStickyMessage("This File is not allowed. Allowed File Extensions are " + this.allowedDocExtension + " only.", null, MessageSeverity.error);
          this.myInputVariable.nativeElement.value = '';
        } else {
          var fileSizeinMB = file.size / (1024 * 1000);
          var size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
          if (size > this.maxSize) {
            this.alertService.showStickyMessage("File Size exceeds the limit. Max. Allowed Size is : 1 GB", null, MessageSeverity.error);
            this.myInputVariable.nativeElement.value = '';
          } else {
          }
        }
      }
    }
    let reader = new FileReader();
    reader.onload = (e: any) => {
      var base64Index = e.target.result.indexOf(this.BASE64_MARKER) + this.BASE64_MARKER.length;
      this.fileExtension = '.' + file.name.split('.').pop();
      this.projectRepositories.push(
        {
          "projectRepositoryId": 0,
          "projectId": 0,
          "fileName": e.target.result.substring(base64Index),
          "fileLocation": null,
          "fileExtention": this.fileExtension,
          "documentTypeId": doc.typeCdDmtId,
          "createdBy": this.currentUser.id,
          "updatedBy": this.currentUser.id,
          "updatedDate": new Date(),
          "createdDate": new Date(),
        })
    }
    reader.readAsDataURL(file);
  }


  public resetForm(stopEditing: boolean = false) {
    debugger
    if (!this.projectData) {
      this.isNewProject = true;

    } else {
      this.buildForm();
    }
    this.projectForm.reset({
      projectReference: this.projectData.projectReference || '',
      siteId: this.projectData.siteId || '',
      storeId: this.projectData.storeId || '',
      name1: this.projectData.name1 || '',
      name2: this.projectData.name2 || '',
      projectDetails: this.projectData.projectDetails || '',
      isActive: this.projectData.isActive || '',
    });
  }

  // Current User Details
  get currentUser() {
    return this.authService.currentUser;
  }

  saveProject() {
    debugger
    if (!this.projectForm.valid) {
      this.alertService.showValidationError();
      return;
    }
    this.alertService.startLoadingMessage('Saving changes...');
    const editedProject = this.getEditedProjet();
    if (this.isNewProject) {
      this.accountService.NewProject(editedProject).subscribe(
        (result:any) => {
          this.alertService.stopLoadingMessage();
          if (result.isSuccess) {
            this.getProjects();
            this.isAddingProject = false;
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
    } else {
      
    }
  }

  private getEditedProjet(): any {
    const formModel = this.projectForm.value;
    return {
      "id": this.isNewProject ? 0 : this.projectData.id,
      "siteId": formModel.siteId,
      "storeId": parseInt(formModel.storeId),
      "projectReference": formModel.projectReference,
      "name1": formModel.name1,
      "name2": formModel.name2,
      "projectDetails": formModel.projectDetails,
      "isActive": formModel.isActive,
      "projectRepositories": this.projectRepositories,
      "createdBy": this.currentUser.id,
      "updatedBy": this.currentUser.id,
      "updatedDate": new Date(),
      "createdDate": new Date()
    };
  }

  onCancelClick(){
    this.isAddingProject = false;
  }

  onViewClick(row){
    this.isViewStore = true
  }

  onCancelViewStore(){
    this.isViewStore = false;
  }
}
