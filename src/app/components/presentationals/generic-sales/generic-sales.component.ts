import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {PaymentMethodEnum} from "../../../utils/operations/payment-method.enum";
import {Payment} from "../../../models";
import {DataStorageService} from "../../../services/api/data-storage.service";
import {CashService} from "../../../services/bussiness-logic/cash.service";

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
               private cashService: CashService) {
    console.log(data);
    if(this.data.content) this.populateSales(this.data.content);
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  populateSales(data){
    this.sales = data.map(payment => {
      return {'type': PaymentMethodEnum[payment.type], 'total': payment.total}
    });
  }

  getSales(ev){
    console.log('getSales', ev);
    this.dataStorage.getInvoiceByUser(ev).subscribe(next => {
      console.log(next);
      this.salesByUser = next;
    }, error1 => {
      console.error('getSales', error1);
      this.cashService.openGenericInfo('Error', 'Can´t get sales by this user');
    });
  }

}
