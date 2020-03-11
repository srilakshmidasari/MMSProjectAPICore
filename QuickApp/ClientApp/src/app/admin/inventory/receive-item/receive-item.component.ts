import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AccountService } from 'src/app/services/account.service';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import PrintThis from 'pure-print'
@Component({
  selector: 'app-receive-item',
  templateUrl: './receive-item.component.html',
  styleUrls: ['./receive-item.component.scss']
})
export class ReceiveItemComponent implements OnInit {
  itemList: any[] = [];
  purchaseData: any = {};
  itemFrom: FormGroup;
  i: any;
  isViewRecipt:boolean = false
  billingAddress: any[]=[];
  shippingAddress: any[]=[];
  sumTotal:number
  isReadOnly: boolean= false;
  inventoryItems :any[]=[];
  constructor(private accountService: AccountService,private alertService: AlertService, public dialogRef: MatDialogRef<ReceiveItemComponent>, @Inject(MAT_DIALOG_DATA) public data: { row },
  private formBuilder: FormBuilder) {
    
  }

  ngOnInit() {
    this.purchaseData = this.data.row;
    this.getItemsByPurchase(this.purchaseData.id)
    this.itemFrom = this.formBuilder.group({
      credentials: this.formBuilder.array([]),
    });
  }

  addItem(i) {
    (this.itemFrom.controls['credentials'] as FormArray).push(this.createItem(i));
  }

  createItem(item) {
    return this.formBuilder.group({
      itemName: new FormControl(''),
      qty: new FormControl(''),
      unitPrice: new FormControl(''),
      remainQty: new FormControl(''),
      receiveQty: new FormControl(''),
      receivePrice: new FormControl(''),
      itemId:new FormControl(''),
      isReadOnly:'',
    })
  }

  getItemsByPurchase(Id) {
    this.sumTotal = 0;
    this.accountService.getItemsByPurchaseId(Id)
      .subscribe((results: any) => {
        this.itemList = results.listResult == null ? [] : results.listResult;
        for(let i = 0; i < this.itemList.length; i++) {
          this.sumTotal += this.itemList[i].receivedCost;
          if(this.itemList[i].quantity == this.itemList[i].receivedQuantity){
            this.itemList[i].isReadOnly = true;
          }else{
            this.itemList[i].isReadOnly = false;
          }
        }
       this.setItems(this.itemList)
      },
        error => {
        });
  }

  setItems(itemsArray: any[]) {
   
    let control = this.formBuilder.array([]);
    itemsArray.forEach(x => {
      control.push(this.formBuilder.group({
        itemName: x.itemName,
        itemId:x.itemId,
        qty: x.quantity,
        unitPrice:x.expectedCost,
        remainQty :x.remainingQuantity,
        receiveQty:0,
        receivePrice:0,
        isReadOnly:x.isReadOnly
      }))
    })
    this.itemFrom.setControl('credentials', control);
  }

  cancel() {
    this.dialogRef.close();
  }

   // only Accept numbers only
   numberOnly(event: any) {
    const numberpattern = /[0-9\+\-.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!numberpattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  save() {
    debugger
    this. inventoryItems = [];
    for (var i = 0; i < this.itemFrom.value.credentials.length; i++) {
      var itemReq = {
        "id": 0,
        "purchaseOrderId": this.purchaseData.id,
        "itemId":this.itemFrom.value.credentials[i].itemId,
        "quantity": parseInt(this.itemFrom.value.credentials[i].receiveQty),
        "receivedCost": parseFloat(this.itemFrom.value.credentials[i].receivePrice),
      }
      this.inventoryItems.push(itemReq);
    }
    this.accountService.UpdateInventory(this.inventoryItems)
      .subscribe((results:any) => {
        this.alertService.stopLoadingMessage();
        if (results.isSuccess) {
          this.isViewRecipt = true;
          for(let i = 0; i < this.itemList.length; i++) {
            this.itemList[i].receivedQuantity += parseInt(this.itemFrom.value.credentials[i].receiveQty)
            this.itemList[i].receivedCost += parseFloat(this.itemFrom.value.credentials[i].receivePrice)
            this.sumTotal += this.itemList[i].receivedCost;
          }
         this.alertService.showMessage('Success', results.endUserMessage, MessageSeverity.success);
        }
        else {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage(results.endUserMessage, null, MessageSeverity.error);
        }
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('An Error Occured', null, MessageSeverity.error);
        });
  }

  onPrintClick(el) {
    // this.spinner.show();
    document.getElementById("print-container")
    const printThisDefaults = {
      debug: false, // show the iframe for debugging
      importCSS: true, // import parent page css
      importStyle: true, // import style tags
      printContainer: true, // print outer container/$.selector
      loadCSS: [],// load an additional css file - load multiple stylesheets with an array []
      pageTitle: '', // add title to print page
      removeInline: false, // remove all inline styles
      printDelay: 500, // variable print delay
      header: null, // prefix to html
      footer: null, // postfix to html
      formValues: true, // preserve input/form values
      canvas: false, // copy canvas content (experimental)
      base: false, // preserve the BASE tag, or accept a string for the URL
      doctypeString: '<!DOCTYPE html>', // html doctype
      removeScripts: false, // remove script tags before appending
      copyTagClasses: false // copy classes from the html & body tag
    }
    PrintThis('#print-container', printThisDefaults)
  }


}
