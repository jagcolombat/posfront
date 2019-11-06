import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product, ProductUpdate} from '../../models';
import {EOperationType} from "../../utils/operation.type.enum";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _http: HttpClient) {}

  getProductByUpc(url: string, upc: string, typeOp: EOperationType): Observable<Product[]> {
    let params = new HttpParams();
    params = params.append('value', upc );
    params = params.append('operationType', typeOp + '' );
    return this._http.get<any>(url + '/products/attribute', { params });
  }

  updateProductByUpc(url: string, upc: string, price: string, id: string): Observable<Product[]> {
    let payload = new ProductUpdate(id, upc, +price);
    return this._http.post<any>(url + '/products/attribute/price', payload);
  }

}
