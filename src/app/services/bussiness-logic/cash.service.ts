import {EventEmitter, Injectable, Output} from '@angular/core';
import {GenericInfoModalComponent} from "../../components/presentationals/generic-info-modal/generic-info-modal.component";
import {MatDialog} from "@angular/material";
import {Configuration} from "../../models/configuration.model";
import {AuthService} from "../api/auth.service";
import {DataStorageService} from "../api/data-storage.service";
import {CompanyType} from "../../utils/company-type.enum";
import {BreakTextEnum} from "../../utils/breaktext.enum";
import {AdminOpEnum} from "../../utils/operations/admin-op.enum";
import {UserrolEnum} from "../../utils/userrol.enum";
import {InformationType} from "../../utils/information-type.enum";
import {FinancialOpEnum} from "../../utils/operations";

@Injectable({
  providedIn: 'root'
})
export class CashService {
  disabledInput: boolean;
  disabledInputKey: boolean;
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
  systemConfig: Configuration;
  noLet4Supervisor =  [AdminOpEnum.APPLY_DISCOUNT, AdminOpEnum.REMOVE_HOLD, AdminOpEnum.CHARGE_ACCT_SETUP,
    AdminOpEnum.EMPLOYEE_SETUP, AdminOpEnum.CHANGE_PRICES, AdminOpEnum.CREDIT_LIMIT, AdminOpEnum.WTDZ,
    FinancialOpEnum.HOLD].map(a => a.toUpperCase());
  @Output() evReviewEnableState = new EventEmitter<boolean>();
  //@Output() evPassScanned = new EventEmitter<string>();

  constructor(public dialog: MatDialog, private dataStorage: DataStorageService, private authServ: AuthService) {
    this.resetEnableState();
    if(this.authServ.token) this.setSystemConfig();
  }

  opDenyByUser(op: AdminOpEnum | FinancialOpEnum, userRol?: UserrolEnum ){
    let opDeny = false;
    if(this.authServ.token.rol === userRol && this.noLet4Supervisor.includes(op)){
      this.openGenericInfo(InformationType.INFO, userRol + ' hasn\'t access to ' + op + ' operation.');
      opDeny = true;
    }
    return opDeny;
  }

  resetEnableState() {
    this.disabledInput = this.disabledFinOp = this.disabledInvOp = this.disabledTotalOp = this.disabledAdminOp = false;
    this.disabledPayment = this.disabledPaymentMoney = true;
    this.splitAllow(false);
    this.disabledFinanceAdminOp = false;
    this.disabledReportsAdminOp = false;
    this.disabledInvoiceAdminOp = false;
    this.disabledOtherAdminOp = false;
    this.disabledAdminOp = false;
    this.disabledCustomerOp = [/*false,*/ false, false, true];
    this.evReviewEnableState.emit(false);
  }

  reviewEnableState() {
    this.disabledInput = this.disabledTotalOp = this.disabledPayment = this.disabledPaymentMoney = true;
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

  reviewPaidEnableState() {
    this.disabledInput = this.disabledTotalOp = this.disabledPayment = true;
    this.disabledFinOp = [true, false, true, true, true, false, false];
    this.disabledInvOp = [false, true, true, true];
  }

  totalsEnableState(fs = false, refund=false) {
    console.log(fs);
    this.disabledInput = this.disabledFinOp = this.disabledTotalOp = true;
    this.disabledInvOp = [false, true, true, true];
    //if(this.systemConfig && this.systemConfig.allowCardSplit) this.disabledOtherOp = false;
    this.splitAllow(true);
    if(fs){
      this.disabledPayment = [false, true, true, true, true, true]
    } else if (refund) {
      this.disabledPayment = this.disabledPaymentByCompany();
      this.disabledPaymentMoney = this.disabledPaymentMoneyByCompany();
      this.disabledCustomerOp = false;
    } else {
      this.disabledPayment = this.disabledPaymentByCompany();
      this.disabledPaymentMoney = false;
      this.disabledCustomerOp = false;
    }

  }

  totalsDisabled(){
    console.log('totalsDisabled');
    this.disabledInput = this.disabledFinOp = this.disabledTotalOp = true;
    //this.disabledInvOp = [false, true, true, true];
    //if(this.systemConfig && this.systemConfig.allowCardSplit) this.disabledOtherOp = false;
    //this.splitAllow(true);
  }

  disabledPaymentByCompany(){
    return (this.systemConfig.companyType === CompanyType.MARKET && this.systemConfig.allowEBT) ?
      [true, false, false, false, false, false] : false;
  }

  disabledPaymentMoneyByCompany(){
    return (this.systemConfig.companyType === CompanyType.MARKET) ? [true, true, true, true, true, true, false, false] : true;
  }

  ebtEnableState() {
    this.disabledTotalOp = [true, false];
    this.disabledPayment = this.disabledPaymentMoney = true;
  }

  cancelCheckEnableState() {
    this.disabledInput = this.disabledTotalOp = this.disabledPayment = this.disabledPaymentMoney = this.disabledFinOp = true;
    //this.disabledInvOp =[false, true, true, true];
    this.disabledInvoiceAdminOp = [true, false];
    this.disabledReportsAdminOp = true;
    this.disabledAdminOp = [true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true];
    //this.evReviewEnableState.emit(true);
  }

  removeHoldEnableState() {
    this.disabledInput = this.disabledTotalOp = this.disabledPayment = this.disabledPaymentMoney = this.disabledFinOp = true;
    //this.disabledInvOp =[false, true, true, true];
    this.disabledInvoiceAdminOp = [true, false];
    this.disabledReportsAdminOp = true;
    this.disabledAdminOp = [true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true];
    //this.evReviewEnableState.emit(true);
  }

  dayCloseEnableState() {
    this.disabledInput = this.disabledTotalOp = this.disabledPayment = this.disabledPaymentMoney = this.disabledFinOp =
      this.disabledAdminOp = true;
    this.disabledInvOp =[false, true, true, true];
  }

  openGenericInfo(title: string, content?: string, content2?: any, confirm?: boolean) {
    return this.dialog.open(GenericInfoModalComponent,{
      width: '400px', height: '350px', data: {
        title: title ? title : 'Information',
        content: content,
        content2: content2,
        confirm: confirm
      },
      disableClose: true
    });
  }

  getSystemConfig(){
    return this.dataStorage.getConfiguration();
  }

  setSystemConfig(prop?: string) {
    // this.setUserToInvoice();
    this.getSystemConfig().subscribe(next => {
      console.info('getConfig successfull', next);
      this.systemConfig = next;
      if(!this.systemConfig.breakText) this.systemConfig.breakText = BreakTextEnum.ALL;
      this.splitAllow();
      // return prop ? next[prop]: next;
    }, err => {
      console.error('getConfig failed');
      this.openGenericInfo('Error', 'Can\'t get configuration');
    });
  }

  getOrder(inv: string){
    return this.dataStorage.getOrder(inv);
  }

  private splitAllow(enabled?: boolean) {
    this.disabledOtherOp = (this.systemConfig && this.systemConfig.allowCardSplit && !enabled) ?
      [true, false, false, false, false, false, false] : false;
  }
}
