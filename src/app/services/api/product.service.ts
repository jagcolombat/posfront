import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../../models';
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

}
