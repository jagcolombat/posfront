import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AdminOptionsService} from "../../../services/bussiness-logic/admin-options.service";
import {AdminOpEnum} from "../../../utils/operations/admin-op.enum";
import {UserrolEnum} from "../../../utils/userrol.enum";
import {User} from "../../../models";
import {InformationType} from "../../../utils/information-type.enum";

@Component({
  selector: 'app-admin-options',
  templateUrl: './admin-options.component.html',
  styleUrls: ['./admin-options.component.scss']
})
export class AdminOptionsComponent implements OnInit {
  options = [AdminOpEnum.CHANGE_PRINTER, AdminOpEnum.CLOSE_BROWSER,
    AdminOpEnum.APPLY_DISCOUNT, AdminOpEnum.CANCEL_CHECK, AdminOpEnum.REMOVE_HOLD/*, AdminOpEnum.AUTH_PENDING*/,
    AdminOpEnum.DEPARMENTS, AdminOpEnum.BACK_USER, AdminOpEnum.SET_USER/*, AdminOpEnum.CLOSE_BATCH*/, AdminOpEnum.REFUND_SALE,
    AdminOpEnum.CONFIG, AdminOpEnum.SYSTEM_VERSION/*, AdminOpEnum.EBT_INQUIRY*/, AdminOpEnum.CHARGE_ACCT_SETUP,
    AdminOpEnum.EMPLOYEE_SETUP, AdminOpEnum.CHANGE_PRICES, AdminOpEnum.CREDIT_LIMIT];
  page = 1;
  sizePage = 16;
  @Input() disable: boolean | boolean[] = this.adminOpService.cashService.disabledAdminOp;
  adminOpColor = ['red','red','red','red','red','red','red','red','red','red','red'/*,'red','red'*/,'violet','violet',
    'violet', 'violet'];
  noLet4Supervisor =  [AdminOpEnum.APPLY_DISCOUNT, AdminOpEnum.REMOVE_HOLD, AdminOpEnum.CHARGE_ACCT_SETUP,
  AdminOpEnum.EMPLOYEE_SETUP, AdminOpEnum.CHANGE_PRICES].map(a => a.toUpperCase());

  constructor(private router: Router, public adminOpService: AdminOptionsService ) {
  }

  ngOnInit() {
  }

  doAction(opt: AdminOpEnum) {
    console.log('doAction', opt);
    if(this.adminOpService.auth.token.rol === UserrolEnum.SUPERVISOR && this.noLet4Supervisor.includes(opt)){
      this.adminOpService.cashService.openGenericInfo(InformationType.INFO, UserrolEnum.SUPERVISOR +
        ' hasn\'t access to ' + opt + ' operation.')
    } else {
      switch (opt) {
        case AdminOpEnum.DEPARMENTS.toUpperCase():
          this.router.navigateByUrl('/cash/dptos');
          break;
        case AdminOpEnum.APPLY_DISCOUNT.toUpperCase():
          this.adminOpService.setApplyDiscountType();
          break;
        case AdminOpEnum.EMPLZ.toUpperCase():
          this.adminOpService.emplZ();
          break;
        case AdminOpEnum.SYSZ.toUpperCase():
          this.adminOpService.sysZ();
          break;
        case AdminOpEnum.CANCEL_CHECK.toUpperCase():
          this.adminOpService.cancelCheck();
          break;
        case AdminOpEnum.REMOVE_HOLD.toUpperCase():
          this.adminOpService.removeAHold();
          break;
        case AdminOpEnum.AUTH_PENDING.toUpperCase():
          this.adminOpService.authPending();
          break;
        case AdminOpEnum.BACK_USER.toUpperCase():
          this.adminOpService.backToUser();
          break;
        case AdminOpEnum.SET_USER.toUpperCase():
          this.adminOpService.setUserToOrder();
          break;
        case AdminOpEnum.CONFIG.toUpperCase():
          this.adminOpService.configOption();
          // this.router.navigateByUrl('/cash/dptos');
          break;
        case AdminOpEnum.SYSTEM_VERSION.toUpperCase():
          this.adminOpService.systemVersion();
          break;
        case AdminOpEnum.CLOSE_BATCH.toUpperCase():
          this.adminOpService.closeBatch();
          break;
        case AdminOpEnum.WTDZ.toUpperCase():
          this.adminOpService.dayCloseType();
          break;
        case AdminOpEnum.EMPLOYEE_SETUP.toUpperCase():
          this.adminOpService.employSetup();
          break;
        case AdminOpEnum.CHANGE_PRICES.toUpperCase():
          this.adminOpService.changePrice();
          break;
        case AdminOpEnum.EBT_INQUIRY.toUpperCase():
          this.adminOpService.ebtInquiry();
          break;
        case AdminOpEnum.CHARGE_ACCT_SETUP.toUpperCase():
          this.adminOpService.chargeAccountSetup();
          break;
        case AdminOpEnum.CREDIT_LIMIT.toUpperCase():
          this.adminOpService.updateCreditLimit();
          break;
        case AdminOpEnum.REFUND_SALE.toUpperCase():
          this.adminOpService.refundSale();
          break;
      }
    }

  }

  setDisabled(index) {
    return typeof this.disable === 'boolean' ? this.disable : this.disable[this.options.indexOf(index)]
  }
}
