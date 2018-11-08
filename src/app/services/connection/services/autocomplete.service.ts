import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// import validator from 'validator';

@Injectable({
    providedIn: 'root'
})
export class AutocompleteService {
    autocompleteByUpc = (url: string, filter: string) => {
        let params = new HttpParams();
        params = params.append('upc', filter).append('limit', '10');
        return this._http.get<string[]>(url + '/attribute/upc', { params });
    }

    autocompleteByName = (url: string, filter: string) => {
        let params = new HttpParams();
        params = params.append('name', filter).append('limit', '10');
        return this._http.get<string[]>(url + '/attribute/name', { params });
    }

    /*chooseAutocomplete = (url: string, filter: string) =>
      validator.isNumeric(filter) ? this.autocompleteByUpc(url, filter) :  this.autocompleteByName(url, filter)*/

    constructor(private _http: HttpClient) {}

    /*filterProducts(url: string, filter: string): Observable<string[]> {
        return this.chooseAutocomplete(url, filter);
    }*/

    filterClients(url: string, filter: string) {
        let params = new HttpParams();
        params = params.append('name', filter).append('limit', '10');
        return this._http.get<string[]>(url, { params });
    }
}
