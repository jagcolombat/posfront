import {Component, Input, OnInit} from '@angular/core';
import {OperationsService} from "../../../services/bussiness-logic/operations.service";

@Component({
  selector: 'operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit {
  @Input() financeOperations = ['Manager Screen', 'Reprint', 'Hold Order', 'Review Check', 'Recall Check', 'Refund', 'Logout'];
  @Input() financeColor = 'green';
  @Input() invoiceOperations = ['Clear', 'PLU', 'Price Check', 'Void'];
  @Input() invoiceColor = ['red', 'green', 'green', 'red'];
  @Input() totalsOperations = ['F/S Subtotal', 'Subtotal'];
  @Input() totalColor = ['yellow', 'red'];
  @Input() numpadOption = '@/FOR';
  @Input() cashOperations = ['Cash'];
  @Input() paymentOperations = ['Food Stamp', 'Debit Card', 'EBT Card', 'Credit Card', 'Cash'];
  @Input() paymentColor = ['yellow', 'blue', 'yellow', 'blue', 'green'];

  constructor(private operationService: OperationsService) { }

  ngOnInit() {
  }

  financeKey(ev) {
    switch (ev) {
      case 'Logout':
        this.operationService.logout();
        break;
      case 'Manager Screen':
        this.operationService.manager();
        break;
      case 'Hold Order':
        this.operationService.hold();
        break;
      case 'Recall Check':
        this.operationService.recallCheck();
        break;
    }
  }

  invoiceKey(ev) {
    switch (ev) {
      case 'Clear':
        this.operationService.clear();
        break;
      case 'Void':
        this.operationService.void();
        break;
      case 'PLU':
        this.operationService.plu();
        break;
      case 'Price Check':
        this.operationService.priceCheck();
        break;
    }
  }

  numpadKey(ev) {
    this.operationService.numpadInput(ev);
  }

  totalKey(ev) {}

  paymentKey(ev) {}


}
