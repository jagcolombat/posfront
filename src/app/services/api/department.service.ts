import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Department} from '../../models/department.model';
import {Product} from '../../models/product.model';
import {map, catchError} from 'rxjs/operators';
import { ProcessHTTPMSgService } from './ProcessHTTPMSg.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) { }

  getAll(url: string): Observable<Department[]> {
    return this._http.get<Department[]>(url + '/departments')
      .pipe(map(data => data))
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getProductByDepartment(url: string, department: string): Observable<Product[]> {
    return this._http.get<Product[]>(url + '/departments/' + department + '/products')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
