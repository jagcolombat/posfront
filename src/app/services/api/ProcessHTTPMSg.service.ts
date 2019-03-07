import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessHTTPMSgService {

constructor() { }

public handleError(error: HttpErrorResponse | any) {
  let errMsg: string;
  if (error.error instanceof ErrorEvent) {
  errMsg = error.error.message;
  } else {
  errMsg = `${error.statusText || ''} ${error.error}`;
  }
  return throwError(errMsg);
  }
}
