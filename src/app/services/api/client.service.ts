import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import { ProcessHTTPMSgService } from './ProcessHTTPMSg.service';
import { catchError } from 'rxjs/operators';
import {ClientModel} from "../../models/client.model";
import {CardManualPayment} from "../../models";
import {Invoice} from "../../models/invoice.model";
import {PaymentMethodEnum} from "../../utils/operations/payment-method.enum";
import {CheckPayment} from "../../models/check.model";
import {TransferPayment} from "../../models/transfer.model";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  path = '/clients';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {}

  getClients(url: string): Observable<ClientModel[]> {
    return this._http.get<any[]>(url + this.path)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getClientById(url: string, id: string): Observable<any> {
    return this._http.get<any>(url + this.path + '/' + id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  setClient(url: string, client: ClientModel ): Observable<any> {
    console.log('setClient', client);
    return this._http.post<any>(url + this.path, client)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }


  acctCharge(url: string, client: string, amount: number, receiptNumber: string) : Observable<any> {
    console.log('acctCharge', client, amount, receiptNumber);
    return this._http.post<any>(url + this.path+ '/chargeAccount', { clientId: client, receiptNumber: receiptNumber, amount: amount})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  acctPayment(url: string, client: string, payment: CardManualPayment | CheckPayment | TransferPayment, paymentMethod: PaymentMethodEnum) {
    console.log('acctPayment', payment);
    let params = new HttpParams();
    params = params.append('paymentMethod', paymentMethod + '');
    return this._http.post<Invoice>(url + this.path + '/' + client + '/chargeAccount/payment', payment, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
