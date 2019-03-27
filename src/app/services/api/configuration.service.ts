import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Department} from '../../models/department.model';
import {Product} from '../../models/product.model';
import {map} from 'rxjs/operators';
import { Configuration } from 'src/app/models/configuration.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private _http: HttpClient) { }

  getAll(url: string): Observable<Configuration> {
    return this._http.get<Configuration>(url + '/configurations').pipe(map(data => data));
  }

}
