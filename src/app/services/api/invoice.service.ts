import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {InvoiceStatus} from '../../utils/invoice-status.enum';
import {Invoice} from '../../models/invoice.model';
import {Observable} from 'rxjs';
import { EOperationType } from 'src/app/utils/operation.type.enum';
import { ProductOrder } from 'src/app/models/product-order.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  path = '/invoices';

  constructor(private _http: HttpClient) { }

  create(url: string): Observable<Invoice> {
    return this._http.get<Invoice>(url + this.path + '/status/created');
  }

  changeInvoiceToHold(url: string, invoice: Invoice): Observable<Invoice> {
    if (invoice.id) {
      console.log('Hold:', invoice);
      return this._http.post<Invoice>(url + this.path + '/' + invoice.receiptNumber + '/status/hold', invoice);
    }
  }

  changeInvoiceToVoid(url: string, invoice: Invoice): Observable<Invoice> {
    if (invoice.id) {
      console.log('Void:', invoice);
      return this._http.post<Invoice>(url + this.path + '/' + invoice.receiptNumber + '/status/void', invoice);
    }
  }

  getInvoiceInHold = (url: string) => {
    let params = new HttpParams();
    params = params
      .append('pageNumber', '1')
      .append('pageSize', '20');
    return this._http.get<Invoice[]>(url + this.path + '/status/inHold', { params });
  }

  getById (url: string, id: string, operationType: EOperationType): Observable<Invoice> {
    let params = new HttpParams();
    params = params
      .append('operationType', operationType + '');
    return this._http.get<Invoice>(url + this.path + '/receiptNumber/' + id, { params });
  }

  addProductOrder(url: string, product: ProductOrder, invoiceId: string, operation: EOperationType): Observable<any> {
    let params = new HttpParams();
    params = params.append('operationType', operation + '' );
    const productDto = {productId: product.productId, quantity: product.quantity, unitCost: product.unitCost};
    return this._http.post(url + this.path + '/' + invoiceId + '/product', productDto, {params});
  }

  deleteProductOrder(url: string, productOrderId: string, invoiceId: string): Observable<any> {
    return this._http.delete(url + this.path + '/' + invoiceId + '/product/' + productOrderId);
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

  printLastInvoice(url: string): Observable<Invoice[]> {
    return this._http.post<Invoice[]>(url +  this.path +  '/print/last', {});
  }

  getInvoiceByIdRefund (url: string, id: string): Observable<Invoice> {
    return this._http.post<Invoice>(url + this.path + '/' + id + '/status/refund', {});
  }

  updateInvoice (url: string, invoice: Invoice, property: string, value: any) {
    const documentPacth =  [{op: 'replace', path: '/' + property, value: value}];
    return this._http.patch<Invoice>(url + this.path + '/' + invoice.receiptNumber, documentPacth);
  }

}
