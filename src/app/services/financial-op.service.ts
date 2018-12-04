import {EventEmitter, Injectable, Output} from '@angular/core';
import {ProductsService} from "./products.service";
import {Observable} from "rxjs/index";
import {DataStorageService} from "../shared/data-storage.service";
import {Invoice} from "../models/invoice.model";
import {InvoiceStatus} from "./connection/utils/invoice-status.enum";
import {map} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class FinancialOpService {
  orders: Array<Invoice> = new Array();
  actualOrderId: number = 10780;
  total: number;
  username: string = "Tony";

  @Output() evCreateOrder = new EventEmitter<any>();
  @Output() evSetUser = new EventEmitter<any>();

  constructor(private prodService: ProductsService, private dataStore: DataStorageService) {  }

  holdOrder(orderId: number): Observable<any> {
    return this.dataStore.saveInvoiceByStatus(new Invoice(orderId+"", InvoiceStatus.PENDENT_FOR_PAYMENT,
      this.total, this.prodService.products), InvoiceStatus.PENDENT_FOR_PAYMENT)

  }

  cash(orderId: number) {
    // this.orders.push(new Order(this.prodService.products, "completada", orderId));
    this.createOrder();
  }

  createOrder() {
    // this.actualOrderId++;
    this.dataStore.getInvoiceNextReceiptNumber().subscribe(data => {
      this.actualOrderId = data;
      console.log(this.actualOrderId++);
      this.evCreateOrder.emit(this.actualOrderId);
    }, err => console.log(err));

  }

  recall(): Observable<Invoice[]> {
    return this.dataStore.getInvoicesByStatus(InvoiceStatus.PENDENT_FOR_PAYMENT).pipe(map(invoices => invoices));
  }

  recallByOrder(orderId): Observable<Invoice> {
    /*let order: Observable<Order>;
    if(this.orders.length > 0) {
      order = this.orders.filter(o => o.orderId === orderId).map(orderRecovered => of(orderRecovered))[0];
    }
    return order;*/
    console.log("recallByOrder", orderId);
    return this.dataStore.getInvoiceById(orderId)/*.pipe(map(i => console.log(i[0])))*/;
  }

  setOrder(o: Invoice) {
    this.actualOrderId = parseInt(o.receiptNumber);
    this.prodService.setOrder(o);
  }

  setUsername(user: string) {
    this.username = user;
    this.evSetUser.emit(user);
  }

  getDigits() {
    return this.prodService.digits;
  }

  getProducts() {
    return this.prodService.products;
  }
}
