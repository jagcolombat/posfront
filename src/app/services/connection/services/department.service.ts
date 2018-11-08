import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Department} from '../../../models/department.model';
import {Product} from '../../../models/product.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private _http: HttpClient) { }

  getAll(url: string): Observable<Department[]> {
    return this._http.get<Department[]>(url + '/department').pipe(map(data => data));
  }

  getProductByDepartment(url: string, department: number): Observable<Product[]> {
    return this._http.get<Product[]>(url + '/department/' + department + '/products');
  }
}
