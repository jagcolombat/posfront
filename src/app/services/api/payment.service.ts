import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import { ICashPayment } from 'src/app/models/cash-payment.model';
import {CardManualPayment, CreditCard} from 'src/app/models';
import { ProcessHTTPMSgService } from './ProcessHTTPMSg.service';
import { catchError } from 'rxjs/operators';
import {Invoice} from "../../models/invoice.model";
import {ETransferType} from "../../utils/transfer-type.enum";
import {CheckPayment} from "../../models/check.model";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  path = '/invoices';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {}

  paidByCash(url: string, cashPayment: ICashPayment): Observable<any> {
    console.log(cashPayment);
    return this._http.post<any>(url + this.path + '/payment/cash', cashPayment)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  paidByCreditCard(url: string, cashPayment: CreditCard): Observable<any> {
    console.log(cashPayment);
    return this._http.post<any>(url + this.path + '/payment/credit', cashPayment)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  paidByDebitCard(url: string, cashPayment: CreditCard): Observable<any> {
    console.log(cashPayment);
    return this._http.post<any>(url + this.path + '/payment/debit', cashPayment)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  paidByEBTCard(url: string, cashPayment: CreditCard, type: number): Observable<any> {
    console.log(cashPayment);
    let params = new HttpParams();
    params = params.append('type', type + '');
    return this._http.post<any>(url + this.path + '/payment/ebt', cashPayment, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  ebtInquiry(url: string) {
    return this._http.get<any>(url + this.path + '/payment/ebt')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  paymentExternalCardReader(url: string, cardManualPayment: CardManualPayment ): Observable<Invoice> {
    console.log('paymentExternalCardReader', cardManualPayment);
    let params = new HttpParams();
    params = params.append('paymentMethod', 2 + '');
    params = params.append('transferType', cardManualPayment.transferType + '');
    params = params.append('receiptNumber', cardManualPayment.receiptNumber);
    return this._http.post<Invoice>(url + this.path + '/payment/external', cardManualPayment, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getPaymentMedia(url: string): Observable<any> {
    return this._http.get<any[]>(url + this.path + '/payment/media')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  paidByCheck(url: string, check: CheckPayment) {
    return this._http.post<Invoice>(url + this.path + '/payment/check', check)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
