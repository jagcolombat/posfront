import {Component, Input, OnInit} from '@angular/core';
import {Invoice} from "../../../models/invoice.model";
import {ETXType} from "../../../utils/delivery.enum";

@Component({
  selector: 'list-invoices',
  templateUrl: './list-invoices.component.html',
  styleUrls: ['./list-invoices.component.scss']
})
export class ListInvoicesComponent implements OnInit {
  @Input() data: any;
  @Input() sizePage: number;
  @Input() page: number;
  @Input() label: string = 'receiptNumber';
  @Input() detail: string;
  @Input() subdetail: string;
  @Input() breakText: string;
  currencyProps = ['total', 'unitCost', 'balance', 'creditLimit', 'giftAmount'];

  constructor() { }

  ngOnInit() {
  }

  setColor(type) {
    switch (type) {
      case ETXType.DELIVERY:
        return 'green';
      case ETXType.PICKUP:
        return 'yellow';
      default:
        return 'red';
    }
  }

}
