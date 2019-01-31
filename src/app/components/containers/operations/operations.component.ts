import {Component, Input, OnInit} from '@angular/core';
import {OperationsService} from "../../../services/bussiness-logic/operations.service";
import {InvioceOpEnum , PaymentOpEnum, FinancialOpEnum, TotalsOpEnum} from "../../../utils/operations";

@Component({
  selector: 'operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit {

  @Input() financeOperations = [FinancialOpEnum.MANAGER, FinancialOpEnum.REPRINT, FinancialOpEnum.HOLD, FinancialOpEnum.REVIEW,
    FinancialOpEnum.RECALL, FinancialOpEnum.REFUND, FinancialOpEnum.LOGOUT];
  @Input() financeColor = 'green';
  @Input() financeDisabled: boolean | boolean []= this.operationService.cashService.disabledFinOp;

  @Input() invoiceOperations = [InvioceOpEnum.CLEAR, InvioceOpEnum.PLU, InvioceOpEnum.PRICE, InvioceOpEnum.VOID];
  @Input() invoiceColor = ['red', 'green', 'green', 'red'];
  @Input() invoiceDisabled : boolean | boolean []= this.operationService.cashService.disabledInvOp;

  @Input() totalsOperations = [TotalsOpEnum.FS_SUBTOTAL, TotalsOpEnum.SUBTOTAL];
  @Input() totalColor = ['yellow', 'red'];
  @Input() totalDisabled: boolean | boolean []= this.operationService.cashService.disabledTotalOp;

  @Input() numpadOption = '@/FOR';

  @Input() paymentOperations = [PaymentOpEnum.FOOD_STAMP, PaymentOpEnum.DEBIT_CARD, PaymentOpEnum.EBT_CARD,
    PaymentOpEnum.CREDIT_CARD, PaymentOpEnum.CASH];
  @Input() paymentColor = ['yellow', 'blue', 'yellow', 'blue', 'green'];
  @Input() paymentDisabled: boolean | boolean[] = this.operationService.cashService.disabledPayment;

  constructor(public operationService: OperationsService) {  }

  ngOnInit() {
  }

  financeKey(ev) {
    switch (ev) {
      case FinancialOpEnum.LOGOUT:
        this.operationService.logout();
        break;
      case FinancialOpEnum.MANAGER:
        this.operationService.manager();
        break;
      case FinancialOpEnum.HOLD:
        this.operationService.hold();
        break;
      case FinancialOpEnum.RECALL:
        this.operationService.recallCheck();
        break;
      case FinancialOpEnum.REVIEW:
        this.operationService.reviewCheck();
        break;
      case FinancialOpEnum.REPRINT:
        this.operationService.reprint();
        break;
      case FinancialOpEnum.REFUND:
        this.operationService.refund();
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

  totalKey(ev) {
    switch (ev) {
      case 'Subtotal':
        this.operationService.subTotal();
        break;
      case 'F/S Subtotal':
        this.operationService.fsSubTotal();
        break;
    }
  }

  paymentKey(ev) {
    switch (ev) {
      case PaymentOpEnum.CASH:
        this.operationService.cash();
        break;
      case PaymentOpEnum.EBT_CARD:
        this.operationService.ebt();
        break;
      case PaymentOpEnum.DEBIT_CARD:
        this.operationService.debit();
        break;
    }
  }


}
