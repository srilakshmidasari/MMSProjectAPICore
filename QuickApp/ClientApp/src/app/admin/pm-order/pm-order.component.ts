import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-pm-order',
  templateUrl: './pm-order.component.html',
  styleUrls: ['./pm-order.component.scss']
})
export class PmOrderComponent implements OnInit {
  loadingIndicator: boolean;
  pmOrdersList: any[]=[];
  PMOrderItemList: any[]=[];

  constructor(private accountService: AccountService, private alertService: AlertService,
    private authService: AuthService,) { }

  ngOnInit() {
    this.getPMOrders();
  }



  private getPMOrders() {
    debugger
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.accountService.getPMOrder()
      .subscribe((results: any) => {
        this.pmOrdersList = results.listResult == null ? [] : results.listResult;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
       
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;
        });
  }

  getItemsByworkOrderId(row, val) {
    this.accountService.getItemsByWorkOrderId(row.id)
      .subscribe((results: any) => {
        this.PMOrderItemList = results.listResult == null ? [] : results.listResult;
        
      },
        error => {
        });
  }
}
