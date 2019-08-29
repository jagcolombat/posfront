import {EventEmitter, Injectable, Output} from '@angular/core';
import {AuthService} from "../api/auth.service";
import {ProductOrder} from "../../models/product-order.model";
import {DataStorageService} from "../api/data-storage.service";
import {BehaviorSubject, Observable} from "rxjs";
import {CreditCardModel, Product} from "../../models";
import {InvoiceStatus} from "../../utils/invoice-status.enum";
import {Invoice} from "../../models/invoice.model";
import {map} from "rxjs/operators";
import {EOperationType} from "../../utils/operation.type.enum";
import {CashPaymentModel} from "../../models/cash-payment.model";
import {CashService} from "./cash.service";
import {PaidOut} from "../../models/paid-out.model";
import {PaymentStatus} from "../../utils/payment-status.enum";
import {Order} from "../../models/order.model";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  receiptNumber: string;
  cashier: string;
  // For manage numpadInput
  digits = '';
  numbers = '';
  qty: number = 1;
  // Invoice
  invoice: Invoice;
  order: Order;
  invoiceProductSelected: any[] = [];
  isReviewed: boolean;

  @Output() evAddProd = new EventEmitter<ProductOrder>();
  @Output() evDelProd = new EventEmitter<any>();
  @Output() evDelAllProds = new EventEmitter<any>();
  @Output() evNumpadInput = new EventEmitter<any>();
  @Output() evAddProdByUPC = new EventEmitter<any>();
  @Output() evChkPriceProdByUPC = new EventEmitter<any>();
  @Output() evUpdateTotals = new EventEmitter<any>();
  @Output() evUpdateProds = new EventEmitter<ProductOrder[]>();
  evCreateInvoice = new BehaviorSubject<boolean>(true);

  constructor(private authService: AuthService, private dataStorage: DataStorageService, private cashService: CashService) {
    //this.setSystemConfig();
  }

  getCashier(): string {
    return this.cashier = this.authService.token.username ? this.authService.token.username : ''
  }

  createInvoice(){
    // this.setUserToInvoice();
    /*let deliveryTypes= new Array<string>();
    for (let eDeliveryTypeKey in EDeliveryType) {
      deliveryTypes.push(EDeliveryType[eDeliveryTypeKey]);
    }
    this.cashService.dialog.open(DialogDeliveryComponent,
      { width: '600px', height: '340px', data: deliveryTypes, disableClose: true })
      .afterClosed().subscribe(next => {
        console.log(next);*/
        this.dataStorage.createInvoice().subscribe(next => {
          console.info('createCheck successfull', next);
          this.receiptNumber = next.receiptNumber;
          this.invoice = next;
          this.isReviewed = false;
          this.evDelAllProds.emit();
          this.setTotal();
          this.evCreateInvoice.next(true);
        }, err => {
          console.error('createCheck failed');
          this.evCreateInvoice.next(false);
        });
    //})
  }

  addProductOrder(po: ProductOrder){

    // Update invoice on database
    this.dataStorage.addProductOrderByInvoice(this.invoice.receiptNumber, po, EOperationType.Add, this.invoice.isRefund)
      .subscribe(next => {
      console.log('addProductOrder-next', next);
      /*let countPO = next.productsOrders.length;
      let lastPO = next.productsOrders[countPO-1];
      lastPO.product = po.product;
      this.addPO2Invoice(lastPO);
      this.resetDigits();*/
      // next.productOrders[next.productOrders.length-1].foodStamp = po.foodStamp;
      this.setInvoice(next);
    }, err => {
      console.error('addProductOrder', err);
      // this.delPOFromInvoice(po);
      this.resetDigits();
      this.cashService.openGenericInfo('Error', err);
    });
  }

  updateClientAge(clientAge: number) {
    this.invoice.clientAge = clientAge;
    this.dataStorage.updateInvoice(this.invoice, 'clientAge', clientAge)
    .subscribe( data => console.log(data), err => console.log(err) );
  }

  addPO2Invoice(po: ProductOrder){
    // this.invoice.productsOrders.push(po);
    // this.setTotal();
    this.evAddProd.emit(po);
  }

  delPOFromInvoice(po: ProductOrder[]){
    const productOrdersIds = po.map(prodOrder => {
      return prodOrder.id;
    });

    this.dataStorage.deleteProductOrdersByInvoice(this.invoice.receiptNumber, productOrdersIds, this.invoice.isRefund)
      .subscribe(data => {
        console.log(data);
        this.setInvoice(data);
      },
      err => {
        console.log(err);
        this.cashService.openGenericInfo('Error', err.error);
      });
  }

  addProductByUpc(typeOp: EOperationType): Observable<Product> {
    // Consume servicio de PLU con this.digits eso devuelve ProductOrder
    return this.getProductByUpc(typeOp);
  }

  holdOrder(): Observable<any> {
    // this.setUserToInvoice();
    return this.dataStorage.changeInvoiceToHold(this.invoice);
  }

  voidOrder(i: Invoice): Observable<any> {
    // this.setUserToInvoice();
    return this.dataStorage.changeInvoiceToVoid(i);
  }

  removeHoldOrder(i: Invoice): void {
    // this.setUserToInvoice();
    this.dataStorage.changeInvoiceToRemoveHold(i).subscribe(
      next=> {
        console.log(next);
        this.resetDigits();
        this.createInvoice();
        this.cashService.resetEnableState();
      },
      err=> {
        console.error(err);
        this.cashService.openGenericInfo('Error', 'Can\'t complete remove on hold operation');
      });
  }

  /*recallCheck(): Observable<Invoice[]> {
    return this.dataStorage.getInvoicesByStatus(InvoiceStatus.PENDENT_FOR_PAYMENT, EOperationType.RecallCheck)
      .pipe(map(invoices => invoices));
  }*/

  recallCheck(): Observable<Invoice> {
    return this.dataStorage.recallCheck(this.digits);
  }

  getInvoiceByStatus(typeOp: EOperationType, status?: InvoiceStatus): Observable<Invoice[]> {
    if (status === InvoiceStatus.IN_HOLD || status === InvoiceStatus.CANCEL) {
      return this.dataStorage.getInvoiceByStatus(status).pipe(map(invoices => invoices));
    } else {
      return this.dataStorage.getInvoices().pipe(map(invoices => invoices));
    }
  }

  getInvoicesById(typeOp: EOperationType): Observable<Invoice> {
    console.log('Recall by InvoiceId: ', this.digits);
    return this.dataStorage.getInvoiceById(this.digits, typeOp);
  }

  getProductByUpc(typeOp: EOperationType): Observable<Product>{
    return this.dataStorage.getProductByUpc(this.numbers, typeOp);
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
    this.numbers = '';
    this.qty = 1;
  }

  cancelInvoice(): Observable<Invoice> {
    // this.setUserToInvoice();
    return this.dataStorage.changeInvoiceToVoid(this.invoice)
  }

  cash(payment: number, totalToPaid: number): Observable<Invoice> {
    //const cashPayment = new CashPaymentModel(this.invoice.receiptNumber, payment, this.invoice.total);
    const cashPayment = new CashPaymentModel(this.invoice.receiptNumber, totalToPaid, payment);
    return this.dataStorage.paidByCash(cashPayment);
  }

  debit(payment: number, tip?: number, transferType?: PaymentStatus): Observable<Invoice> {
    const debitPayment = new CreditCardModel(payment, tip, this.invoice.receiptNumber,transferType);
    return this.dataStorage.paidByDeditCard(debitPayment);
  }

  credit(payment: number, tip?: number, transferType?: PaymentStatus): Observable<Invoice> {
    const creditPayment = new CreditCardModel(payment, tip, this.invoice.receiptNumber,transferType);
    return this.dataStorage.paidByCreditCard(creditPayment);
  }

  ebt(payment: number, tip?: number, transferType?: PaymentStatus): Observable<Invoice> {
    const ebtPayment = new CreditCardModel(payment, tip, this.invoice.receiptNumber,transferType);
    return this.dataStorage.paidByEBTCard(ebtPayment);
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
    this.invoice.subTotal = totalComputed.total;
    this.invoice.tax = totalComputed.taxes;
    this.invoice.total = this.invoice.subTotal + this.invoice.tax;*/
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
      if (p.tax !== 0 ) {
        // console.log(subtotal, p.tax);
        tax = p.tax /** subtotal / 100*/;
        taxes += tax;
      }
    });
    // console.log(total, taxes);
    return { total: total, taxes: taxes };
  }

  printLastInvoice() {
    this.dataStorage.printLastInvoice()
      .subscribe(data => data);
  }

  applyDiscountInvoice (discount: number): Observable<Invoice> {
    let idProdOrders = new Array<string>();
    idProdOrders = this.invoiceProductSelected.map(v => v.id);
    console.log('applyDiscountInvoice', this.invoiceProductSelected, idProdOrders);
    return this.dataStorage.applyDiscountInvoice(this.invoice.receiptNumber, discount, idProdOrders);
  }

  addPaidOut(data: string, descrip?: string) {
    return this.dataStorage.addPaidOut(new PaidOut(+data, descrip))
  }

  cancelCheck() {
    this.dataStorage.cancelCheck(this.invoice.receiptNumber).subscribe(
      next=> {
        console.log(next);
        this.resetDigits();
        this.createInvoice();
        this.cashService.resetEnableState();
        },
        err=> {
          console.error(err);
          this.cashService.openGenericInfo('Error', 'Can\'t complete cancel check operation');
      });

  }
}
