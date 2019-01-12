import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {InvoiceStatus} from '../../utils/invoice-status.enum';
import {Invoice} from "../../models/invoice.model";
import {Observable} from "rxjs";
import { EOperationType } from 'src/app/utils/operation.type.enum';
import { ProductOrder } from 'src/app/models/product-order.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  path = '/invoice';

  constructor(private _http: HttpClient) { }

  create(url: string): Observable<Invoice> {
    return this._http.get<Invoice>(url + this.path + '/new');
  }

  saveByStatus(url: string, invoice: Invoice, status: InvoiceStatus, operationType: EOperationType): Observable<Invoice> {
    if (invoice.id) {
      console.log('Put', invoice);
      let params = new HttpParams();
      params = params.append('operationType', operationType + '');
      invoice.productsOrders = null;
      return this._http.put<Invoice>(url + this.path + '/' + invoice.id, invoice, {params});
    }
  }

  getByStatus = (url: string, status: InvoiceStatus, operationType: EOperationType) => {
    let params = new HttpParams();
    params = params
      .append('pageNumber', '1')
      .append('pageSize', '20')
      .append('invoiceStatus', status.toString())
      .append('operationType', operationType + '');
    return this._http.get<Invoice[]>(url + this.path, { params });
  }

  getById (url: string, id: string, operationType: EOperationType): Observable<Invoice> {
    let params = new HttpParams();
    params = params
      .append('uniqueId', id)
      .append('operationType', operationType + '');
    return this._http.get<Invoice>(url + this.path, { params });
  }

  addProductOrder(url: string, product: ProductOrder, invoiceId: string, operation: EOperationType): Observable<any> {
    let params = new HttpParams();
    params = params.append('operationType', operation + '' );
    return this._http.post(url + this.path + '/' + invoiceId + '/productOrder', product, {params});
  }

  deleteProductOrder(url: string, productOrderId: number, invoiceId: string): Observable<any> {
    return this._http.delete(url + this.path + '/' + invoiceId + '/productOrder/' + productOrderId);
  }

  getByDateRange(url: string, fromDate: Date, toDate: Date, pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('fromDate', fromDate + '');
    params = params.append('toDate', toDate + '' );
    params = params.append('pageNumber', pageNumber + '');
    params = params.append('pageSize', pageSize + '' );

    return this._http.get<Invoice>(url + this.path, { params });
  }

  getAllWithoutPage = (url: string) => {
    // let params = new HttpParams();
    // params = params.append('pageNumber', page.page.toString()).append('pageSize', page.size.toString());
    return this._http.get<Invoice[]>(url +  this.path);
  }

  printInvoice(url: string, invoice: Invoice): Observable<Invoice[]> {
    return this._http.post<Invoice[]>(url +  this.path +  '/' + invoice.receiptNumber + '/print', {});
  }

}
