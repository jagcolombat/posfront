import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CashService {
  disabledInput: boolean;
  disabledFinOp: boolean | boolean[];
  disabledInvOp: boolean | boolean[];
  disabledTotalOp: boolean;
  disabledPayment: boolean | boolean[];

  constructor() {
    this.resetEnableState();
  }

  resetEnableState() {
    this.disabledInput = this.disabledFinOp = this.disabledInvOp = this.disabledTotalOp = false;
    this.disabledPayment = true;
  }

  reviewEnableState() {
    this.disabledInput = this.disabledFinOp = this.disabledTotalOp = this.disabledPayment = true;
    this.disabledInvOp = [false, true, true, true];
  }

  totalsEnableState(fs = false) {
    this.disabledInput = this.disabledFinOp = this.disabledTotalOp = true;
    this.disabledInvOp = [false, true, true, true];
    fs ? this.disabledPayment = [false, true, false, true, true] : this.disabledPayment = false;
  }

}
