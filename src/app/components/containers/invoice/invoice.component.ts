import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/api/auth.service";
import {InvoiceService} from "../../../services/bussiness-logic/invoice.service";

@Component({
  selector: 'invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  // @ViewChild('productstable') productstable: PosProductsTableComponent;
  cashier: string;
  account: string;
  /* products: ProductOrder;
  @Input() product: any;*/
  subtotal = 0;
  tax = 0;
  total = 0;
  showDigits: boolean;
  /*digits = '';
  qty: number;
  numbers = 0;
  invoice: Invoice;*/

  constructor(private invoiceService: InvoiceService) {
  }

  ngOnInit() {
    this.cashier = this.invoiceService.getCashier();
  }

}
