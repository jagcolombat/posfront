import { Injectable } from '@angular/core';
import {AuthService} from "../api/auth.service";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private authService: AuthService) { }

  getCashier(): string{
    return this.authService.token.username ? this.authService.token.username : ''
  }
}
