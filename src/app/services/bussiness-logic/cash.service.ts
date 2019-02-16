import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {GenericInfoModalComponent} from "../../components/presentationals/generic-info-modal/generic-info-modal.component";
import {MatDialog} from "@angular/material";

@Injectable({
  providedIn: 'root'
})
export class CashService {
  disabledInput: boolean;
  disabledFinOp: boolean | boolean[];
  disabledInvOp: boolean | boolean[];
  disabledTotalOp: boolean;
  disabledPayment: boolean | boolean[];

  constructor(public dialog: MatDialog) {
    this.resetEnableState();
  }

  resetEnableState() {
    this.disabledInput = this.disabledFinOp = this.disabledInvOp = this.disabledTotalOp = false;
    this.disabledPayment = true;
  }

  reviewEnableState() {
    this.disabledInput = this.disabledFinOp = this.disabledTotalOp = this.disabledPayment = true;
    this.disabledInvOp = [false, true, true, false];
  }

  totalsEnableState(fs = false) {
    this.disabledInput = this.disabledFinOp = this.disabledTotalOp = true;
    this.disabledInvOp = [false, true, true, true];
    fs ? this.disabledPayment = [false, true, true, true] : this.disabledPayment = [true, false, false, false];
  }

  openGenericInfo(title: string, content?: string, content2?: any) {
    return this.dialog.open(GenericInfoModalComponent,{
      width: '350px', height: '220px', data: {title: title ? title : 'Information', content: content, content2: content2 },
      disableClose: true
    });
  }

}
