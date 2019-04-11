import { Injectable } from '@angular/core';
import { constructor } from 'validator/lib/matches';
import { ProcessHTTPMSgService } from './ProcessHTTPMSg.service';
import { User, Payment } from 'src/app/models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaidOut } from 'src/app/models/paid-out.model';
import { catchError } from 'rxjs/operators';
import { Invoice } from 'src/app/models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class AdminOperationService {

  path = '/AdminOperations';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) { }

  getApplicationUsers(url: string): Observable<User[]> {
    return this._http.get<User[]>(url + this.path + '/user')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  addPaidOut(url: string, paidOut: PaidOut): Observable<any> {
    console.log('paid out:', paidOut);
    return this._http.post<PaidOut>(url + this.path + '/paidout', paidOut)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getInvoiceByUser(url: string, id: string): Observable<Invoice[]> {
    return this._http.get<Invoice[]>(url + this.path + '/stats/user/' + id + '/invoices')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getPaymentByType(url: string): Observable<Payment[]> {
    return this._http.get<Payment[]>(url + this.path + '/stats/invoices/payments')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

}

