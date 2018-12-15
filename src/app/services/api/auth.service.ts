import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Credentials, Token } from '../../models/index';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:5000/api/1.0';
  token: Token;

  constructor(private http: HttpClient) {}

  login(credentials: Credentials): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.url + '/login/pos', credentials, { headers: headers, observe: 'response' }).pipe(
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
        // expiredAt.setSeconds(expiredAt.getSeconds() + decoded.exp);
        token.exp = expiredAt.getTime();
        this.token = token;
        return token;
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(this.url, {});
  }
}
