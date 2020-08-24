import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Credentials, Token } from '../../models/index';
import jwt_decode from 'jwt-decode';
import { baseURL } from '../../utils/url.path.enum';
import {UserrolEnum} from "../../utils/userrol.enum";
import {ProcessHTTPMSgService} from "./ProcessHTTPMSg.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = baseURL;
  token: Token;
  credentials: Credentials;
  headers: HttpHeaders;
  initialLogin: Token;
  adminRoles=[UserrolEnum.ADMIN, UserrolEnum.SUPERVISOR]

  constructor(private http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  login(credentials: Credentials): Observable<any> {
    this.credentials = credentials;
    return this.getToken();

  }

  refreshToken() {
    return this.getToken();
  }

  private getToken() {
    return this.http.post<any>(this.url + '/login/pos', this.credentials,
      { headers: this.headers, observe: 'response' }).pipe(
      map(response => {
        console.log(response);
        return this.decodeToken(response.body);
      })
    ).pipe(catchError(this.processHttpMsgService.handleError));
  }

  decodeToken(jwt: any): Token {
    const decoded = jwt_decode(jwt);
    const token: Token = {};
    token.fullToken = jwt;
    token.company = decoded.company;
    token.fullname = decoded.fullname;
    token.rol = decoded.rol;
    token.company_type = decoded.company_type;
    token.user_id = decoded.user_id;
    token.username = decoded.username;
    const expiredAt = new Date();
    token.exp = expiredAt.getTime();
    this.token = token;
    //this.saveUser(token, true);
    return token;
  }

  logout(): Observable<any> {
    //this.saveUser(this.token, false);
    //this.token = {};
    return this.http.post(this.url+ '/login/pos/out', {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  adminLogged() {
    return (this.token && this.adminRoles.includes(this.token.rol));
  }

  restoreInitialLogin() {
    this.token = this.initialLogin;
  }

  /*private saveUser(token: Token, set?: boolean) {
    if(set){
      localStorage.setItem('userName', token.username);
      localStorage.setItem('token', token.fullToken);
    } else {
      localStorage.removeItem('userName');
      localStorage.removeItem('token');
    }
  }*/
}
