import {Component, Input, OnInit} from '@angular/core';
import {OperationsService} from "../../../services/bussiness-logic/operations.service";
import {FinancialOpEnum, InvioceOpEnum, PaymentOpEnum, TotalsOpEnum} from "../../../utils/operations";
import {OtherOpEnum} from "../../../utils/operations/other.enum";
import {CompanyType} from "../../../utils/company-type.enum";
import {AuthService} from "../../../services/api/auth.service";
import {AdminOpEnum} from "../../../utils/operations/admin-op.enum";
import {AdminOptionsService} from "../../../services/bussiness-logic/admin-options.service";
import {NavigationEnd, Router} from "@angular/router";
import {CustomerOpEnum} from "../../../utils/operations/customer.enum";

@Component({
  selector: 'operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit {

  @Input() financeOperations = [FinancialOpEnum.MANAGER, FinancialOpEnum.LOGOUT];
  @Input() financeColor = 'green';
  @Input() financeDisabled: boolean | boolean []= this.operationService.cashService.disabledFinOp;

  @Input() invoiceOperations = [InvioceOpEnum.CLEAR, InvioceOpEnum.PLU, InvioceOpEnum.PRICE, InvioceOpEnum.VOID];
  @Input() invoiceColor = ['red', 'green', 'green', 'red'];
  @Input() invoiceDisabled : boolean | boolean []= this.operationService.cashService.disabledInvOp;

  @Input() totalsOperations = [TotalsOpEnum.FS_SUBTOTAL, TotalsOpEnum.SUBTOTAL];
  @Input() totalColor = ['yellow', 'red'];
  @Input() totalDisabled: boolean | boolean []= this.operationService.cashService.disabledTotalOp;

  @Input() numpadOption = '@/FOR';

  @Input() paymentOperations = [PaymentOpEnum.EBT_CARD, PaymentOpEnum.DEBIT_CARD, PaymentOpEnum.CREDIT_CARD,
    PaymentOpEnum.CASH, PaymentOpEnum.CHECK, PaymentOpEnum.OTHER];
  @Input() paymentColor = ['yellow', 'yellow', 'yellow', 'green', 'blue', 'blue'];
  @Input() paymentDisabled: boolean | boolean[] = this.operationService.cashService.disabledPayment;

  @Input() otherOperations = [OtherOpEnum.PRINT_LAST, OtherOpEnum.NO_SALE, OtherOpEnum.WEIGHT_ITEM];
  @Input() otherColor = ['yellow', 'blue', 'blue', 'green','blue','blue'];

  @Input() moneyOperations = ['1', '5', '10', '20', '50', '100'];
  @Input() moneyColor = ['one', 'five', 'ten', 'twenty', 'fifty', 'hundrey'];

  @Input() reportOperations = [AdminOpEnum.EMPLZ, AdminOpEnum.SYSZ, AdminOpEnum.WTDZ];
  @Input() reportColor = 'yellow';

  @Input() backOperations = [AdminOpEnum.PREV_SCREEN];
  @Input() backColor = 'yellow';

  @Input() financeAdminOperations = [FinancialOpEnum.REPRINT, FinancialOpEnum.HOLD, FinancialOpEnum.REVIEW,
    FinancialOpEnum.RECALL, FinancialOpEnum.REFUND, FinancialOpEnum.LOGOUT];
  @Input() financeAdminColor = 'green';

  @Input() invoiceAdminOperations = [InvioceOpEnum.VOID, InvioceOpEnum.CLEAR];
  @Input() invoiceAdminColor = 'red';

  @Input() otherAdminOperations = [OtherOpEnum.PRINT_LAST, OtherOpEnum.NO_SALE, OtherOpEnum.PAID_OUT];
  @Input() otherAdminColor = ['blue', 'blue', 'blue'];

  @Input() customerOperations = [/*CustomerOpEnum.CUSTOMER, */CustomerOpEnum.ACCT_BALANCE, CustomerOpEnum.ACCT_PAYMENT,
    CustomerOpEnum.ACCT_CHARGE];
  @Input() customerColor = 'orange';

  @Input() restaurantOperations = [FinancialOpEnum.TXTYPE, OtherOpEnum.ORDER_INFO, OtherOpEnum.TABLES];
  @Input() restaurantColor = 'green';

  isRouteAdmin = (route: string) => (route.startsWith('/cash/options') ? true : false);
  routeAdmin: boolean;
  showForAdmin = false;

  constructor(public operationService: OperationsService, public authService: AuthService,
              private adminOpService: AdminOptionsService, private router: Router) {
    this.router.events.subscribe(ev => {
      if(ev instanceof NavigationEnd) {
        console.log('evRoute', this.router.url);
        this.routeAdmin = this.isRouteAdmin(this.router.url);
        this.showForAdmin = (this.routeAdmin && this.authService.adminLogged() ? true : false)
        console.log('for admin', this.routeAdmin, this.authService.adminLogged(), this.showForAdmin);
      }
    });
  }

  ngOnInit() {
    // this.operationService.cashService.systemConfig.companyType = CompanyType.RESTAURANT;
    this.operationService.cashService.getSystemConfig().subscribe(config => {
      if(this.operationService.cashService.systemConfig.allowCardSplit){
        this.otherOperations.unshift(OtherOpEnum.SPLIT_CARD);
        this.otherColor.unshift('yellow');
      }
      if(this.operationService.cashService.systemConfig.companyType === CompanyType.RESTAURANT ||
        !this.operationService.cashService.systemConfig.allowEBT){
        // Remove EBT options and colors
        this.paymentOperations.splice(0,1);
        this.paymentColor.splice(0,1);
        // Remove EBT total and color
        this.totalsOperations.splice(0,1);
        this.totalColor.splice(0,1);
        // Push in money operations other payment option
        this.paymentOperations.splice(-1).map(op => this.moneyOperations.push(op));
        this.paymentColor.splice(-1).map(op => this.moneyColor.push(op));
      } else {
        // Remove TXType operation
        //this.financeOperations.splice(1, 1);
        // Remove Table operation and relative color
        //this.otherOperations.splice(-1);
        //this.otherColor.splice(-1);
        // Push in money operations check and other payment options
        this.paymentOperations.splice(-2).map(op => this.moneyOperations.push(op));
        this.paymentColor.splice(-2).map(op => this.moneyColor.push(op));
        //this.operationService.cashService.disabledPayment=[true, false, true, true, true, true];
      }
      if(this.operationService.cashService.systemConfig.companyType !== CompanyType.RESTAURANT){
        // Remove restaurant operations
        this.restaurantOperations.splice(0);
        this.restaurantColor = '';
      }
    }, err => {
      this.operationService.cashService.openGenericInfo('Error', 'Can\'t get configuration');
    });
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
      case FinancialOpEnum.TXTYPE:
        this.operationService.txType();
        break;
      case OtherOpEnum.ORDER_INFO:
        this.operationService.getOrderInfo();
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
        this.operationService.cash(PaymentOpEnum.CASH);
        break;
      case PaymentOpEnum.OTHER:
        this.operationService.cash(PaymentOpEnum.OTHER);
        break;
      case PaymentOpEnum.EBT_CARD:
        this.operationService.setEBTCardType();
        break;
      case PaymentOpEnum.DEBIT_CARD:
        this.operationService.externalCardPayment();
        break;
      case PaymentOpEnum.CREDIT_CARD:
        this.operationService.externalCardPayment();
        break;
      case PaymentOpEnum.CHECK:
        this.operationService.check();
        break;
    }
  }

  otherKey(ev) {
    switch (ev) {
      case 'Print Last Receipt':
        this.operationService.printLast();
        break;
      case 'No Sale':
        this.operationService.notSale();
        break;
      case 'Paid Out':
        this.operationService.paidOut();
        break;
      case 'House Charge':
        this.operationService.cashService.openGenericInfo('House Charge', 'Sending event');
        break;
      case 'Tables':
        this.operationService.openDialogTables();
        break;
      case OtherOpEnum.ORDER_INFO:
        /*this.operationService.cashService.openGenericInfo(OtherOpEnum.ORDER_INFO, this.operationService.getOrderInfo());*/
        this.operationService.getOrderInfo();
        break;
      case OtherOpEnum.WEIGHT_ITEM:
        this.operationService.weightItem();
        break;
      case OtherOpEnum.SPLIT_CARD:
        this.operationService.splitCard();
        break;
    }
  }

  moneyKey(ev) {
    switch (ev) {
      case PaymentOpEnum.CASH:
        this.operationService.cash(PaymentOpEnum.CASH);
        break;
      case PaymentOpEnum.CHECK:
        this.operationService.check();
        break;
      case PaymentOpEnum.OTHER:
        this.operationService.cash(PaymentOpEnum.OTHER);
        break;
      default:
        this.operationService.cashMoney(+ev);
        break;
    }
  }

  reportKey(ev) {
    switch (ev) {
      case AdminOpEnum.EMPLZ:
        this.adminOpService.emplZ();
        break;
      case AdminOpEnum.SYSZ:
        this.adminOpService.sysZ();
        break;
      case AdminOpEnum.WTDZ:
        this.adminOpService.dayCloseType();
        break;
    }
  }

  backKey(ev) {
    switch (ev) {
      case AdminOpEnum.PREV_SCREEN:
        this.adminOpService.backToUser();
        break;
    }
  }

  customerKey(ev) {
    console.log('customerKey', ev);
    switch (ev) {
      case CustomerOpEnum.CUSTOMER:
        //this.adminOpService.emplZ();
        break;
      case CustomerOpEnum.ACCT_BALANCE:
        this.operationService.acctBalance();
        break;
      case CustomerOpEnum.ACCT_PAYMENT:
        this.operationService.acctPayment();
        break;
      case CustomerOpEnum.ACCT_CHARGE:
        this.operationService.acctCharge();
        break;
    }
  }

  restaurantKey(ev) {
    console.log('customerKey', ev);
    switch (ev) {
      case 'Tables':
        this.operationService.openDialogTables();
        break;
      case OtherOpEnum.ORDER_INFO:
        this.operationService.getOrderInfo();
        break;
      case FinancialOpEnum.TXTYPE:
        this.operationService.txType();
    }
  }
}
