import {EventEmitter, Injectable, Output} from '@angular/core';
import {GenericInfoModalComponent} from "../../components/presentationals/generic-info-modal/generic-info-modal.component";
import {MatDialog} from "@angular/material";
import {Configuration} from "../../models/configuration.model";

@Injectable({
  providedIn: 'root'
})
export class CashService {
  disabledInput: boolean;
  disabledFinOp: boolean | boolean[];
  disabledInvOp: boolean | boolean[];
  disabledTotalOp: boolean | boolean[];
  disabledPayment: boolean | boolean[];
  systemConfig: Configuration;
  @Output() evReviewEnableState = new EventEmitter<boolean>();

  constructor(public dialog: MatDialog) {
    this.resetEnableState();
  }

  resetEnableState() {
    this.disabledInput = this.disabledFinOp = this.disabledInvOp = this.disabledTotalOp = false;
    this.disabledPayment = true;
    this.evReviewEnableState.emit(false);
  }

  reviewEnableState() {
    this.disabledInput = this.disabledTotalOp = this.disabledPayment = true;
    this.disabledFinOp = [true, false, true, true, true, true, true];
    this.disabledInvOp = [false, true, true, true];
    this.evReviewEnableState.emit(true);
  }

  reviewPaidEnableState() {
    this.disabledInput = this.disabledTotalOp = this.disabledPayment = true;
    this.disabledFinOp = [true, false, true, true, true, false, false];
    this.disabledInvOp = [false, true, true, true];
  }

  totalsEnableState(fs = false) {
    console.log(fs);
    this.disabledInput = this.disabledFinOp = this.disabledTotalOp = true;
    this.disabledInvOp = [false, true, true, true];
    fs ? this.disabledPayment = [false, true, true, true] : this.disabledPayment = [true, false, false, false];
  }

  ebtEnableState() {
    this.disabledTotalOp = [true, false];
    this.disabledPayment = true;
  }

  openGenericInfo(title: string, content?: string, content2?: any, confirm?: boolean) {
    return this.dialog.open(GenericInfoModalComponent,{
      width: '400px', height: '300px', data: {
        title: title ? title : 'Information',
        content: content,
        content2: content2,
        confirm: confirm
      },
      disableClose: true
    });
  }

}
