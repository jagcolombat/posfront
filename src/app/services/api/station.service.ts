import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProcessHTTPMSgService } from './ProcessHTTPMSg.service';
import {StationModel} from '../../models/station.model';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) { }

  path = '/stations';

  getStatus(url: string): Observable<StationModel[]> {
    return this._http.get<any>(url + this.path)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

}
