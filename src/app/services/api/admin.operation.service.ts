import { Injectable } from '@angular/core';
import { ProcessHTTPMSgService } from './ProcessHTTPMSg.service';
import {User, Payment, Credentials} from 'src/app/models';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaidOut } from 'src/app/models/paid-out.model';
import {catchError, map} from 'rxjs/operators';
import { Invoice } from 'src/app/models/invoice.model';
import { CloseBatch } from 'src/app/utils/close.batch.enum';
import { Report } from 'src/app/models/report.model';
import {EmployeedModel, IPositionModel} from '../../models/employeed.model';
import { WorkerRecords } from 'src/app/models/worker-records';

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

  getInvoiceByUserAndDate(url: string, id: string, date: any, status?: string): Observable<Invoice[]> {
    let params = new HttpParams();
    if (date && date['from']) { params = params.append('fromDate', date['from'] + ''); }
    if (date && date['to']) { params = params.append('toDate', date['to'] + ''); }
    if (status) { params = params.append('invoiceState', status + ''); }
    return this._http.get<Invoice[]>(url + this.path + '/stats/user/' + id + '/invoices', {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getPaymentByType(url: string): Observable<Payment[]> {
    return this._http.get<Payment[]>(url + this.path + '/stats/invoices/payments')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  printInvoiceByUser(url: string, id: string, date?: any, status?: string): Observable<any> {
    let params = new HttpParams();
    if (date && date['from']) { params = params.append('fromDate', date['from'] + ''); }
    if (date && date['to']) { params = params.append('toDate', date['to'] + ''); }
    if (status) { params = params.append('invoiceState', status + ''); }
    return this._http.post<Invoice[]>(url + this.path + '/stats/user/' + id + '/invoices', {}, {params})
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

  getWeeklyClosePrint(url: string, close, from, to): Observable<Report> {
    /*let params = new HttpParams();
    if (close) { params = params.append('closeWeek', close + ''); }
    if (from) { params = params.append('fromDate', from + ''); }
    if (to) { params = params.append('toDate', to + ''); }*/
    return this._http.post<any>(url + this.path + '/op/report/week', {}/*, {params}*/)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getDayClose(url: string, close: boolean, date?: string): Observable<Report> {
    let params = new HttpParams();
    if (date) { params = params.append('date', date + ''); }
    params = params.append('closeDay', close + '');
    return this._http.post<any>(url + this.path + '/op/report', {}, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  cashierCloseShift(url: string, close: boolean, emp: string, date?: string): Observable<Report> {
    let params = new HttpParams();
    if (date) { params = params.append('date', date + ''); }
    params = params.append('closeDay', close + '');
    return this._http.post<any>(url + this.path + '/op/report/user/' + emp, {}, {params})
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

  employUpdate(url: string, credentials: Credentials) {
    return this._http.put<any>(url + '/account/pos/' + credentials.id, credentials)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  employUpdatePass(url: string, credentials: Credentials) {
    return this._http.post<any>(url + '/account/pos/' + credentials.username + '/changePassword', credentials)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  employDelete(url: string, id: string) {
    return this._http.delete<any>(url + '/account/pos/' + id).pipe(catchError(this.processHttpMsgService.handleError));
  }

  employClock(url: string, credentials: Credentials, clockType = 1) {
    return this._http.post<any>(url + '/account/clock/' + clockType, credentials)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getTimeWorkedByUser(url: string, id: string, date: string): Observable<string> {
    let params = new HttpParams();
    params = params.append('date', date + '');
    return this._http.get<string>(url + '/account/' + id + '/clock/hoursworked', {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getWorkerRecordsByUser(url: string, id: string, date: string): Observable<WorkerRecords[]> {
    let params = new HttpParams();
    params = params.append('date', date + '');
    return this._http.get<WorkerRecords[]>(url + '/account/' + id + '/clock', {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateProducts(url: string): Observable<any> {
    return this._http.post<any>(url + '/op/backoffice/demand', {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}

