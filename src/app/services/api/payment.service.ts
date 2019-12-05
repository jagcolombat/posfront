import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import { ICashPayment } from 'src/app/models/cash-payment.model';
import { CreditCard } from 'src/app/models';
import { ProcessHTTPMSgService } from './ProcessHTTPMSg.service';
import { catchError } from 'rxjs/operators';

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
}
