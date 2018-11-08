import {EventEmitter, Injectable, Output} from '@angular/core';
import {Product} from "../models/product.model";
import {Order, ProductOrder} from "../models/order.model";
import {Invoice} from "../models/invoice.model";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  qty:number;
  digits = "";
  products: ProductOrder[];
  @Output() selectProduct = new EventEmitter<any>();
  @Output() evSetOrder = new EventEmitter<Invoice>();
  @Output() evSyncProd = new EventEmitter<any>();
  @Output() evAddProd = new EventEmitter<ProductOrder>();

  constructor() { }

  setOrder(o:Invoice){
    this.products = o.productsOrders;
    this.evSetOrder.emit(o);
  }

  /*addProduct(p: Product) {

  }*/
}
