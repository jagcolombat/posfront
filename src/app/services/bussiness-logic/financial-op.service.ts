import {EventEmitter, Injectable, Output} from '@angular/core';
import {ProductsService} from './products.service';
import {Observable} from 'rxjs/index';
import {DataStorageService} from '../api/data-storage.service';
import {Invoice} from '../../models/invoice.model';
import {InvoiceStatus} from '../../utils/invoice-status.enum';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FinancialOpService {
  orders: Array<Invoice> = new Array();
  actualOrderId: string;
  total: number;
  username: string;
  invoice: Invoice;

  @Output() evCreateOrder = new EventEmitter<Invoice>();
  @Output() evSetUser = new EventEmitter<any>();

  constructor(private prodService: ProductsService, private dataStore: DataStorageService) {  }

  holdOrder(orderId: string): Observable<any> {
    return this.dataStore.saveInvoiceByStatus(this.invoice, InvoiceStatus.PENDENT_FOR_PAYMENT);

  }

  cash() {
    return this.dataStore.saveInvoiceByStatus(this.invoice, InvoiceStatus.PAID)
      .subscribe(data => {
          console.log(data);
          this.createOrder();
        }
        , err => console.log(err));
  }

  createOrder() {
    this.dataStore.getInvoiceNextReceiptNumber().subscribe(data => {
      this.actualOrderId = data;
      this.invoice = new Invoice(this.actualOrderId.toString());
      console.log('Create invoice: ' + this.invoice);
      this.prodService.setOrder(this.invoice);
      this.evCreateOrder.emit(this.invoice);
    }, err => console.log(err));
  }

  recall(): Observable<Invoice[]> {
    return this.dataStore.getInvoicesByStatus(InvoiceStatus.PENDENT_FOR_PAYMENT).pipe(map(invoices => invoices));
  }

  recallByOrder(orderId): Observable<Invoice> {
    console.log('Recall by InvoiceId: ', orderId);
    return this.dataStore.getInvoiceById(orderId);
  }

  setOrder(o: Invoice) {
    this.actualOrderId = o.receiptNumber;
    this.invoice = o;
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
