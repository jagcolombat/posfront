import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import { ProcessHTTPMSgService } from './ProcessHTTPMSg.service';
import { catchError } from 'rxjs/operators';
import {ClientModel} from "../../models/client.model";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  path = '/clients';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {}

  getClients(url: string): Observable<ClientModel[]> {
    return this._http.get<any[]>(url + this.path)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getClientById(url: string, id: string): Observable<any> {
    return this._http.get<any>(url + this.path + '/' + id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  setClient(url: string, client: ClientModel ): Observable<any> {
    console.log('setClient', client);
    return this._http.post<any>(url + this.path, client)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }


}
