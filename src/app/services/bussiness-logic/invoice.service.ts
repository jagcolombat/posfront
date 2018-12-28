import {EventEmitter, Injectable, Output} from '@angular/core';
import {AuthService} from "../api/auth.service";
import {ProductOrder} from "../../models/product-order.model";
import {DataStorageService} from "../api/data-storage.service";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  receiptNumber: string;
  cashier: string;
  @Output() evAddProd = new EventEmitter<ProductOrder>();
  @Output() evDelProd = new EventEmitter<any>();
  @Output() evDelAllProds = new EventEmitter<any>();

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
}
