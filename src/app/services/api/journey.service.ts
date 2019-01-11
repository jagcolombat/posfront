import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Invoice} from '../../models/invoice.model';
import {Observable} from 'rxjs';
import { Journey } from 'src/app/models/journey.model';

@Injectable({
  providedIn: 'root'
})
export class JourneyService {

  constructor(private _http: HttpClient) { }

  path = '/journeys';

  registryOperation(url: string, journey: Journey): Observable<Invoice> {
      console.log('Put', journey);
      return this._http.put<Invoice>(url + this.path + '/operation', journey);
  }

}
