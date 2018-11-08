import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from "../../../models";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _http: HttpClient) {}

  getProductByUpc(url: string, upc: number): Observable<Product[]> {
    let params = new HttpParams();
    params = params.append('value', upc+"" );
    return this._http.get<any>(url + '/products/attribute', { params });
  }

}
