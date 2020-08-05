import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {DataStorageService} from "../../../services/api/data-storage.service";
import {CashService} from "../../../services/bussiness-logic/cash.service";
import {PAXConnTypeEnum} from "../../../utils/pax-conn-type.enum";
import {InformationType} from "../../../utils/information-type.enum";
import {CompanyType} from "../../../utils/company-type.enum";
import {Configuration} from "../../../models/configuration.model";
import {BreakTextEnum} from "../../../utils/breaktext.enum";

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

  constructor( public dialogRef: MatDialogRef<AdminConfigComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any, private dataStorage: DataStorageService,
               private cashService: CashService) {
    console.log('adminConfig', this.cashService.systemConfig);
    this.allowAddProdGen = this.cashService.systemConfig.allowAddProdGen;
    this.allowDeleteProd = this.cashService.systemConfig.allowClear;
    this.allowEBT = this.cashService.systemConfig.allowEBT;
    this.allowSplitPayment = this.cashService.systemConfig.allowCardSplit;
    this.externalScale = this.cashService.systemConfig.externalScale;
    this.paxConnType = this.cashService.systemConfig.paxConnType === PAXConnTypeEnum.ONLINE;
    this.fullRefund = this.cashService.systemConfig.fullRefund;
    this.companyType = this.cashService.systemConfig.companyType+'';
    this.breakWord = this.cashService.systemConfig.breakText === BreakTextEnum.WORD;
    this.closeChange = this.cashService.systemConfig.closeChange;
    this.giftCard = this.cashService.systemConfig.allowGiftCard;
    this.clearLastProd = this.cashService.systemConfig.allowLastProdClear;
    this.promotions = this.cashService.systemConfig.allowPromotion;
    this.foodStampMark = this.cashService.systemConfig.allowFoodStampMark;
    this.applyDiscount = this.cashService.systemConfig.allowApplyDiscount;

    if(this.cashService.systemConfig.inactivityTime) this.timeLogout = this.cashService.systemConfig.inactivityTime+'';
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setTime4Logout($event:any) {
    console.log('setTime4Logout', $event, this.timeLogout);
  }

  setAdmin4ClearVoid($event: any) {
    console.log('setAdmin4ClearVoid', $event, this.adminClearVoid)
  }

  setAddProdGen($event: any){
    console.log('setAddProdGen', $event, this.allowAddProdGen);
    this.allowAddProdGen = $event.checked;
  }

  setDeleteProd($event: any){
    console.log('setDeleteProd', $event, this.allowDeleteProd);
    this.allowDeleteProd = $event.checked;
  }

  setEBT($event: any){
    console.log('setEBT', $event, this.allowEBT);
    this.allowEBT = $event.checked;
    this.needLogout = true;
  }

  setSplitPayment($event: any){
    console.log('setSplitPayment', $event, this.allowSplitPayment);
    this.allowSplitPayment = $event.checked;
    this.needLogout = true;
  }

  setPaxConnType($event: any){
    console.log('setPaxConnType', $event, this.paxConnType);
    this.paxConnType = $event.checked;
    this.needLogout = true;
  }

  setExternalScale($event: any){
    console.log('setPaxConnType', $event, this.externalScale);
    this.externalScale = $event.checked;
  }

  setCompanyType($event: any){
    console.log('setCompanyType', $event, this.companyType);
    this.companyType = $event.value;
    this.needLogout = true;
  }

  setFullRefund($event: any){
    console.log('setFullRefund', $event, this.fullRefund);
    this.fullRefund = $event.checked;
  }

  setBreakWord($event: any){
    console.log('setBreakWord', $event, this.breakWord);
    this.breakWord = $event.checked;
    //this.needLogout = true;
  }

  setCloseChange($event: any){
    console.log('setCloseChange', $event, this.closeChange);
    this.closeChange = $event.checked;
    //this.needLogout = true;
  }

  setGiftCard($event: any){
    console.log('setGiftCard', $event, this.giftCard);
    this.giftCard = $event.checked;
    this.needLogout = true;
  }

  setClearLastProd($event: any){
    console.log('setClearLastClose', $event, this.clearLastProd);
    this.clearLastProd = $event.checked;
    this.needLogout = false;
  }

  setPromotions($event: any){
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

  done(){
    let conf = Object.assign({}, this.cashService.systemConfig);
    this.cashService.systemConfig.allowAddProdGen = this.allowAddProdGen;
    this.cashService.systemConfig.allowClear = this.allowDeleteProd;
    this.cashService.systemConfig.allowEBT = this.allowEBT;
    this.cashService.systemConfig.allowCardSplit = this.allowSplitPayment;
    this.cashService.systemConfig.paxConnType = this.paxConnType ? PAXConnTypeEnum.ONLINE : PAXConnTypeEnum.OFFLINE;
    this.cashService.systemConfig.externalScale = this.externalScale;
    this.cashService.systemConfig.companyType = <CompanyType>this.companyType;
    this.cashService.systemConfig.fullRefund = this.fullRefund;
    this.cashService.systemConfig.inactivityTime = +this.timeLogout;
    this.cashService.systemConfig.breakText = this.breakWord ? BreakTextEnum.WORD : BreakTextEnum.ALL;
    this.cashService.systemConfig.closeChange = this.closeChange;
    this.cashService.systemConfig.allowGiftCard = this.giftCard;
    this.cashService.systemConfig.allowLastProdClear = this.clearLastProd;
    this.cashService.systemConfig.allowPromotion = this.promotions;
    this.cashService.systemConfig.allowFoodStampMark = this.foodStampMark;
    this.cashService.systemConfig.allowApplyDiscount = this.applyDiscount;

    this.dataStorage.setConfiguration(this.cashService.systemConfig).subscribe(value => {
      console.log('set configuration', value, conf);
      this.cashService.systemConfig = <Configuration> value;
      if(this.needLogout){
        this.cashService.openGenericInfo(InformationType.INFO,
          'Please logout and login for apply the new configuration successfully. Do you want logout?',
          null, true).afterClosed().subscribe(
            next => {
              if(next && next.confirm){
                this.cashService.evLogout.emit(true);
              }
            }
        );
      }
      if(this.timeLogout)
        this.dialogRef.close(this.timeLogout);
      else {
        this.dialogRef.close();
      }
    }, error1 => {
      console.error(error1);
      this.cashService.systemConfig = Object.assign({}, conf);
      this.dialogRef.close();
    });

  }
}
