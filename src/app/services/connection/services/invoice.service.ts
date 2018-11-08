import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Page} from '../../../models/page.model';
import {InvoiceStatus} from '../utils/invoice-status.enum';
import {invoiceStatusToInt} from '../utils/invoce.functions';
import {Invoice} from "../../../models/invoice.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private _http: HttpClient) { }

  path = '/invoice';

  save(url: string, invoice: any) {
    console.log(invoice);
    return this._http.post(url + this.path, invoice);
  }

  saveByStatus(url: string, invoice: any, status: InvoiceStatus) {
    return this._http.post(url + this.path + '/' + status, invoice);
  }

  getAll = (url: string, page: Page) => {
    let params = new HttpParams();
    params = params.append('pageNumber', page.page.toString()).append('pageSize', page.size.toString());
    return this._http.get<Invoice[]>(url +  this.path, { params, observe: 'response' });
  }

  getAllWithoutPage = (url: string) => {
    // let params = new HttpParams();
    // params = params.append('pageNumber', page.page.toString()).append('pageSize', page.size.toString());
    return this._http.get<Invoice[]>(url +  this.path);
  }

  getByStatus = (url: string, status: InvoiceStatus) => {
    let params = new HttpParams();
    params = params
      .append('pageNumber', '1')
      .append('pageSize', '20')
      .append('invoiceStatus',status.toString());
    return this._http.get<Invoice[]>(url + this.path, { params });
  }

  getById (url: string, id: string): Observable<Invoice> {
    let params = new HttpParams();
    params = params
      .append('uniqueid', id);
    return this._http.get<Invoice>(url + this.path, { params });
  }

  getNextReceiptNumber(url: string) {
    return this._http.get<number>(url + this.path + '/next');
  }
}
