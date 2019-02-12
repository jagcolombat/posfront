import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { ICashPayment } from 'src/app/models/cash-payment.model';
import { CreditCard } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  path = '/invoices';

  constructor(private _http: HttpClient) {}

  paidByCash(url: string, cashPayment: ICashPayment): Observable<any> {
    console.log(cashPayment);
    return this._http.post<any>(url + this.path + '/payment/cash', cashPayment);
  }

  paidByCreditCard(url: string, cashPayment: CreditCard): Observable<any> {
    console.log(cashPayment);
    return this._http.post<any>(url + this.path + '/payment/credit', cashPayment);
  }

  paidByDebitCard(url: string, cashPayment: CreditCard): Observable<any> {
    console.log(cashPayment);
    return this._http.post<any>(url + this.path + '/payment/debit', cashPayment);
  }

  paidByEBTCard(url: string, cashPayment: CreditCard): Observable<any> {
    console.log(cashPayment);
    return this._http.post<any>(url + this.path + '/payment/ebt', cashPayment);
  }

}
