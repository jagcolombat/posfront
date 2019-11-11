import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Invoice} from '../../models/invoice.model';
import {Observable} from 'rxjs';
import { Journey } from 'src/app/models/journey.model';
import { catchError } from 'rxjs/operators';
import { ProcessHTTPMSgService } from './ProcessHTTPMSg.service';

@Injectable({
  providedIn: 'root'
})
export class JourneyService {

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) { }

  path = '/journeys';

  registryOperation(url: string, journey: Journey): Observable<Invoice> {
      console.log('Put', journey);
      return this._http.put<Invoice>(url + this.path + '/operation', journey)
        .pipe(catchError(this.processHttpMsgService.handleError));
  }

}
