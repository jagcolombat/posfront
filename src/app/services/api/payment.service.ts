import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { ICashPayment } from 'src/app/models/cash-payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  path = '/payment';

  constructor(private _http: HttpClient) {}

  paidByCash(url: string, cashPayment: ICashPayment): Observable<any> {
    console.log(cashPayment);
    cashPayment.invoice.productsOrders = null;
    return this._http.post<any>(url + this.path +'/cash', cashPayment);
  }

}
