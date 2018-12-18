import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {
  @Input() financeOperations = ['Manager Screen', 'Reprint', 'Hold Order', 'Review Check', 'Recall Check', 'Refund', 'Logout'];
  @Input() financeColor = 'green';
  @Input() invoiceOperations = ['Clear', 'PLU', 'Print Check', 'Void'];
  @Input() invoiceColor = ['red', 'green', 'green', 'red'];
  @Input() totalsOperations = ['F/S Subtotal', 'Subtotal'];
  @Input() totalColor = ['yellow', 'red'];
  @Input() numpadOption = '@/FOR';
  @Input() cashOperations = ['Cash'];
  @Input() paymentOperations = ['Food Stamp', 'Debit Card', 'EBT Card', 'Credit Card', 'Cash'];
  @Input() paymentColor = ['yellow', 'blue', 'yellow', 'blue', 'green'];

  constructor() { }

  ngOnInit() {
  }

  financeKey(ev) {}

  invoiceKey(ev) {}

  totalKey(ev) {}

  paymentKey(ev) {}


}
