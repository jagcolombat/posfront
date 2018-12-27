import {EventEmitter, Injectable, Output} from '@angular/core';
import {AuthService} from "../api/auth.service";
import {ProductOrder} from "../../models/product-order.model";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  @Output() evAddProd = new EventEmitter<ProductOrder>();

  constructor(private authService: AuthService) { }

  getCashier(): string{
    return this.authService.token.username ? this.authService.token.username : ''
  }

  addProductOrder(po: ProductOrder){
    console.log('addProductOrder', po);
    this.evAddProd.emit(po);
  }
}
