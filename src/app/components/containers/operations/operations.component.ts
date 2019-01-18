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
  // @Input() disableOp = true;

  constructor(public operationService: OperationsService) { }

  ngOnInit() {
    // this.disableOp = this.operationService.disableOp;
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
      case 'Review Check':
        this.operationService.reviewCheck();
        this.operationService.cashService.evReviewCheck.subscribe(resp => {
          if(resp) {
            this.financeOperations.push('Go Back');
            this.operationService.cashService.evReviewCheck.complete();
          }
        });
        break;
      case 'Reprint':
        this.operationService.reprint();
        break;
      case 'Go Back':
        this.operationService.goBack();
        this.operationService.cashService.evGoBack.subscribe(resp => {
          if(resp) {
            this.operationService.disableOp = false;
            this.financeOperations.splice(this.financeOperations.indexOf('Go Back'), 1);
            this.operationService.cashService.evGoBack.complete();
          }
        });
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

  paymentKey(ev) {
    switch (ev) {
      case 'Cash':
        this.operationService.cash();
        break;
    }
  }


}
