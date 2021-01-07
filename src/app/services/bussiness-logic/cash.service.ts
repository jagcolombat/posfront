import {EventEmitter, Injectable, Output} from '@angular/core';
import {GenericInfoModalComponent} from '../../components/presentationals/generic-info-modal/generic-info-modal.component';
import {MatDialog} from '@angular/material';
import {Configuration} from '../../models/configuration.model';
import {AuthService} from '../api/auth.service';
import {DataStorageService} from '../api/data-storage.service';
import {CompanyType} from '../../utils/company-type.enum';
import {BreakTextEnum} from '../../utils/breaktext.enum';
import {AdminOpEnum} from '../../utils/operations/admin-op.enum';
import {UserrolEnum} from '../../utils/userrol.enum';
import {InformationType} from '../../utils/information-type.enum';
import {FinancialOpEnum} from '../../utils/operations';
import {PAXConnTypeEnum} from '../../utils/pax-conn-type.enum';
import {ConfigurationService} from './configuration.service';
import {Station} from '../../models/station.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CashService {
  disabledInput: boolean;
  disabledInputKey: boolean;
  disableStock: boolean;
  disabledFinOp: boolean | boolean[];
  disabledInvOp: boolean | boolean[];
  disabledTotalOp: boolean | boolean[];
  disabledPayment: boolean | boolean[];
  disabledPaymentMoney: boolean | boolean[];
  disabledOtherOp: boolean | boolean[] = false;
  disabledAdminOp: boolean | boolean[] = false;
  disabledFinanceAdminOp: boolean | boolean[] = false;
  disabledReportsAdminOp: boolean | boolean[] = false;
  disabledInvoiceAdminOp: boolean | boolean[] = false;
  disabledOtherAdminOp: boolean | boolean[] = false;
  disabledCustomerOp: boolean | boolean[] = false;
  // systemConfig: Configuration;
  noLet4Supervisor =  [AdminOpEnum.APPLY_DISCOUNT, AdminOpEnum.REMOVE_HOLD, AdminOpEnum.CHARGE_ACCT_SETUP,
    AdminOpEnum.EMPLOYEE_SETUP, AdminOpEnum.CHANGE_PRICES, AdminOpEnum.CREDIT_LIMIT, AdminOpEnum.WTDZ]
    .map(a => a.toUpperCase());
  stationStatus = new Array<Station>();
  @Output() evReviewEnableState = new EventEmitter<boolean>();
  @Output() evResetEnableState = new EventEmitter<boolean>();
  @Output() evLogout = new EventEmitter<boolean>();
  @Output() evResetStock = new EventEmitter<boolean>();
  station: Station;

  constructor(public dialog: MatDialog, private dataStorage: DataStorageService, private authServ: AuthService,
              public config: ConfigurationService) {
  }

  opDenyByUser(op: AdminOpEnum | FinancialOpEnum, userRol?: UserrolEnum ) {
    let opDeny = false;
    if (this.config.sysConfig.companyType === CompanyType.ISLANDS) {
      this.noLet4Supervisor.push(FinancialOpEnum.HOLD.toUpperCase());
    }
    // Apply Discount for Supervisor by Configuration
    this.opDenyAllowByConfig(AdminOpEnum.APPLY_DISCOUNT, this.config.sysConfig.allowApplyDiscount);
    // Change Prices for Supervisor by Configuration
    this.opDenyAllowByConfig(AdminOpEnum.CHANGE_PRICES, this.config.sysConfig.allowChangePrice);

    if (this.authServ.token.rol === userRol && this.noLet4Supervisor.includes(op)) {
      this.openGenericInfo(InformationType.INFO, userRol + ' hasn\'t access to ' + op + ' operation.');
      opDeny = true;
    }
    return opDeny;
  }

  opDenyAllowByConfig(op: AdminOpEnum | FinancialOpEnum, allow: boolean) {
    if (allow) {
      this.noLet4Supervisor.splice(this.noLet4Supervisor.
      findIndex(v => v === op.toUpperCase()), 1);
    } else {
      if (!this.noLet4Supervisor.includes(op.toUpperCase())) {
        this.noLet4Supervisor.push(op.toUpperCase());
      }
    }
  }

  resetEnableState() {
    this.disabledInput = this.disabledFinOp = this.disabledInvOp = this.disabledTotalOp = this.disabledAdminOp = false;
    this.disabledPayment = this.disabledPaymentMoney = true;
    this.disabledFinanceAdminOp = false;
    this.disabledReportsAdminOp = false;
    this.disabledInvoiceAdminOp = false;
    this.disabledOtherAdminOp = false;
    this.disabledAdminOp = false;
    this.disableStock = false;
    // this.disabledCustomerOp = [true, false, false, true];
    this.splitAllow(false);
    this.evReviewEnableState.emit(false);
    this.evResetEnableState.emit(true);
  }

  reviewEnableState() {
    this.disabledInput = this.disabledTotalOp = this.disabledPayment = this.disabledPaymentMoney = this.disableStock = true;
    this.disabledFinOp = [true, false, true, true, true, true, true, true];
    this.disabledInvOp = [false, true, true, true];
    this.disabledOtherOp = [true, true, true, true, true, false];
    this.disabledReportsAdminOp = true;
    this.disabledFinanceAdminOp = [false, true, true, true, true, true];
    this.disabledInvoiceAdminOp = [true, false];
    this.disabledOtherAdminOp = true;
    this.disabledAdminOp = true;
    this.evReviewEnableState.emit(true);
  }

  changePriceEnableState() {
    this.disabledInput = true;
    this.changePriceEnableStateGeneric();
  }

  changePriceScanEnableState() {
    this.disableStock = true;
    this.changePriceEnableStateGeneric();
  }

  changePriceEnableStateGeneric() {
    this.disabledTotalOp = this.disabledPayment = this.disabledPaymentMoney = true;
    this.disabledFinOp = [true, true, true, true, true, true, true, true];
    this.disabledInvOp = [false, true, true, true];
    this.disabledOtherOp = [true, true, true, true, true, false];
    this.disabledReportsAdminOp = true;
    this.disabledFinanceAdminOp = [false, true, true, true, true, true];
    this.disabledInvoiceAdminOp = [true, false];
    this.disabledOtherAdminOp = true;
    this.disabledAdminOp = true;
    this.disabledCustomerOp = true;
  }

  reviewPaidEnableState() {
    this.disabledInput = this.disabledTotalOp = this.disabledPayment = true;
    this.disabledFinOp = [true, false, true, true, true, false, false];
    this.disabledInvOp = [false, true, true, true];
  }

  totalsEnableState(fs = false, refund = false) {
    console.log(fs);
    /*this.disabledInput = */this.disabledFinOp = this.disabledTotalOp = this.disableStock = true;
    this.disabledInvOp = [false, true, true, true];
    // if(this.config.sysConfig && this.config.sysConfig.allowCardSplit) this.disabledOtherOp = false;
    if (fs) {
      this.disabledPayment = [false, true, true, true, true, true];
    } else if (refund) {
      this.disabledPayment = this.disabledPaymentByCompany();
      this.disabledPaymentMoney = this.disabledPaymentMoneyByCompany();
      this.disabledCustomerOp = false;
    } else {
      // this.disabledPayment = this.disabledPaymentByCompany();
      this.disabledPayment = false;
      this.disabledPaymentMoney = false;
      this.disabledCustomerOp = false;
    }
    this.splitAllow(true);
  }

  totalsDisabled(refund?: boolean, ebt?: boolean) {
    console.log('totalsDisabled', refund, ebt);
    /*this.disabledInput =*/ this.disabledFinOp = this.disabledTotalOp = this.disableStock = true;
    // this.disabledInvOp = [false, true, true, true];
    // if(this.config.sysConfig && this.config.sysConfig.allowCardSplit) this.disabledOtherOp = false;
    // this.splitAllow(true);
    /*if (refund) {
      this.disabledPayment = ebt ? [true, true, true, false] : [true, true, false, true];
      this.disabledPaymentMoney = true;
    }*/
  }

  disabledPaymentByCompany() {
    return (this.config.sysConfig.companyType === CompanyType.MARKET && this.config.sysConfig.allowEBT) ?
      [true, true, false, false] : [true, false, false, true];
  }

  disabledPaymentMoneyByCompany() {
    return (this.config.sysConfig.companyType === CompanyType.MARKET) ? [true, true, true, true, true, true, true, true] : true;
  }

  ebtEnableState() {
    this.disabledTotalOp = [true, false];
    this.disabledPayment = this.disabledPaymentMoney = true;
  }

  cancelCheckEnableState() {
    this.disabledInput = this.disabledTotalOp = this.disabledPayment = this.disabledPaymentMoney = this.disabledFinOp =
      this.disableStock = true;
    // this.disabledInvOp =[false, true, true, true];
    this.disabledInvoiceAdminOp = [true, false];
    this.disabledReportsAdminOp = true;
    this.disabledAdminOp = [true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true];
    // this.evReviewEnableState.emit(true);
  }

  removeHoldEnableState() {
    this.disabledInput = this.disabledTotalOp = this.disabledPayment = this.disabledPaymentMoney = this.disabledFinOp =
      this.disableStock = true;
    // this.disabledInvOp =[false, true, true, true];
    this.disabledInvoiceAdminOp = [true, false];
    this.disabledReportsAdminOp = true;
    this.disabledAdminOp = [true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true];
    // this.evReviewEnableState.emit(true);
  }

  dayCloseEnableState() {
    this.disabledInput = this.disabledTotalOp = this.disabledPayment = this.disabledPaymentMoney = this.disabledFinOp =
      this.disabledAdminOp = this.disableStock = true;
    this.disabledInvOp = [false, true, true, true];
  }

  openGenericInfo(title: string, content?: string, content2?: any, confirm?: boolean, disableClose?: boolean) {
    return this.dialog.open(GenericInfoModalComponent, {
      width: '400px', height: '350px', data: {
        title: title ? title : 'Information',
        content: content,
        content2: content2,
        confirm: confirm,
        disableClose: disableClose
      },
      disableClose: true
    });
  }

  getSystemConfig() {
    return this.dataStorage.getConfiguration();
  }

  /*setSystemConfig(prop?: string) {
    // this.setUserToInvoice();
    this.getSystemConfig().subscribe(next => {
      console.info('getConfig successfull', next);
      if(!next.paxTimeout) next.paxTimeout = 60;
      //if(!next.allowAddProdGen) next.allowAddProdGen = true;
      if(!next.paxConnType) next.paxConnType = PAXConnTypeEnum.OFFLINE;
      if(!next.inactivityTime) next.inactivityTime = 60;
      this.config.sysConfig = next;
      if(!this.config.sysConfig.breakText) this.config.sysConfig.breakText = BreakTextEnum.ALL;
      this.resetEnableState();
      //this.splitAllow();
      // return prop ? next[prop]: next;
    }, err => {
      console.error('getConfig failed');
      this.openGenericInfo('Error', 'Can\'t get configuration');
    });
  }*/

  getOrder(inv: string) {
    return this.dataStorage.getOrder(inv);
  }

  private splitAllow(enabled?: boolean) {
    /*this.disabledCustomerOp = (this.config.sysConfig && this.config.sysConfig.allowCardSplit && !enabled) ?
      [true, false, false, true] : false;*/
    if (this.config.sysConfig && (this.config.sysConfig.allowCardSplit &&
      this.config.sysConfig.paxConnType === PAXConnTypeEnum.ONLINE)) {
      this.disabledCustomerOp = !enabled ? [true, false, false, true] : false;
    } else if (this.config.sysConfig && (!this.config.sysConfig.allowCardSplit ||
      this.config.sysConfig.paxConnType !== PAXConnTypeEnum.ONLINE)) {
      this.disabledCustomerOp = !enabled ? [false, false, true] : false;
    } else {
      console.log('splitAllow', this.config.sysConfig, this.disabledCustomerOp);
    }
  }

  openDialogs() {
    return (this.dialog.openDialogs && this.dialog.openDialogs.length);
  }

  getStationStatus(): Observable<Array<Station>> {
    return this.dataStorage.getStationsStatus();
  }

  setStationStatus(status: Array<Station>) {
    this.stationStatus = status;
    this.getStatusByStation();
  }

  getStatusByStation() {
    this.station = this.stationStatus.find((v, i) => +v.id === this.config.sysConfig.posNumber);
  }
}
