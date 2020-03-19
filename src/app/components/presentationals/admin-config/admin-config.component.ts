import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {DataStorageService} from "../../../services/api/data-storage.service";
import {CashService} from "../../../services/bussiness-logic/cash.service";
import {PAXConnTypeEnum} from "../../../utils/pax-conn-type.enum";
import {InformationType} from "../../../utils/information-type.enum";
import {CompanyType} from "../../../utils/company-type.enum";

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
  restaurant: boolean;
  loading = false;
  needLogout = false;

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
    this.restaurant = this.cashService.systemConfig.companyType === CompanyType.RESTAURANT;

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

  setRestaurant($event: any){
    console.log('setRestaurant', $event, this.restaurant);
    this.restaurant = $event.checked;
    this.needLogout = true;
  }

  done(){
    this.cashService.systemConfig.allowAddProdGen = this.allowAddProdGen;
    this.cashService.systemConfig.allowClear = this.allowDeleteProd;
    this.cashService.systemConfig.allowEBT = this.allowEBT;
    this.cashService.systemConfig.allowCardSplit = this.allowSplitPayment;
    this.cashService.systemConfig.paxConnType = this.paxConnType ? PAXConnTypeEnum.ONLINE : PAXConnTypeEnum.OFFLINE;
    this.cashService.systemConfig.externalScale = this.externalScale;
    this.cashService.systemConfig.companyType = this.restaurant ? CompanyType.RESTAURANT : CompanyType.MARKET;
    if(this.needLogout){
      this.cashService.openGenericInfo(InformationType.INFO,
        'Please logout and login for apply the new configuration successfully');
    }
    if(this.timeLogout)
      this.dialogRef.close(this.timeLogout);
    else {
      this.dialogRef.close();
    }
  }

}
