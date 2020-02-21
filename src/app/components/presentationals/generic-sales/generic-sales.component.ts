import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {PaymentMethodEnum} from "../../../utils/operations/payment-method.enum";
import {Payment} from "../../../models";
import {DataStorageService} from "../../../services/api/data-storage.service";
import {CashService} from "../../../services/bussiness-logic/cash.service";
import {InvoiceService} from "../../../services/bussiness-logic/invoice.service";
import {OperationsService} from "../../../services/bussiness-logic/operations.service";

@Component({
  selector: 'app-generic-sales',
  templateUrl: './generic-sales.component.html',
  styleUrls: ['./generic-sales.component.scss']
})
export class GenericSalesComponent implements OnInit {

  sales: Payment;
  salesByUser: any;

  constructor( public dialogRef: MatDialogRef<GenericSalesComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any, private dataStorage: DataStorageService,
               private cashService: CashService, private invoiceService: InvoiceService, private operationService: OperationsService) {
    console.log('GenericSalesComponent', data);
    if(this.data.content) this.populateSales(this.data.content);
    if(this.data.empl) this.getSales(this.data.empl.id);
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  populateSales(data){
    this.sales = data.map(payment => {
      return {'name': payment.name, 'total': payment.total}
    });
  }

  getSales(ev){
    console.log('getSales', ev);
    if(ev){
      this.dataStorage.getInvoiceByUser(ev).subscribe(next => {
        console.log(next);
        this.salesByUser = next;
      }, error1 => {
        console.error('getSales', error1);
        this.cashService.openGenericInfo('Error', 'Can´t get sales by this user');
      });
    }
  }

  reviewCheck(receiptNumber: string){
    this.invoiceService.digits = receiptNumber;
    this.operationService.reviewCheck();
    this.dialogRef.close();
  }

}
