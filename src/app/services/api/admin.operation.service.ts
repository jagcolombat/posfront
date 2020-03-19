import { Injectable } from '@angular/core';
import { ProcessHTTPMSgService } from './ProcessHTTPMSg.service';
import { User, Payment } from 'src/app/models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaidOut } from 'src/app/models/paid-out.model';
import { catchError } from 'rxjs/operators';
import { Invoice } from 'src/app/models/invoice.model';
import { CloseBatch } from 'src/app/utils/close.batch.enum';
import { Report } from 'src/app/models/report.model';
import {EmployeedModel, IPositionModel} from "../../models/employeed.model";
import {AdminOpEnum} from "../../utils/operations/admin-op.enum";

@Injectable({
  providedIn: 'root'
})
export class AdminOperationService {
  path = '/AdminOperations';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) { }

  getApplicationUsers(url: string): Observable<User[]> {
    return this._http.get<User[]>(url + this.path + '/users')
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

  printInvoiceByUser(url: string, id: string): Observable<any> {
    return this._http.post<Invoice[]>(url + this.path + '/stats/user/' + id + '/invoices', {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  printPaymentByType(url: string): Observable<any> {
    return this._http.post<Payment[]>(url + this.path + '/stats/invoices/payments', {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  closeBatch(url: string, closeBatch: CloseBatch): Observable<any> {
    let params = new HttpParams();
    params = params.append('closeBatchPrintOption', closeBatch + '');

    return this._http.post<any>(url + this.path + '/op/batch', {}, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getCloseBatchReport(url: string, closeBatch: CloseBatch): Observable<Report> {
    let params = new HttpParams();
    params = params.append('getCloseBatchReport', closeBatch + '');

    return this._http.get<any>(url + this.path + '/op/batch', {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getDayClosePrint(url: string, emp: string = ''): Observable<Report> {
    let params = new HttpParams();
    params = params.append('applicationUserId', emp + '');
    params = params.append('closeDay', false + '');
    return this._http.post<any>(url + this.path + '/op/report', {}, {params})
        .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getWeeklyClosePrint(url: string, close, from, to): Observable<Report> {
    let params = new HttpParams();
    params = params.append('closeWeek', close + '');
    if(from) params = params.append('fromDate', from + '');
    if(to) params = params.append('toDate', to + '');
    return this._http.post<any>(url + this.path + '/op/report/week', {}, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getDayClose(url: string, emp = ''): Observable<Report> {
    let params = new HttpParams();
    params = params.append('applicationUserId', emp + '');
    params = params.append('closeDay', true + '');
    return this._http.post<any>(url + this.path + '/op/report', {}, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  notSale(url: string): Observable<any> {
    return this._http.get<any>(url + this.path + '/op/notsale', {})
        .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getUsersPosition(url: string): Observable<IPositionModel[]> {
    return this._http.get<IPositionModel[]>(url + '/ApplicationUserPositions')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  employSetup(url: string, employee: EmployeedModel) {
    return this._http.post<any>(url + '/account/pos', employee)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}

