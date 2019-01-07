import {EventEmitter, Injectable, Output} from '@angular/core';
import {AuthService} from "../api/auth.service";
import {ProductOrder} from "../../models/product-order.model";
import {DataStorageService} from "../api/data-storage.service";
import {Observable} from "rxjs";
import {Product} from "../../models";
import {InvoiceStatus} from "../../utils/invoice-status.enum";
import {Invoice} from "../../models/invoice.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  receiptNumber: string;
  cashier: string;
  // For manage numpadInput
  digits = '';
  numbers = 0;
  qty: number;
  // Invoice
  invoice: Invoice;

  @Output() evAddProd = new EventEmitter<ProductOrder>();
  @Output() evDelProd = new EventEmitter<any>();
  @Output() evDelAllProds = new EventEmitter<any>();
  @Output() evNumpadInput = new EventEmitter<any>();
  @Output() evAddProdByUPC = new EventEmitter<any>();
  @Output() evChkPriceProdByUPC = new EventEmitter<any>();

  constructor(private authService: AuthService, private dataStorage: DataStorageService) { }

  getCashier(): string {
    return this.cashier = this.authService.token.username ? this.authService.token.username : ''
  }

  createInvoice(): Observable<Invoice>{
    this.setUserToInvoice();
    return this.dataStorage.saveInvoiceByStatus(this.invoice, InvoiceStatus.IN_PROGRESS);
  }

  addProductOrder(po: ProductOrder){
    console.log('addProductOrder', po);
    let tmpInvoice = Object.assign({}, this.invoice);
    tmpInvoice.productsOrders.push(po);
    // Update invoice on database
    this.dataStorage.saveInvoice(tmpInvoice).subscribe(next => {
      this.invoice.productsOrders.push(po);
      this.evAddProd.emit(po);
    }, err => {
      console.error('addProductOrder', err);
    });
  }

  getReceiptNumber() {
    return this.dataStorage.getInvoiceNextReceiptNumber().subscribe(num => {
      this.receiptNumber = num;
      this.invoice = new Invoice(num);
      this.evDelAllProds.emit();
      this.createInvoice().subscribe(next => {
        console.info('createCheck successfull');
      }, err => {
        console.error('createCheck failed');
      });
    });
  }

  addProductByUpc(){
    // Consume servicio de PLU con this.digits eso devuelve ProductOrder
    this.getProductByUpc().subscribe(prod => { this.evAddProdByUPC.emit(prod); }, err => { console.log(err); });
  }

  holdOrder(): Observable<any> {
    this.setUserToInvoice();
    return this.dataStorage.saveInvoiceByStatus(this.invoice, InvoiceStatus.PENDENT_FOR_PAYMENT);
  }

  recallCheck(): Observable<Invoice[]> {
    return this.dataStorage.getInvoicesByStatus(InvoiceStatus.PENDENT_FOR_PAYMENT).pipe(map(invoices => invoices));
  }

  recallCheckByOrder(): Observable<Invoice> {
    console.log('Recall by InvoiceId: ', this.digits);
    return this.dataStorage.getInvoiceById(this.digits);
  }

  getProductByUpc(): Observable<Product>{
    return this.dataStorage.getProductByUpc(this.numbers);
  }

  setInvoice(inv: Invoice){
    this.invoice = inv;
    this.resetDigits();
  }

  resetDigits() {
    console.log('resetDigits');
    this.digits = '';
    this.numbers = 0;
  }

  cancelInvoice(): Observable<Invoice> {
    this.setUserToInvoice();
    return this.dataStorage.saveInvoiceByStatus(this.invoice, InvoiceStatus.CANCEL)
  }

  setUserToInvoice() {
    this.invoice.applicationUserId = parseInt(this.authService.token.user_id);
  }


}
