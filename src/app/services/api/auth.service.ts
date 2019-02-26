import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Credentials, Token } from '../../models/index';
import jwt_decode from 'jwt-decode';
import { baseURL } from '../../utils/url.path.enum';
import { Url } from '../../utils/url.path.enum';
import { Router } from "@angular/router";
import {MatDialog} from "@angular/material";
import {UserrolEnum} from "../../utils/userrol.enum";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = baseURL;
  token: Token;
  credentials: Credentials;
  headers: HttpHeaders;

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) {
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
        const decoded = jwt_decode(response.body);
        const token: Token = {};
        token.fullToken = response.body;
        token.company = decoded.company;
        token.fullname = decoded.fullname;
        token.rol = decoded.rol;
        token.company_type = decoded.company_type;
        token.user_id = decoded.user_id;
        token.username = decoded.username;
        const expiredAt = new Date();
        token.exp = expiredAt.getTime();
        this.token = token;
        return token;
      })
    );
  }

  logout()/*: Observable<any>*/ {
    this.token = {};
    this.dialog.closeAll();
    this.router.navigateByUrl('/init');
    // return this.http.post(this.url, {});
  }

  adminLogged() {
    return (this.token && this.token.rol === UserrolEnum.ADMIN)? true : false;
  }
}
