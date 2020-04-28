import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataFactory } from 'src/app/shared/dataFactory';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color, SingleDataSet } from 'ng2-charts';
import { Chart } from 'chart.js';
declare var $: any;
import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  isPdf:boolean = false;
  isChanged: boolean = false;
  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    { data: [], backgroundColor: "", label: '' },
  ];
  //public barChartData: any[] = [];
  public barChartList: any[] = [];

  public secondbarChartLabels = [];
  public secondbarChartType = 'bar';
  public secondbarChartLegend = true;
  // public secondbarChartData: any[] = [];
  public secondbarChartData = [
    { data: [], backgroundColor: "", label: '' },
  ];
  public secondbarChartList: any[] = [];

  public thirdbarChartLabels = [];
  public thirdbarChartType = 'bar';
  public thirdbarChartLegend = true;
  public thirdbarChartData = [
    { data: [], backgroundColor: "", label: '' },
  ];
  // public thirdbarChartData: any[] = [];
  public thirdbarChartList: any[] = [];


  lineChartData: ChartDataSets[] = [
    { data: [], label: '' },
  ];

  lineChartList: any[] = [];
  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: '#6991bc',
      backgroundColor: '#fafafa',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  siteList: any[] = [];
  selectedSite: any;
  selectedProject: any;
  userProjectsList: any[] = [];
  searchForm: FormGroup;
  workTypeList: any;
  priorDate: any;
  currenrDate: Date;
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartList: any[] = [];
  public pieChartData: any[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  pieChartColor: any = [
    {
      backgroundColor: ['rgba(30, 169, 224, 0.8)',
        'rgba(255,165,0,0.9)',
        'rgba(139, 136, 136, 0.9)',
        'rgba(255, 161, 181, 0.9)',
        'rgba(255, 102, 0, 0.9)'
      ]
    }
  ]


  selectedType: any;
  constructor(private accountService: AccountService, private authService: AuthService, private fb: FormBuilder) {
    this.buildForm();
    let days = 30;
    this.priorDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    this.currenrDate = new Date();
    this.searchForm.get('fromDate').setValue(this.priorDate);
    this.searchForm.get('toDate').setValue(this.currenrDate);
  }

  ngOnInit() {
    this.getSitesByUserId();
   debugger
    $("#downloadPdf").click(function(){
      $('.col-md-1').hide();
      html2canvas(document.querySelector("#print-container")).then(canvas => {  
        var dataURL = canvas.toDataURL();
        var pdf = new jsPDF();
        pdf.text("MMS Dashboard", pdf.internal.pageSize.getWidth()/2, 10,{ align: "center" });
        pdf.addImage(dataURL, 'JPEG', 20, 20, 170, 120); //addImage(image, format, x-coordinate, y-coordinate, width, height)  
        pdf.save("dashboard.pdf");
        $('.col-md-1').show();
      });
      
    });
  }


  // Get sites data by UserId
  getSitesByUserId() {
    this.accountService.getSitesByUserId(this.currentUser.id)
      .subscribe((results: any) => {
        this.siteList = results.listResult == null ? [] : results.listResult;
        if (this.siteList.length > 0) {
          this.selectedSite = this.siteList[0].id;
          //  this.searchForm.get('siteId').setValue(this.selectedSite);
        }
      },
        error => {
        });
  }

  getProjectsByUserIdandSiteId(event) {
    this.userProjectsList = [];
    var req = {
      "siteId": event == undefined ? this.selectedSite : event,
      "userId": this.currentUser.id
    }
    this.accountService.getProjectsByUserIdandSiteId(req)
      .subscribe((results: any) => {
        this.userProjectsList = results.listResult == null ? [] : results.listResult;
        if (this.userProjectsList.length > 0) {
          this.selectedProject = this.userProjectsList[0].id;
          // this.searchForm.get('projectId').setValue(this.selectedProject);
        }
        this.getWorkType();
      },
        error => {
        });
  }

  // Current User Details
  get currentUser() {
    return this.authService.currentUser;
  }

  onChangeClick() {
    this.isChanged = true;
  }


  private buildForm() {
    this.searchForm = this.fb.group({
      siteId: ['', Validators.required],
      projectId: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      workTypeId: [''],
    })
  }

  getWorkType() {
    this.accountService.getLookUpDetailsByTypeId(DataFactory.LookUp.WorkType).subscribe((result: any) => {
      this.workTypeList = result.listResult == null ? [] : result.listResult;
      if (this.workTypeList.length > 0) {
        this.selectedType = this.workTypeList[0].id
      }
      if (!this.isChanged) {
        this.onWorkOrdersCount();
      }
    },
      error => {
      })
  }



  onWorkOrdersCount() {
    const formModel = this.searchForm.value;
    this.pieChartData = [];
    this.pieChartLabels = [];
    this.pieChartList = [];
    var req = {
      "projectId": formModel.projectId,
      "fromDate": formModel.fromDate,
      "toDate": formModel.toDate,
      "workTypeId": formModel.workTypeId
    }
    this.accountService.getWorkOrderStatusCount(req).subscribe((result: any) => {
      this.pieChartData = [];
      this.pieChartLabels = [];
      this.pieChartList = [];
      this.pieChartList = result.listResult == null ? [] : result.listResult;
      for (var char of this.pieChartList) {
        this.pieChartLabels.push(char.description);
        this.pieChartData.push(char.ordersCount);
      }
      this.onWorkOrdersStatusCount();
    },
      error => {
      })
  }

  onSearchClick() {
    debugger
    this.onWorkOrdersCount();
  }


  onWorkOrdersStatusCount() {
    const formModel = this.searchForm.value;
    var req = {
      "projectId": formModel.projectId,
      "fromDate": formModel.fromDate,
      "toDate": formModel.toDate,
      "workTypeId": formModel.workTypeId
    }
    this.accountService.getWorkOrdersDashboard(req).subscribe((result: any) => {
      this.barChartData = [];
      this.barChartLabels = [];
      this.barChartList = [];
      var bardata = [];

      this.barChartList = result.listResult == null ? [] : result.listResult;
      for (var char of this.barChartList) {
        this.barChartLabels.push(char.description);
        bardata.push(char.ordersCount);
      }
      this.barChartData.push({
        data: bardata,
        backgroundColor: "rgb(65, 123, 189)",
        label: ""
      })
      this.onWorkOrdersTradesCount();
    },
      error => {
      })
  }

  onWorkOrdersTradesCount() {
    const formModel = this.searchForm.value;
    var req = {
      "projectId": formModel.projectId,
      "fromDate": formModel.fromDate,
      "toDate": formModel.toDate,
      "workTypeId": formModel.workTypeId,
      "statusTypeId": 60
    }
    this.accountService.getWorkOrdersByTradeCount(req).subscribe((result: any) => {
      this.secondbarChartData = [];
      this.secondbarChartLabels = [];
      this.secondbarChartList = [];
      let secondData = []
      this.secondbarChartList = result.listResult == null ? [] : result.listResult;
      for (var char of this.secondbarChartList) {
        this.secondbarChartLabels.push(char.description);
        secondData.push(char.ordersCount);
      }
      this.secondbarChartData.push({
        data: secondData,
        backgroundColor: "rgb(65, 123, 189)",
        label: ""
      })

      this.onWorkOrdersCompletedbyTrade();

    },
      error => {
      })
  }

  onWorkOrdersBacklogCount() {
    const formModel = this.searchForm.value;
    var req = {
      "projectId": formModel.projectId,
      "fromDate": formModel.fromDate,
      "toDate": formModel.toDate,
      "workTypeId": formModel.workTypeId,
      "statusTypeId": 77
    }
    this.accountService.getWorkOrdersByTradeCount(req).subscribe((result: any) => {
      this.lineChartData = [];
      this.lineChartLabels = [];
      this.lineChartList = [];
      let data = [];
      this.lineChartList = result.listResult == null ? [] : result.listResult;
      for (var char of this.lineChartList) {
        this.lineChartLabels.push(char.description);
        data.push(char.ordersCount);
      }
      this.lineChartData.push({
        data: data,
        label: ''
      });
    },
      error => {
      })
  }
  onWorkOrdersCompletedbyTrade() {
    const formModel = this.searchForm.value;
    var req = {
      "projectId": formModel.projectId,
      "fromDate": formModel.fromDate,
      "toDate": formModel.toDate,
      "workTypeId": formModel.workTypeId,
      "statusTypeId": 71
    }
    this.accountService.getWorkOrdersByTradeCount(req).subscribe((result: any) => {
      this.thirdbarChartData = [];
      this.thirdbarChartLabels = [];
      this.thirdbarChartList = [];
      let thirddata = [];
      this.thirdbarChartList = result.listResult == null ? [] : result.listResult;
      for (var char of this.thirdbarChartList) {
        this.thirdbarChartLabels.push(char.description);
        thirddata.push(char.ordersCount);
      }
      this.thirdbarChartData.push({
        data: thirddata,
        backgroundColor: "rgb(65, 123, 189)",
        label: ""
      })
      this.onWorkOrdersBacklogCount();
    },
      error => {
      })
  }




  download() {
  //  this.isPdf= true;
  }

    

  
}
