import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {InvoiceStatus} from '../../utils/invoice-status.enum';
import {Invoice} from '../../models/invoice.model';
import {Observable} from 'rxjs';
import { EOperationType } from 'src/app/utils/operation.type.enum';
import { ProductOrder } from 'src/app/models/product-order.model';
import { ProcessHTTPMSgService } from './ProcessHTTPMSg.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvoiceRefundService {

  path = '/invoices';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) { }

  changeInvoiceToVoid(url: string, invoice: Invoice): Observable<Invoice> {
    if (invoice.id) {
      console.log('Void:', invoice);
      return this._http.post<Invoice>(url + this.path + '/refund/' + invoice.receiptNumber + '/status/void', invoice);
    }
  }

  addProductOrder(url: string, product: ProductOrder, invoiceId: string, operation: EOperationType): Observable<any> {
    let params = new HttpParams();
    params = params.append('operationType', operation + '' );
    const productDto = {productId: product.productId, quantity: product.quantity, unitCost: product.unitCost};
    return this._http.post(url + this.path + '/refund/' + invoiceId + '/product', productDto, {params});
  }

  deleteProductOrder(url: string, productOrderId: string, invoiceId: string): Observable<any> {
    return this._http.delete(url + this.path + '/refund/' + invoiceId + '/product/' + productOrderId);
  }

  deleteProductOrders(url: string, productOrderIds: Array<string>, invoiceId: string): Observable<any> {
    return this._http.request('delete', url + this.path + '/refund/' + invoiceId + '/product', {body: productOrderIds})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
