import {EventEmitter, Injectable, Output} from '@angular/core';
import {AuthService} from "../api/auth.service";
import {ProductOrder} from "../../models/product-order.model";
import {DataStorageService} from "../api/data-storage.service";
import {BehaviorSubject, Observable} from "rxjs";
import {CardManualPayment, CreditCardModel, Product, SwipeMethod} from "../../models";
import {InvoiceStatus} from "../../utils/invoice-status.enum";
import {Invoice} from "../../models/invoice.model";
import {map} from "rxjs/operators";
import {EOperationType} from "../../utils/operation.type.enum";
import {CashPaymentModel} from "../../models/cash-payment.model";
import {CashService} from "./cash.service";
import {PaidOut} from "../../models/paid-out.model";
import {PaymentStatus} from "../../utils/payment-status.enum";
import {Client, Order, OrderType} from "../../models/order.model";
import {ETXType} from "../../utils/delivery.enum";
import {Table} from "../../models/table.model";
import {PaymentOpEnum} from 'src/app/utils/operations';
import {EApplyDiscount} from "../../utils/apply-discount.enum";
import {CardTypes} from "../../utils/card-payment-types.enum";
import {PaymentMethodEnum} from "../../utils/operations/payment-method.enum";
import {CheckPayment} from "../../models/check.model";
import {TransferPayment} from "../../models/transfer.model";
import {InformationType} from "../../utils/information-type.enum";
import {GiftCardPayment} from "../../models/gift-card.model";

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
  priceWic: string;

  @Output() evAddProd = new EventEmitter<ProductOrder>();
  @Output() evDelProd = new EventEmitter<any>();
  @Output() evDelAllProds = new EventEmitter<any>();
  @Output() evNumpadInput = new EventEmitter<any>();
  @Output() evAddProdByUPC = new EventEmitter<any>();
  @Output() evChkPriceProdByUPC = new EventEmitter<any>();
  @Output() evUpdateTotals = new EventEmitter<any>();
  @Output() evUpdateProds = new EventEmitter<ProductOrder[]>();
  evCreateInvoice = new BehaviorSubject<boolean>(true);
  lastProdAdd: ProductOrder;

  constructor(public authService: AuthService, private dataStorage: DataStorageService, public cashService: CashService) {
    //this.setSystemConfig();
  }

  getCashier(): string {
    return this.cashier = (this.authService.token && this.authService.token.username) ? this.authService.token.username : '';
    //return this.cashier = (localStorage.getItem('userName')) ? localStorage.getItem('userName') : ''
  }

  getUserId(): string {
    return (this.authService.token && this.authService.token.user_id) ? this.authService.token.user_id : '';
    //return this.cashier = (localStorage.getItem('userName')) ? localStorage.getItem('userName') : ''
  }

  createInvoice(){
      this.resetDigits();
      this.dataStorage.createInvoice().subscribe(next => {
        console.info('createCheck successfull', next);
        this.receiptNumber = next.receiptNumber;
        this.invoice = <Invoice> next;
        this.isReviewed = false;
        this.evDelAllProds.emit();
        this.lastProdAdd = null;
        this.setTotal();
        this.evCreateInvoice.next(true);
      }, err => {
        console.error('createCheck failed');
        this.cashService.openGenericInfo('Error', err).afterClosed().subscribe(
          next => {
            this.evCreateInvoice.next(false);
          }
        );
      });
  }

  addProductOrder(po: ProductOrder){
    // Update invoice on database
    this.dataStorage.addProductOrderByInvoice(this.invoice.receiptNumber, po, EOperationType.Add, this.invoice.isRefund)
      .subscribe(next => {
      console.log('addProductOrder-next', next);
      (next.productOrders.length > 0 /*&& next.total >= this.invoice.total*/) ?
        //this.setInvoice(next):
        (next.isRefund)? this.setInvoice(next): this.addPO2Invoice(next):
        this.showErr('The invoice hasn\'t products', next);
    }, err => {
      this.showErr(err);
    });
  }

  private showErr(err: any, i?: Invoice){
    console.error('addProductOrder', err);
    // this.delPOFromInvoice(po);
    this.resetDigits();
    (i && i.status === InvoiceStatus.CREATED) ? this.warnInvoicePaid() : this.cashService.openGenericInfo('Error', err);
  }

  warnInvoicePaid(){
    console.log('this invoice is paid', this.invoice);
    this.cashService.openGenericInfo(InformationType.INFO, 'The invoice was paid');
    this.createInvoice();
    this.cashService.resetEnableState();
  }

  updateClientAge(clientAge: number) {
    this.invoice.clientAge = clientAge;
    this.dataStorage.updateInvoice(this.invoice, 'clientAge', clientAge)
    .subscribe( data => console.log(data), err => console.log(err) );
  }

  addPO2Invoice(inv: Invoice){
    this.invoice.status = inv.status;
    this.invoice.paymentStatus = inv.paymentStatus;
    this.invoice.productOrders.push(inv.productOrders[0]);
    this.lastProdAdd = inv.productOrders[0];
    this.updateTotals(inv);
    this.evAddProd.emit(inv.productOrders[0]);
    this.resetDigits();
  }

  updateTotals(inv: Invoice){
    this.invoice.subTotal = inv.subTotal;
    this.invoice.tax = inv.tax;
    this.invoice.total = inv.total;
    this.invoice.fsTotal = inv.fsTotal;
    this.invoice.balance = inv.balance;
    this.setTotal();
  }

  delPOFromInvoice(po: ProductOrder[]): Observable<any> {
    /*const productOrdersIds = po.map(prodOrder => {
      return prodOrder.id;
    });*/

    return this.dataStorage.deleteProductOrdersByInvoice(this.invoice.receiptNumber, po, this.invoice.isRefund);
  }

  addProductByUpc(typeOp: EOperationType): Observable<Product[]> {
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

  getProductByUpc(typeOp: EOperationType): Observable<Product[]>{
    return this.dataStorage.getProductByUpc(this.numbers, typeOp);
  }

  updateProductsPrice(upc: string, price: string, id: string){
    return this.dataStorage.updateProductByUpc(upc, price, id);
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

  cash(payment: number, totalToPaid: number, type: PaymentOpEnum = PaymentOpEnum.CASH): Observable<Invoice> {
    //const cashPayment = new CashPaymentModel(this.invoice.receiptNumber, payment, this.invoice.total);
    const cashPayment = new CashPaymentModel(this.invoice.receiptNumber, totalToPaid, payment, type);
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

  creditManual(payment: number, tip?: number, ccnumber?: string, cvv?: string, ccdate?: string, zip?: string,
               street?: string): Observable<Invoice> {
    const creditPayment = new CreditCardModel(payment, tip, this.invoice.receiptNumber,PaymentStatus.SAlE, ccnumber, cvv,
      ccdate, SwipeMethod.MANUAL, zip, street);
    return this.dataStorage.paidByCreditCard(creditPayment);
  }

  ebt(payment: number, type?: number, tip?: number, transferType?: PaymentStatus): Observable<Invoice> {
    const ebtPayment = new CreditCardModel(payment, tip, this.invoice.receiptNumber,transferType);
    return this.dataStorage.paidByEBTCard(ebtPayment, type);
  }

  ebtInquiry() {
    return this.dataStorage.inquiryEBTCard();
  }

  externalCard(payment: number, accountNumber?: string, authCode?: string, cardType?: string | CardTypes, client?: any,
               paymentMethod?: PaymentMethodEnum): Observable<Invoice> {
    const cardPayment = new CardManualPayment(payment, PaymentStatus.SAlE, this.invoice.receiptNumber, accountNumber,
      authCode, cardType);
    return (client)? this.dataStorage.acctPayment(client, cardPayment,PaymentMethodEnum.CREDIT_CARD) :
      this.dataStorage.paidByExternalCard(cardPayment, paymentMethod);
  }

  getExternalCadTypes(): Observable<any>{
    return this.dataStorage.getPaymentMedia();
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
      .subscribe(data => data, error1 => {
        this.cashService.openGenericInfo(InformationType.ERROR, error1);
      });
  }

  applyDiscountInvoice (discount: number, type?: EApplyDiscount): Observable<Invoice> {
    let idProdOrders = new Array<string>();
    idProdOrders = this.invoiceProductSelected.map(v => v.id);
    console.log('applyDiscountInvoice', this.invoiceProductSelected, idProdOrders);
    console.log('applyDiscountType', discount, type);
    return this.dataStorage.applyDiscountInvoice(this.invoice.receiptNumber, discount, idProdOrders, type);
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

  setDineIn(table: Table): Observable<Order> {
    let createOrder = (table) => new Order(this.invoice.id, new OrderType(ETXType.DINEIN, null, table));
    return this.dataStorage.updateOrder(createOrder(table));
  }

  setRetail(): Observable<Order> {
    let createOrder = () => new Order(this.invoice.id, new OrderType(ETXType.RETAIL, null, null));
    return this.dataStorage.updateOrder(createOrder());
  }

  setPickUp(data: string, text: any, descrip?): Observable<Order> {
    let createOrder = (name, tel) => new Order(this.invoice.id, new OrderType(ETXType.PICKUP, new Client(name, tel),null, descrip));
    return this.dataStorage.updateOrder(createOrder(data, text));
  }

  setDelivery(name, address, phone, descrip?): Observable<Order> {
    let createOrder = (name, address, phone, descrip) => {
      return new Order(this.invoice.id, new OrderType(ETXType.DELIVERY, new Client(name, phone, address),null, descrip));
    };
    return this.dataStorage.updateOrder(createOrder(name, address, phone, descrip));
  }

  tables(): Observable<Table[]> {
    return this.dataStorage.getTables();
  }

  setUser(userId):Observable<Invoice> {
    return this.dataStorage.setUserToInvoice(this.invoice.receiptNumber, userId);
  }

  notSale(): Observable<any> {
    return this.dataStorage.notSale();
  }

  weightItem(price: number, weight?: number): Observable<Invoice> {
    return this.dataStorage.weightItem(this.invoice.receiptNumber, price, weight);
  }

  acctCharge(c: string, amount: number): Observable<Invoice> {
    return this.dataStorage.acctCharge(c, amount, this.receiptNumber);
  }

  acctPaymentCash(client, amount){
    let cashPayment = new CardManualPayment(amount, null, null, null, null, null);
    return this.dataStorage.acctPayment(client, <CardManualPayment>cashPayment, PaymentMethodEnum.CASH);
  }

  subTotal(): Observable<Invoice>{
    return this.dataStorage.subtotalInvoice(this.receiptNumber);
  }

  fsSubTotal(): Observable<Invoice>{
    return this.dataStorage.fsSubtotalInvoice(this.receiptNumber);
  }

  clear(): Observable<Invoice>{
    return this.dataStorage.clearInvoice(this.receiptNumber);
  }

  paidByCheck(amount: number, checkNumber: string, descrip?: string, client?: string): Observable<Invoice> {
    const checkPayment = new CheckPayment(this.invoice.receiptNumber, amount, checkNumber, descrip);
    return (client)? this.dataStorage.acctPayment(client, checkPayment, PaymentMethodEnum.CHECK) :
      this.dataStorage.paidByCheck(checkPayment);

  }

  acctPaymentTransfer(client: string, amount: any, descrip: any) {
    const transferPayment = new TransferPayment(amount, descrip);
    return this.dataStorage.acctPayment(client, transferPayment, PaymentMethodEnum.TRANSFER);
  }

  printAcctBalance(client: string): Observable<any> {
    return this.dataStorage.printAcctBalance(client);
  }

  paidByGift(amount: number, card: string): Observable<Invoice> {
    const giftCardPayment = new GiftCardPayment(amount, card);
    return this.dataStorage.paidByGift(this.receiptNumber, giftCardPayment);
  }

  paidByTransfer(amount: number, descrip: string): Observable<Invoice> {
    const transferPayment = new TransferPayment(amount, descrip, this.receiptNumber);
    return this.dataStorage.paidByTransfer(transferPayment);
  }

  allowAddProductByStatus() {
    const allowStatus = [InvoiceStatus.IN_PROGRESS, InvoiceStatus.CREATED, InvoiceStatus.IN_HOLD]
    return (allowStatus.includes(this.invoice.status)) ? true : false;
  }
}
