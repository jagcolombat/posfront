import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {InvoiceStatus} from '../../utils/invoice-status.enum';
import {Invoice} from "../../models/invoice.model";
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

  saveByStatus(url: string, invoice: Invoice, status: InvoiceStatus): Observable<Invoice> {
    if (invoice.id) {
      console.log('Put', invoice);
      return this._http.put<Invoice>(url + this.path + '/' + invoice.id, invoice);
    } else {
      console.log('Post', invoice, status);
      return this._http.post<Invoice>(url + this.path + '/' + status, invoice);
    }
  }

  getAll = (url: string) => {
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

  getNextReceiptNumber(url: string): Observable<string> {
    return this._http.get<string>(url + this.path + '/next');
  }

  deleteProductOrderByInvoice(url: string, invoiceId: number, productOrderId: number): Observable<Invoice> {
    return this._http.delete<Invoice>(url + this.path + '/' + invoiceId + '/productOrder/' + productOrderId);
  }
}
