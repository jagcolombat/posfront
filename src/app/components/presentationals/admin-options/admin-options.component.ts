import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AdminOptionsService} from "../../../services/bussiness-logic/admin-options.service";
import {AdminOpEnum} from "../../../utils/operations/admin-op.enum";
import {UserrolEnum} from "../../../utils/userrol.enum";
import {CompanyType} from "../../../utils/company-type.enum";
import {PAXConnTypeEnum} from "../../../utils/pax-conn-type.enum";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-admin-options',
  templateUrl: './admin-options.component.html',
  styleUrls: ['./admin-options.component.scss']
})
export class AdminOptionsComponent implements OnInit {
  @Input() options = [
    AdminOpEnum.APPLY_DISCOUNT, AdminOpEnum.CANCEL_CHECK, AdminOpEnum.REMOVE_HOLD, AdminOpEnum.SET_USER,
    AdminOpEnum.REFUND_SALE, AdminOpEnum.AUTH_PENDING, AdminOpEnum.CLOSE_BATCH, /*AdminOpEnum.EBT_INQUIRY,*/
    AdminOpEnum.UPDATE, AdminOpEnum.CLIENT, AdminOpEnum.GIFT_CARD, AdminOpEnum.CONFIG, AdminOpEnum.SYSTEM_VERSION,
    AdminOpEnum.EMPLOYEE_SETUP, AdminOpEnum.CHANGE_PRICES, AdminOpEnum.CHANGE_COLOR, AdminOpEnum.CREDIT_LIMIT, AdminOpEnum.TIME_WORKED];
  $options: Observable<AdminOpEnum[]>;
  page = 1;
  sizePage = 16;
  @Input() disable: boolean | boolean[] = this.adminOpService.cashService.disabledAdminOp;
  @Input() adminOpColor = ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'violet', 'violet',
    'violet', 'violet', 'violet'];

  constructor(private router: Router, public adminOpService: AdminOptionsService ) {

    // this.adminOpService.cashService.getSystemConfig().subscribe(config => {
    const config = this.adminOpService.cashService.config.sysConfig;
    if (config.paxConnType !== PAXConnTypeEnum.ONLINE) {
      // Remove PAX options and colors
      console.log('paxConnType', PAXConnTypeEnum.ONLINE);
      this.removeOption(this.options.indexOf(AdminOpEnum.CLOSE_BATCH));
    }
    /*if(config.companyType === CompanyType.RESTAURANT || !config.allowEBT){
      // Remove EBT options and colors
      console.log('allowEBT');
      this.removeOption(this.options.indexOf(AdminOpEnum.EBT_INQUIRY));
    }*/
    if(config.companyType !== CompanyType.RESTAURANT){
      // Remove Restaurant options and colors
      console.log('companyType', config.companyType);
      this.removeOption(this.options.indexOf(AdminOpEnum.AUTH_PENDING));
    }
    if(!config.allowGiftCard){
      // Remove EBT options and colors
      console.log('allowGiftCard', config.allowGiftCard);
      this.removeOption(this.options.indexOf(AdminOpEnum.GIFT_CARD));
    }
    if(this.adminOpService.isRefundSale()){
      // Change Refund Sale operation by Revert Sale
      this.replaceOption(AdminOpEnum.REFUND_SALE, AdminOpEnum.REVERT_SALE);          
    }
    this.updateOptions();
    /*}, err => {
      this.adminOpService.cashService.openGenericInfo('Error', 'Can\'t get configuration');
    });*/
  }

  ngOnInit() {
  }

  removeOption(ind: number){
    this.options.splice(ind, 1);
    this.adminOpColor.splice(ind, 1);
  }

  doAction(opt: AdminOpEnum) {
    console.log('doAction', opt);
    if(!this.adminOpService.cashService.opDenyByUser(opt, UserrolEnum.SUPERVISOR)) {
      switch (opt) {
        case AdminOpEnum.DEPARMENTS.toUpperCase():
          this.router.navigateByUrl('/cash/dptos', { replaceUrl: true });
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
          // this.adminOpService.employSetup();
          this.adminOpService.employeeAction();
          break;
        case AdminOpEnum.CHANGE_PRICES.toUpperCase():
          this.adminOpService.changePrice();
          break;
        case AdminOpEnum.CHANGE_COLOR.toUpperCase():
          this.adminOpService.selectChangeColorPoD();
          break;
        /*case AdminOpEnum.EBT_INQUIRY.toUpperCase():
          this.adminOpService.ebtInquiry();
          break;*/
        case AdminOpEnum.CHARGE_ACCT_SETUP.toUpperCase():
          this.adminOpService.chargeAccountSetup();
          break;
        case AdminOpEnum.CREDIT_LIMIT.toUpperCase():
          this.adminOpService.updateCreditLimit();
          break;
        case AdminOpEnum.REFUND_SALE.toUpperCase():
          this.replaceOption(AdminOpEnum.REFUND_SALE, AdminOpEnum.REVERT_SALE);
          this.updateOptions();
          this.adminOpService.refundSale();
          break;
        case AdminOpEnum.REVERT_SALE.toUpperCase():
          this.replaceOption(AdminOpEnum.REFUND_SALE, AdminOpEnum.REVERT_SALE);
          this.updateOptions();
          this.adminOpService.refundSale();
          break;
        case AdminOpEnum.CLIENT.toUpperCase():
          this.adminOpService.clientSetup();
          break;
        case AdminOpEnum.GIFT_CARD.toUpperCase():
          this.adminOpService.giftCard();
          break;
        case AdminOpEnum.UPDATE.toUpperCase():
          this.adminOpService.update();
          break;
        case AdminOpEnum.TIME_WORKED.toUpperCase():
          this.adminOpService.timeWorked();
          break;
      }
    }
    this.adminOpService.operationService.resetInactivity(true, 'Admin options action');
  }

  setDisabled(index) {
    return typeof this.disable === 'boolean' ? this.disable : this.disable[this.options.indexOf(index)]
  }

  replaceOption(from: AdminOpEnum, to: AdminOpEnum) {
    this.options.splice(this.options.findIndex(op => op === from), 1, to);
  }

  updateOptions() {
    this.$options = of(this.options.map(o=> <AdminOpEnum> o.toUpperCase()));
  }
}
