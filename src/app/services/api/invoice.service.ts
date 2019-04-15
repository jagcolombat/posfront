import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {InvoiceStatus} from '../../utils/invoice-status.enum';
import {Invoice} from '../../models/invoice.model';
import {Observable} from 'rxjs';
import { EOperationType } from 'src/app/utils/operation.type.enum';
import { ProductOrder } from 'src/app/models/product-order.model';
import { catchError } from 'rxjs/operators';
import { ProcessHTTPMSgService } from './ProcessHTTPMSg.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  path = '/invoices';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) { }

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

  getInvoiceByStatus = (url: string, status: string) => {
    let params = new HttpParams();
    params = params
      .append('pageNumber', '1')
      .append('pageSize', '20');
    return this._http.get<Invoice[]>(url + this.path + '/status/'+status, { params });
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
    return this._http.post(url + this.path + '/' + invoiceId + '/product', productDto, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteProductOrder(url: string, productOrderId: string, invoiceId: string): Observable<any> {
    return this._http.delete(url + this.path + '/' + invoiceId + '/product/' + productOrderId)
    .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteProductOrders(url: string, productOrderIds: Array<string>, invoiceId: string): Observable<any> {
    return this._http.request('delete', url + this.path + '/' + invoiceId + '/product', {body: productOrderIds})
    .pipe(catchError(this.processHttpMsgService.handleError));
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
    return this._http.post<Invoice[]>(url +  this.path +  '/print/last', {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getInvoiceByIdRefund (url: string, id: string): Observable<Invoice> {
    return this._http.post<Invoice>(url + this.path + '/' + id + '/status/refund', {});
  }

  updateInvoice (url: string, invoice: Invoice, property: string, value: any) {
    const documentPacth =  [{op: 'replace', path: '/' + property, value: value}];
    return this._http.patch<Invoice>(url + this.path + '/' + invoice.receiptNumber, documentPacth);
  }

  applyDiscountInvoice (url: string, id: string, discount: number): Observable<Invoice> {
    return this._http.post<Invoice>(url + this.path + '/' + id + '/discount/' + discount, {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  recallCheck (url: string, id: string): Observable<Invoice> {
    return this._http.get<Invoice>(url + this.path + '/recallcheck/' + id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

}
