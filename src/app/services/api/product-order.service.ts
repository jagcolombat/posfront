import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../../models';
import { ProductOrder } from 'src/app/models/product-order.model';
import { EOperationType } from 'src/app/utils/operation.type.enum';

@Injectable({
  providedIn: 'root'
})
export class ProductOrderService {
  path = 'ProductOrders';

  constructor(private _http: HttpClient) {}

  addProductOrder(url: string, product: ProductOrder, invoiceId: string, operation: EOperationType): Observable<any> {
    let params = new HttpParams();
    params = params.append('invoiceReceiptNumber', invoiceId );
    params = params.append('operationType', operation + '' );

    return this._http.post(url + this.path, product, {params});
  }

  deleteProductOrder(url: string, id: number, invoiceId: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('invoiceReceiptNumber', invoiceId );

    return this._http.delete(url + this.path + '/' + id, {params});
  }

}
