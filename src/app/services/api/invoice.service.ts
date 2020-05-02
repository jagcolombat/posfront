import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {InvoiceStatus} from '../../utils/invoice-status.enum';
import {Invoice} from '../../models/invoice.model';
import {Observable} from 'rxjs';
import { EOperationType } from 'src/app/utils/operation.type.enum';
import { ProductOrder } from 'src/app/models/product-order.model';
import { catchError } from 'rxjs/operators';
import { ProcessHTTPMSgService } from './ProcessHTTPMSg.service';
import {ETransferType} from '../../utils/transfer-type.enum';
import {EApplyDiscount} from '../../utils/apply-discount.enum';
import {IGiftCardPaymentModel} from "../../models/gift-card.model";

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
      return this._http.post<Invoice>(url + this.path + '/' + invoice.receiptNumber + '/status/hold', invoice)
        .pipe(catchError(this.processHttpMsgService.handleError));
    }
  }

  changeInvoiceToVoid(url: string, invoice: Invoice): Observable<Invoice> {
    if (invoice.id) {
      console.log('Void:', invoice);
      return this._http.post<Invoice>(url + this.path + '/' + invoice.receiptNumber + '/status/void', invoice)
        .pipe(catchError(this.processHttpMsgService.handleError));
    }
  }

  changeInvoiceToRemoveHold(url: string, invoice: Invoice): Observable<Invoice> {
    if (invoice.id) {
      console.log('RemoveHold:', invoice);
      return this._http.post<Invoice>(url + this.path + '/' + invoice.receiptNumber + '/status/removeHold', invoice)
        .pipe(catchError(this.processHttpMsgService.handleError));
    }
  }

  getInvoiceByStatus = (url: string, status: InvoiceStatus) => {
    let params = new HttpParams();
    params = params
      .append('pageNumber', '1')
      .append('pageSize', '20');
    return this._http.get<Invoice[]>(url + this.path + '/status/' + status, { params })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getById (url: string, id: string, operationType: EOperationType): Observable<Invoice> {
    let params = new HttpParams();
    params = params
      .append('operationType', operationType + '');
    return this._http.get<Invoice>(url + this.path + '/receiptNumber/' + id, { params })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  addProductOrder(url: string, product: ProductOrder, invoiceId: string, operation: EOperationType, isRefund: boolean): Observable<any> {
    let params = new HttpParams();
    params = params.append('operationType', operation + '' );
    params = params.append('isRefund', isRefund + '' );
    params = params.append('isScalable', product.scalable + '' );
    const productDto = {productId: product.productId, quantity: product.quantity, unitCost: product.unitCost, total: product.total};
    return this._http.post(url + this.path + '/' + invoiceId + '/product', productDto, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteProductOrder(url: string, productOrderId: string, invoiceId: string): Observable<any> {
    return this._http.delete(url + this.path + '/' + invoiceId + '/product/' + productOrderId)
    .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteProductOrders(url: string, productOrders: ProductOrder[], invoiceId: string): Observable<any> {
    return this._http.request('delete', url + this.path + '/' + invoiceId + '/product', {body: productOrders})
    .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getByDateRange(url: string, fromDate: Date, toDate: Date, pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('fromDate', fromDate + '');
    params = params.append('toDate', toDate + '' );
    params = params.append('pageNumber', pageNumber + '');
    params = params.append('pageSize', pageSize + '' );

    return this._http.get<Invoice>(url + this.path, { params })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getAllWithoutPage = (url: string) => {
    // let params = new HttpParams();
    // params = params.append('pageNumber', page.page.toString()).append('pageSize', page.size.toString());
    return this._http.get<Invoice[]>(url +  this.path)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  printInvoice(url: string, invoice: Invoice): Observable<Invoice[]> {
    return this._http.post<Invoice[]>(url +  this.path +  '/' + invoice.receiptNumber + '/print', {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  printLastInvoice(url: string): Observable<Invoice[]> {
    return this._http.post<Invoice[]>(url +  this.path +  '/print/last', {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  subtotalInvoice(url: string, receiptNumber: string): Observable<Invoice> {
    return this._http.post<Invoice>(url +  this.path +  '/subtotal/' + receiptNumber, {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  fsSubtotalInvoice(url: string, receiptNumber: string): Observable<Invoice> {
    return this._http.post<Invoice>(url +  this.path +  '/fsSubtotal/' + receiptNumber, {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getInvoiceByIdRefund (url: string, id: string): Observable<Invoice> {
    return this._http.post<Invoice>(url + this.path + '/' + id + '/status/refund', {})
            .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateInvoice (url: string, invoice: Invoice, property: string, value: any) {
    const documentPacth =  [{op: 'replace', path: '/' + property, value: value}];
    // return this._http.patch<Invoice>(url + this.path + '/' + invoice.receiptNumber, documentPacth);
    return this._http.post<Invoice>(url + this.path + '/' + invoice.receiptNumber + '/' + property + '/' + value, {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  applyDiscountInvoice (url: string, id: string, discount: number, productOrderIds: Array<string>, discountType: EApplyDiscount): Observable<Invoice> {
    let params = new HttpParams();
    params = params.append('discountType', discountType + '');
    return this._http.post<Invoice>(url + this.path + '/' + id + '/discount/' + discount, productOrderIds, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  recallCheck (url: string, id: string): Observable<Invoice> {
    return this._http.get<Invoice>(url + this.path + '/recallcheck/' + id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  reviewCheck (url: string, id: string): Observable<Invoice> {
      return this._http.get<Invoice>(url + this.path + '/reviewcheck/' + id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  cancelCheck (url: string, id: string): Observable<Invoice> {
    return this._http.post<Invoice>(url + this.path + '/' + id + '/status/cancel', {})
    .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getInvoiceByTransferType(url: string, auth: ETransferType) {
    return this._http.get<Invoice[]>(url + this.path + '/transfertype/' + auth)
    .pipe(catchError(this.processHttpMsgService.handleError));
  }

  setUser(url: string, id: string, idUser: string): Observable<Invoice> {
    return this._http.post<Invoice>(url + this.path + '/' + id + '/user/' + idUser, {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  weightItem(url: string, receiptNumber: string, price: number, weight?: number): Observable<Invoice> {
    let params = new HttpParams();
    params = params.append('price', price + '');
    params = params.append('weight', weight + '');
    return this._http.post<Invoice>(url + '/products/weightItem/invoice/' + receiptNumber, '', {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  clearInvoice(url: string, receiptNumber: string): Observable<Invoice> {
    return this._http.post<Invoice>(url +  this.path +  '/clear/' + receiptNumber, {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  refundSale(url: string, receiptNumber: string) {
    return this._http.post<Invoice>(url + this.path + '/' + receiptNumber + '/refundSale', {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
