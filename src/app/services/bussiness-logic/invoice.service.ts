import {EventEmitter, Injectable, Output} from '@angular/core';
import {AuthService} from "../api/auth.service";
import {ProductOrder} from "../../models/product-order.model";
import {DataStorageService} from "../api/data-storage.service";
import {Router} from "@angular/router";
import {ProductOrderService} from "./product-order.service";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  receiptNumber: string;
  cashier: string;
  digits = '';
  numbers = 0;
  qty: number;

  @Output() evAddProd = new EventEmitter<ProductOrder>();
  @Output() evDelProd = new EventEmitter<any>();
  @Output() evDelAllProds = new EventEmitter<any>();
  @Output() evNumpadInput = new EventEmitter<any>();
  @Output() evAddProdByUPC = new EventEmitter<any>();

  constructor(private authService: AuthService, private dataStorage: DataStorageService) { }

  getCashier(): string{
    return this.cashier = this.authService.token.username ? this.authService.token.username : ''
  }

  addProductOrder(po: ProductOrder){
    console.log('addProductOrder', po);
    this.evAddProd.emit(po);
  }

  getReceiptNumber() {
    return this.dataStorage.getInvoiceNextReceiptNumber().subscribe(num => this.receiptNumber = num);
  }

  addProductByUpc(){
    // Consume servicio de PLU con this.digits eso devuelve ProductOrder
    this.dataStorage.getProductByUpc(this.numbers).subscribe(prod => {
      this.evAddProdByUPC.emit(prod);
    }, error1 => {
      console.log(error1);
      /*this.prodService.qty = 1;
      this.resetDigits();*/
    });
  }
}
