import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CashSales, Functions, ICashSales, IFunctions, ISales, Sales } from 'src/app/models/financials';

@Component({
  selector: 'app-financial-report',
  templateUrl: './financial-report.component.html',
  styleUrls: ['./financial-report.component.scss']
})
export class FinancialReportComponent implements OnInit {
  title: string;
  subtitle: string;
  @Input() sales: ISales;
  @Input() cash: ICashSales;
  @Input() functions: IFunctions;

  constructor(public dialogRef: MatDialogRef<FinancialReportComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log('financial report', data);
      if (data.title) { this.title = data.title; }
      if (data.subtitle) { this.subtitle = data.subtitle; }
      if (data.data) { 
        const data = this.data.data;
        this.sales = new Sales(data.salesTax, data.saleWithTax, data.grossSale, 
          data.deduction, data.deductionTax, data.accountChargeTotal, 
          data.accountPaymentTotal, data.netSale);
          
        this.cash = new CashSales(data.cashSale, data.cashAccountPayment, data.paidOut,
          data.cashDue, data.ticketsCount, data.avgTickets);

        this.functions = new Functions(data.refunds, data.openChecks, data.voidTickets,
          data.paidOut, data.discounts);   
      }
  }

  ngOnInit() {
  }

}
