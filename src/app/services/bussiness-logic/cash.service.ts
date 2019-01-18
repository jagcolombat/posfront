import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CashService {

  evReviewCheck: BehaviorSubject<boolean>;
  evGoBack: BehaviorSubject<boolean>;
  evEmitReviewCheck = new EventEmitter<boolean>();
  evEmitGoBack = new EventEmitter<boolean>();

  constructor() {
    this.resetEvents();
  }

  resetEvents(){
    this.evReviewCheck = new BehaviorSubject<boolean>(true);
    this.evGoBack = new BehaviorSubject<boolean>(true);
  }
}
