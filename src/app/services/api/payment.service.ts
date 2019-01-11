import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../../models';
import { CashPayment } from 'src/app/models/cash-payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private _http: HttpClient) {}

  paidByCash(url: string, cashPayment: CashPayment): Observable<any> {
    console.log(cashPayment);
    return this._http.post<any>(url + '/cash', cashPayment);
  }

}
