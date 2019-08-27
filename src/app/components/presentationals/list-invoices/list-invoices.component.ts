import {Component, Input, OnInit} from '@angular/core';
import {Invoice} from "../../../models/invoice.model";

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

  constructor() { }

  ngOnInit() {
  }

}
