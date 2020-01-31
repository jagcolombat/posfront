// import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthService} from '../api/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  token = '';

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

  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('token', this.token, 'auth.token', this.auth.token);
    if (this.auth.token) { this.token = this.auth.token.fullToken; }
    return this.chooseRequestMode(this.token, request, next);
  }

  private handleAuthError (err: HttpErrorResponse): Observable<any> {
    if (err.status === 401 || err.status === 403) {
      return this.auth.refreshToken();
    }
    return Observable.throw(err);
  }

}
