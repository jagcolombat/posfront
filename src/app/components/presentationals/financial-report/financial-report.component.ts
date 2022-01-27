import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ICashSales, IFunctions, ISales, Sales } from 'src/app/models/financials';

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
      console.log('financial report', this.data);
      if (data.title) { this.title = this.data.title; }
      if (this.data.data) { 
        const data = this.data.data;
        this.sales = new Sales(data.salesTax, data.saleWithTax, data.grossSale, 
          data.deduction, data.deductionTax, data.accountChargeTotal, 
          data.accountPaymentTotal, data.netSale); 
      }
  }

  ngOnInit() {
  }

}
