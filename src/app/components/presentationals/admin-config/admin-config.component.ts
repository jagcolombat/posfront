import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {DataStorageService} from "../../../services/api/data-storage.service";
import {CashService} from "../../../services/bussiness-logic/cash.service";

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
  loading = false;

  constructor( public dialogRef: MatDialogRef<AdminConfigComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any, private dataStorage: DataStorageService,
               private cashService: CashService) {
    console.log('adminConfig', this.cashService.systemConfig);
    this.allowAddProdGen = this.cashService.systemConfig.allowAddProdGen;
    this.allowDeleteProd = this.cashService.systemConfig.allowClear;
    this.allowEBT = this.cashService.systemConfig.allowEBT;
    this.allowSplitPayment = this.cashService.systemConfig.allowCardSplit;
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
  }

  setSplitPayment($event: any){
    console.log('setSplitPayment', $event, this.allowSplitPayment);
    this.allowSplitPayment = $event.checked;
  }

  done(){
    this.cashService.systemConfig.allowAddProdGen = this.allowAddProdGen;
    this.cashService.systemConfig.allowClear = this.allowDeleteProd;
    this.cashService.systemConfig.allowEBT = this.allowEBT;
    this.cashService.systemConfig.allowCardSplit = this.allowSplitPayment;
    if(this.timeLogout)
      this.dialogRef.close(this.timeLogout);
    else {
      this.dialogRef.close();
    }
  }

}
