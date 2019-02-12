import {EventEmitter, Injectable, Output} from '@angular/core';
import {AuthService} from "../api/auth.service";
import {ProductOrder} from "../../models/product-order.model";
import {DataStorageService} from "../api/data-storage.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Product} from "../../models";
import {InvoiceStatus} from "../../utils/invoice-status.enum";
import {Invoice} from "../../models/invoice.model";
import {map} from "rxjs/operators";
import {EOperationType} from "../../utils/operation.type.enum";
import {CashPaymentModel} from "../../models/cash-payment.model";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  receiptNumber: string;
  cashier: string;
  // For manage numpadInput
  digits = '';
  numbers = 0;
  qty: number = 1;
  // Invoice
  invoice: Invoice;
  invoiceProductSelected: boolean;

  @Output() evAddProd = new EventEmitter<ProductOrder>();
  @Output() evDelProd = new EventEmitter<any>();
  @Output() evDelAllProds = new EventEmitter<any>();
  @Output() evNumpadInput = new EventEmitter<any>();
  @Output() evAddProdByUPC = new EventEmitter<any>();
  @Output() evChkPriceProdByUPC = new EventEmitter<any>();
  @Output() evUpdateTotals = new EventEmitter<any>();
  @Output() evUpdateProds = new EventEmitter<ProductOrder[]>();
  evCreateInvoice = new BehaviorSubject<boolean>(true);

  constructor(private authService: AuthService, private dataStorage: DataStorageService) { }

  getCashier(): string {
    return this.cashier = this.authService.token.username ? this.authService.token.username : ''
  }

  createInvoice(){
    // this.setUserToInvoice();
    this.dataStorage.createInvoice().subscribe(next => {
      console.info('createCheck successfull', next);
      this.receiptNumber = next.receiptNumber;
      this.invoice = next;
      this.evDelAllProds.emit();
      this.setTotal();
      this.evCreateInvoice.next(true);
    }, err => {
      console.error('createCheck failed');
      this.evCreateInvoice.next(false);
    });
  }

  addProductOrder(po: ProductOrder){

    // Update invoice on database
    this.dataStorage.addProductOrderByInvoice(this.invoice.receiptNumber, po, EOperationType.Add, this.invoice.isRefund).subscribe(next => {
      console.log('addProductOrder-next', next);
      /*let countPO = next.productsOrders.length;
      let lastPO = next.productsOrders[countPO-1];
      lastPO.product = po.product;
      this.addPO2Invoice(lastPO);
      this.resetDigits();*/
      if(next.receiptNumber[0] === 'R') {
        next.total = next.total * -1;
        next.subTotal = next.subTotal * -1;
        next.tax = next.tax * -1;
      }
      this.setInvoice(next);
    }, err => {
      console.error('addProductOrder', err);
      // this.delPOFromInvoice(po);
    });
  }

  addPO2Invoice(po: ProductOrder){
    // this.invoice.productsOrders.push(po);
    // this.setTotal();
    this.evAddProd.emit(po);
  }

  delPOFromInvoice(po: ProductOrder[]){
    po.map(prodOrder => {
      this.invoice.productOrders.splice(this.invoice.productOrders.indexOf(prodOrder),1);
      console.log('delPOFromInvoice', this.invoice.receiptNumber, prodOrder.id);
      this.dataStorage.deleteProductOrderByInvoice(this.invoice.receiptNumber, prodOrder.id, this.invoice.isRefund)
       .subscribe(data => console.log(data),
                  err => console.log(err));
    });
    // this.invoice.productsOrders.splice(this.invoice.productsOrders.indexOf(po),1);
    this.setTotal();
    // this.evUpdateProds.emit(this.invoice.productsOrders);
  }

  addProductByUpc(typeOp: EOperationType): Observable<Product> {
    // Consume servicio de PLU con this.digits eso devuelve ProductOrder
    return this.getProductByUpc(typeOp);
  }

  holdOrder(): Observable<any> {
    // this.setUserToInvoice();
    return this.dataStorage.changeInvoiceToHold(this.invoice);
  }

  /*recallCheck(): Observable<Invoice[]> {
    return this.dataStorage.getInvoicesByStatus(InvoiceStatus.PENDENT_FOR_PAYMENT, EOperationType.RecallCheck)
      .pipe(map(invoices => invoices));
  }*/

  getInvoiceInHold(typeOp: EOperationType, status?: InvoiceStatus): Observable<Invoice[]> {
    if (status) {
      return this.dataStorage.getInvoiceInHold().pipe(map(invoices => invoices));
    } else {
      return this.dataStorage.getInvoices().pipe(map(invoices => invoices));
    }
  }

  getInvoicesById(typeOp: EOperationType): Observable<Invoice> {
    console.log('Recall by InvoiceId: ', this.digits);
    return this.dataStorage.getInvoiceById(this.digits, typeOp);
  }

  getProductByUpc(typeOp: EOperationType): Observable<Product>{
    return this.dataStorage.getProductByUpc(this.numbers.toString(), typeOp);
  }

  setInvoice(inv: Invoice){
    this.invoice = inv;
    this.receiptNumber = this.invoice.receiptNumber;
    this.setTotal();
    this.evUpdateProds.emit(this.invoice.productOrders);
    this.resetDigits();
  }

  resetDigits() {
    console.log('resetDigits');
    this.digits = '';
    this.numbers = 0;
    this.qty = 1;
  }

  cancelInvoice(): Observable<Invoice> {
    // this.setUserToInvoice();
    return this.dataStorage.changeInvoiceToVoid(this.invoice)
  }

  cash(payment: number): Observable<Invoice> {
    const cashPayment = new CashPaymentModel(this.invoice.receiptNumber, payment);
    return this.dataStorage.paidByCash(cashPayment);
  }

  print(invoice: Invoice) {
    return this.dataStorage.printInvoices(invoice);
  }

  refund(): Observable<Invoice>{
    return this.dataStorage.getInvoiceByIdRefund(this.digits);
  }

  /*setUserToInvoice() {
    this.invoice.applicationUserId = parseInt(this.authService.token.user_id);
  }*/

  setTotal() {
    /*let totalComputed = this.computeTotal();
    this.invoice.subtotal = totalComputed.total;
    this.invoice.tax = totalComputed.taxes;
    this.invoice.total = this.invoice.subtotal + this.invoice.tax;*/
    this.evUpdateTotals.emit(true);
  }

  computeTotal() {
    let total = 0;
    let subtotal = 0;
    let tax = 0;
    let taxes = 0;
    this.invoice.productOrders.map(p => {
      subtotal = p.unitCost * p.quantity;
      total += subtotal;
      if (p.tax > 0 ) {
        // console.log(subtotal, p.tax);
        tax = p.tax * subtotal / 100;
        taxes += tax;
      }
    });
    // console.log(total, taxes);
    return { total: total, taxes: taxes };
  }


}
