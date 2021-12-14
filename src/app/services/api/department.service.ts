import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
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

  getProductByDepartment(url: string, department: string, pageNumber: number = 1, pageSize: number = 60): Observable<Product[]> {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber + '');
    params = params.append('pageSize', pageSize + '' );
    return this._http.get<Product[]>(url + '/departments/' + department + '/products', { params })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getSubDepartments(url: string, id: string) {
    return this._http.get<Department[]>(url + '/departments/'+id+'/child')
      .pipe(map(data => data))
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getDepartmentById(url: string, id: string): Observable<Department> {
    return this._http.get<Department>(url + '/departments/'+id)
      .pipe(map(data => data))
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
  
  updateDeptByAttr(url: string, id: string, value: string): Observable<Department[]> {
    const payload = {id: id, color: value};
    return this._http.post<any>(url + '/departments/attribute/color', payload)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
