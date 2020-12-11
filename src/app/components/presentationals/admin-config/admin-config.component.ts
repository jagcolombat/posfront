import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CashService} from '../../../services/bussiness-logic/cash.service';
import {PAXConnTypeEnum} from '../../../utils/pax-conn-type.enum';
import {InformationType} from '../../../utils/information-type.enum';
import {CompanyType} from '../../../utils/company-type.enum';
import {Configuration} from '../../../models/configuration.model';
import {BreakTextEnum} from '../../../utils/breaktext.enum';

@Component({
  selector: 'admin-config',
  templateUrl: './admin-config.component.html',
  styleUrls: ['./admin-config.component.scss']
})
export class AdminConfigComponent implements OnInit {
  timeLogout: string;
  adminClearVoid: boolean;
  allowAddProdGen: boolean;
  allowDeleteProd: boolean;
  allowEBT: boolean;
  allowSplitPayment: boolean;
  paxConnType: boolean;
  externalScale: boolean;
  fullRefund: boolean;
  loading = false;
  needLogout = false;
  companyType: CompanyType | string;
  breakWord: boolean;
  closeChange: boolean;
  giftCard: boolean;
  clearLastProd: boolean;
  promotions: boolean;
  foodStampMark: boolean;
  applyDiscount: boolean;
  changePriceBySelection: boolean;
  allowClock: boolean;
  allowChangePrice: boolean;
  allowCloseAuth: boolean;
  allowDebitAsCreditCard: boolean;
  allowCloseDayAutom: boolean;
  allowRestartDayAutom: boolean;
  printCloseDayAutom: boolean;
  restartDayAutomatic: boolean;
  printVoid: boolean;
  printHold: boolean;
  printTicket: boolean;
  printMerchantTicket: boolean;
  printInitTicket: boolean;

