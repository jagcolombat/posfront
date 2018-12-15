import {EventEmitter, Injectable, Output} from '@angular/core';
import {Product} from '../../models/product.model';
import {ProductOrder} from '../../models/product-order.model';
import {Invoice} from '../../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  qty: number;
  digits = '';
  products: ProductOrder[];
  invoice: Invoice;

  @Output() selectProduct = new EventEmitter<any>();
  @Output() evSetOrder = new EventEmitter<Invoice>();
  @Output() evSyncProd = new EventEmitter<any>();
  @Output() evAddProd = new EventEmitter<ProductOrder>();
  @Output() evRemoveProd = new EventEmitter<ProductOrder>();

  constructor() {
    this.qty = 1;
  }

  setOrder(o: Invoice) {
    this.products = o.productsOrders;
    this.invoice = o;
    this.evSetOrder.emit(this.invoice);
  }
}
