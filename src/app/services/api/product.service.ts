import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product, ProductUpdate} from '../../models';
import {EOperationType} from '../../utils/operation.type.enum';
import { catchError } from 'rxjs/operators';
import { ProcessHTTPMSgService } from './ProcessHTTPMSg.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {}

  getProductByUpc(url: string, upc: string, typeOp: EOperationType, pageNumber: number = 1, pageSize: number = 60): Observable<Product[]> {
    let params = new HttpParams();
    params = params.append('value', upc );
    params = params.append('operationType', typeOp + '' );
    params = params.append('pageNumber', pageNumber + '');
    params = params.append('pageSize', pageSize + '' );
    return this._http.get<any>(url + '/products/attribute', { params })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateProductByUpc(url: string, upc: string, price: string, id: string): Observable<Product[]> {
    const payload = new ProductUpdate(id, upc, +price);
    return this._http.post<any>(url + '/products/attribute/price', payload)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

}