  constructor( public dialogRef: MatDialogRef<AdminConfigComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
               private cashService: CashService) {
    console.log('adminConfig', this.cashService.config.sysConfig);
    this.allowAddProdGen = this.cashService.config.sysConfig.allowAddProdGen;
    this.allowDeleteProd = this.cashService.config.sysConfig.allowClear;
    this.allowEBT = this.cashService.config.sysConfig.allowEBT;
    this.allowSplitPayment = this.cashService.config.sysConfig.allowCardSplit;
    this.externalScale = this.cashService.config.sysConfig.externalScale;
    this.paxConnType = this.cashService.config.sysConfig.paxConnType === PAXConnTypeEnum.ONLINE;
    this.fullRefund = this.cashService.config.sysConfig.fullRefund;
    this.companyType = this.cashService.config.sysConfig.companyType + '';
    this.breakWord = this.cashService.config.sysConfig.breakText === BreakTextEnum.WORD;
    this.closeChange = this.cashService.config.sysConfig.closeChange;
    this.giftCard = this.cashService.config.sysConfig.allowGiftCard;
    this.clearLastProd = this.cashService.config.sysConfig.allowLastProdClear;
    this.promotions = this.cashService.config.sysConfig.allowPromotion;
    this.foodStampMark = this.cashService.config.sysConfig.allowFoodStampMark;
    this.applyDiscount = this.cashService.config.sysConfig.allowApplyDiscount;
    this.changePriceBySelection = this.cashService.config.sysConfig.changePriceBySelection;
    this.allowClock = this.cashService.config.sysConfig.allowClock;
    this.allowChangePrice = this.cashService.config.sysConfig.allowChangePrice;
    this.allowCloseAuth = this.cashService.config.sysConfig.closeAuth;
    this.allowDebitAsCreditCard = this.cashService.config.sysConfig.debitAsCreditCard;
    this.allowCloseDayAutom = this.cashService.config.sysConfig.closeDayAutomatic;
    this.allowRestartDayAutom = this.cashService.config.sysConfig.restartDayAutomatic;
    this.printVoid = this.cashService.config.sysConfig.printVoid;
    this.printHold = this.cashService.config.sysConfig.printHold;
    this.printTicket = this.cashService.config.sysConfig.printTicket;
    this.printInitTicket = this.cashService.config.sysConfig.printInitTicket;
    this.printMerchantTicket = this.cashService.config.sysConfig.printMerchantTicket;

    if (this.cashService.config.sysConfig.inactivityTime) {
      this.timeLogout = this.cashService.config.sysConfig.inactivityTime + '';
    }
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setTime4Logout($event: any) {
    console.log('setTime4Logout', $event, this.timeLogout);
  }

  setAdmin4ClearVoid($event: any) {
    console.log('setAdmin4ClearVoid', $event, this.adminClearVoid);
  }

  setAddProdGen($event: any) {
    console.log('setAddProdGen', $event, this.allowAddProdGen);
    this.allowAddProdGen = $event.checked;
  }

  setDeleteProd($event: any) {
    console.log('setDeleteProd', $event, this.allowDeleteProd);
    this.allowDeleteProd = $event.checked;
  }

  setEBT($event: any) {
    console.log('setEBT', $event, this.allowEBT);
    this.allowEBT = $event.checked;
    this.needLogout = true;
  }

  setSplitPayment($event: any) {
    console.log('setSplitPayment', $event, this.allowSplitPayment);
    this.allowSplitPayment = $event.checked;
    this.needLogout = true;
  }

  setPaxConnType($event: any) {
    console.log('setPaxConnType', $event, this.paxConnType);
    this.paxConnType = $event.checked;
    this.needLogout = true;
  }

  setExternalScale($event: any) {
    console.log('setPaxConnType', $event, this.externalScale);
    this.externalScale = $event.checked;
  }

  setCompanyType($event: any) {
    console.log('setCompanyType', $event, this.companyType);
    this.companyType = $event.value;
    this.needLogout = true;
  }

  setFullRefund($event: any) {
    console.log('setFullRefund', $event, this.fullRefund);
    this.fullRefund = $event.checked;
  }

  setBreakWord($event: any) {
    console.log('setBreakWord', $event, this.breakWord);
    this.breakWord = $event.checked;
  }

  setCloseChange($event: any) {
    console.log('setCloseChange', $event, this.closeChange);
    this.closeChange = $event.checked;
  }

  setGiftCard($event: any) {
    console.log('setGiftCard', $event, this.giftCard);
    this.giftCard = $event.checked;
    this.needLogout = true;
  }

  setClearLastProd($event: any) {
    console.log('setClearLastClose', $event, this.clearLastProd);
    this.clearLastProd = $event.checked;
    this.needLogout = false;
  }

  setPromotions($event: any) {
    console.log('setPromotions', $event, this.promotions);
    this.promotions = $event.checked;
    this.needLogout = false;
  }

  setFoodStampMark($event: any) {
    console.log('setFoodStampMark', $event, this.foodStampMark);
    this.foodStampMark = $event.checked;
    this.needLogout = false;
  }

  setApplyDiscount($event: any) {
    console.log('setApplyDiscount', $event, this.applyDiscount);
    this.applyDiscount = $event.checked;
    this.needLogout = true;
  }

  setChangePriceBySelection($event: any) {
    console.log('setChangePriceBySelection', $event, this.changePriceBySelection);
    this.changePriceBySelection = $event.checked;
    this.needLogout = false;
  }

  setAllowClock($event: any) {
    console.log('setClock', $event, this.allowClock);
    this.allowClock = $event.checked;
    this.needLogout = true;
  }

  setAllowChangePrice($event: any) {
    console.log('setAllowChangePrice', $event, this.allowChangePrice);
    this.allowChangePrice = $event.checked;
    this.needLogout = true;
  }

  setAllowCloseAuth($event: any) {
    console.log('setAllowCloseAuth', $event, this.allowCloseAuth);
    this.allowCloseAuth = $event.checked;
    // this.needLogout = true;
  }

  setAllowDebitAsCreditCard($event: any) {
    console.log('setAllowDebitAsCreditCard', $event, this.allowDebitAsCreditCard);
    this.allowDebitAsCreditCard = $event.checked;
  }

  setAllowCloseDayAutom($event: any) {
    console.log('setAllowCloseDayAutom', $event, this.allowCloseDayAutom);
    this.allowCloseDayAutom = $event.checked;
  }

  setAllowRestartDayAutom($event: any) {
    console.log('setAllowRestartDayAutom', $event, this.allowRestartDayAutom);
    this.allowRestartDayAutom = $event.checked;
  }

  setPrintCloseDayAutom($event: any) {
    console.log('setPrintCloseDayAutom', $event, this.restartDayAutomatic);
    this.allowRestartDayAutom = $event.checked;
  }

  setPrintVoid($event: any) {
    console.log('setPrintVoid', $event, this.printVoid);
    this.printVoid = $event.checked;
  }

  setPrintHold($event: any) {
    console.log('setPrintVoid', $event, this.printHold);
    this.printHold = $event.checked;
  }

  setPrintTicket($event: any) {
    console.log('setPrintVoid', $event, this.printTicket);
    this.printTicket = $event.checked;
  }

  setPrintInitTicket($event: any) {
    console.log('setPrintVoid', $event, this.printInitTicket);
    this.printInitTicket = $event.checked;
  }

  setPrintMerchantTicket($event: any) {
    console.log('setPrintVoid', $event, this.printMerchantTicket);
    this.printMerchantTicket = $event.checked;
  }

  done() {
    const conf = Object.assign({}, this.cashService.config.sysConfig);
    this.cashService.config.sysConfig.allowAddProdGen = this.allowAddProdGen;
    this.cashService.config.sysConfig.allowClear = this.allowDeleteProd;
    this.cashService.config.sysConfig.allowEBT = this.allowEBT;
    this.cashService.config.sysConfig.allowCardSplit = this.allowSplitPayment;
    this.cashService.config.sysConfig.paxConnType = this.paxConnType ? PAXConnTypeEnum.ONLINE : PAXConnTypeEnum.OFFLINE;
    this.cashService.config.sysConfig.externalScale = this.externalScale;
    this.cashService.config.sysConfig.companyType = <CompanyType>this.companyType;
    this.cashService.config.sysConfig.fullRefund = this.fullRefund;
    this.cashService.config.sysConfig.inactivityTime = +this.timeLogout;
    this.cashService.config.sysConfig.breakText = this.breakWord ? BreakTextEnum.WORD : BreakTextEnum.ALL;
    this.cashService.config.sysConfig.closeChange = this.closeChange;
    this.cashService.config.sysConfig.allowGiftCard = this.giftCard;
    this.cashService.config.sysConfig.allowLastProdClear = this.clearLastProd;
    this.cashService.config.sysConfig.allowPromotion = this.promotions;
    this.cashService.config.sysConfig.allowFoodStampMark = this.foodStampMark;
    this.cashService.config.sysConfig.allowApplyDiscount = this.applyDiscount;
    this.cashService.config.sysConfig.changePriceBySelection = this.changePriceBySelection;
    this.cashService.config.sysConfig.allowChangePrice = this.allowChangePrice;
    this.cashService.config.sysConfig.allowClock = this.allowClock;
    this.cashService.config.sysConfig.closeAuth = this.allowCloseAuth;
    this.cashService.config.sysConfig.debitAsCreditCard = this.allowDebitAsCreditCard;
    this.cashService.config.sysConfig.closeDayAutomatic = this.allowCloseDayAutom;
    this.cashService.config.sysConfig.restartDayAutomatic = this.allowRestartDayAutom;
    this.cashService.config.sysConfig.printVoid = this.printVoid;
    this.cashService.config.sysConfig.printHold = this.printHold;
    this.cashService.config.sysConfig.printTicket = this.printTicket;
    this.cashService.config.sysConfig.printInitTicket = this.printInitTicket;
    this.cashService.config.sysConfig.printMerchantTicket = this.printMerchantTicket;

    this.cashService.config.setConfig(this.cashService.config.sysConfig).subscribe(value => {
      console.log('set configuration', value, conf);
      this.cashService.config.sysConfig = <Configuration> value;
      if (this.needLogout) {
        this.cashService.openGenericInfo(InformationType.INFO,
          'Please logout and login for apply the new configuration successfully. Do you want logout?',
          null, true).afterClosed().subscribe(
            next => {
              if (next && next.confirm) {
                this.cashService.evLogout.emit(true);
              }
            }
        );
      }
      if (this.timeLogout) {
        this.dialogRef.close(this.timeLogout);
      } else {
        this.dialogRef.close();
      }
    }, error1 => {
      console.error(error1);
      this.cashService.config.sysConfig = Object.assign({}, conf);
      this.dialogRef.close();
    });

  }
}
