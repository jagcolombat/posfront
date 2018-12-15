import { Observable } from 'rxjs';
// import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Keys} from '../../utils/keys.enum';
import {AuthService} from "../api/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImFuZ2VsIiwianRpIjoiODMzNTc4YTUtNmU1Ny00Y2RlLWJhNj"+
    "EtOTJhM2Y0NzEzMThjIiwicm9sIjoiRGVwZW5kZW50IiwiZnVsbG5hbWUiOiJBbmdlbCBOdW5uZXogUG9kaW8iLCJjb21wYW55IjoiUE9TIiwiY29"+
    "tcGFueV90eXBlIjoiUG9zIiwidXNlcl9pZCI6IjIiLCJ1c2VybmFtZSI6ImFuZ2VsIiwiZXhwIjoxNTQ0MTUwMjU4LCJpc3MiOiJQT1MiLCJhdWQi"+
    "OiJQT1MifQ.KVaATD6pY37JISXOZ7QplqVQQuWYEEVGuB4EzxG-dZc";

  // getToken = key => this.localStorage.retrieve(key) || this.sessionStorage.retrieve(key);

  requestWithToken = (token: any, request: HttpRequest<any>, next: HttpHandler) => {
    request = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token
      }
    });
    return next.handle(request);
  }

  chooseRequestMode = (token: any, request: HttpRequest<any>, next: HttpHandler) => {
    return !!token ? this.requestWithToken(token, request, next) : next.handle(request);
  }

  constructor(/*private localStorage: LocalStorageService, private sessionStorage: SessionStorageService*/private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("token", this.token);
    if (this.auth.token) this.token = this.auth.token.fullToken;
    return this.chooseRequestMode(/*this.getToken(Keys.AUTH_TOKEN)*/this.token, request, next);
  }

}
