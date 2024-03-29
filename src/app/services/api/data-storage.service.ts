import { Injectable } from '@angular/core';
import {DepartmentService} from './department.service';
import {Observable} from 'rxjs';
import {Department} from '../../models/department.model';
import {Product} from '../../models/product.model';
import {ProductService} from './product.service';
import {InvoiceService} from './invoice.service';
import {Invoice} from '../../models/invoice.model';
import { baseURL } from '../../utils/url.path.enum';
import { PaymentService } from './payment.service';
import { ProductOrder } from 'src/app/models/product-order.model';
import { EOperationType } from 'src/app/utils/operation.type.enum';
import { ICashPayment } from 'src/app/models/cash-payment.model';
import { Journey } from 'src/app/models/journey.model';
import { JourneyService } from './journey.service';
import {CreditCard, User, Payment, CardManualPayment, Credentials, Station} from 'src/app/models';
import { ConfigurationService } from './configuration.service';
import { Configuration } from 'src/app/models/configuration.model';
import { AdminOperationService } from './admin.operation.service';
import { PaidOut } from 'src/app/models/paid-out.model';
import { InvoiceStatus } from 'src/app/utils/invoice-status.enum';
import { CloseBatch } from 'src/app/utils/close.batch.enum';
import { Report } from 'src/app/models/report.model';
import {OrderService} from './order.service';
import {Order} from '../../models/order.model';
import {Table} from '../../models/table.model';
import {ETransferType} from '../../utils/transfer-type.enum';
import {EApplyDiscount} from '../../utils/apply-discount.enum';
import {EmployeedModel, IPositionModel} from '../../models/employeed.model';
import {ClientService} from './client.service';
import {ClientModel} from '../../models/client.model';
import {PaymentMethodEnum} from '../../utils/operations/payment-method.enum';
import {CheckPayment} from '../../models/check.model';
import {ITransferPayment, TransferPayment} from '../../models/transfer.model';
import {GiftCardModel, IGiftCardPaymentModel, IGiftModel} from '../../models/gift-card.model';
import {EClockType} from '../../utils/clock-type.enum';
import {UserClock} from '../../models/user-clock.model';
import {WorkerRecords} from '../../models/worker-records';
import {StationService} from './station.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  disableOp = false;

  private url = baseURL;

  constructor(private departmentService: DepartmentService,
              private productService: ProductService,
              private invoiceService: InvoiceService,
              private orderService: OrderService,
              private paymentService: PaymentService,
              private journeyService: JourneyService,
              private configurationService: ConfigurationService,
              private adminOperationService: AdminOperationService,
              private clientService: ClientService,
              private stationService: StationService) { }

  // Departments
  getDepartments(): Observable<Department[]> {
    return this.departmentService.getAll(this.url);
  }

  getProductsByDepartment(department: string, pageNumber?: number, pageSize?: number): Observable<Product[]> {
    return this.departmentService.getProductByDepartment(this.url, department, pageNumber, pageSize).pipe();
  }

  getSubDepartments(id): Observable<Department[]> {
    return this.departmentService.getSubDepartments(this.url, id);
  }

  // Products
  getProductByUpc(upc: string, typeOp: EOperationType): Observable<Product[]> {
    // return this.productService.getProductByUpc(this.url, upc, typeOp).pipe(map(p => p[0]));
    return this.productService.getProductByUpc(this.url, upc, typeOp).pipe();
  }

  getProductsByUpc(upc: string, typeOp: EOperationType, pageNumber?: number, pageSize?: number): Observable<Product[]> {
    return this.productService.getProductByUpc(this.url, upc, typeOp, pageNumber, pageSize).pipe();
  }

  updateProductByUpc(upc: string, price: string, id: string): Observable<Product[]> {
    return this.productService.updateProductByUpc(this.url, upc, price, id).pipe();
  }

  // Invoice
  createInvoice(): Observable<Invoice> {
    return this.invoiceService.create(this.url);
  }

  changeInvoiceToHold(invoice: Invoice): Observable<Invoice> {
    console.log(invoice);
    return this.invoiceService.changeInvoiceToHold(this.url, invoice);
  }

  changeInvoiceToVoid(invoice: Invoice, isRefund = false): Observable<Invoice> {
    console.log(invoice);
      return this.invoiceService.changeInvoiceToVoid(this.url, invoice);
  }

  changeInvoiceToRemoveHold(invoice: Invoice): Observable<any> {
    console.log(invoice);
      return this.invoiceService.changeInvoiceToRemoveHold(this.url, invoice);
  }

  /*getInvoiceInHold() {
    return this.invoiceService.getInvoiceByStatus(this.url, 'inHold');
  }

  getInvoiceCancelled() {
    return this.invoiceService.getInvoiceByStatus(this.url, 'cancel');
  }*/

  getInvoiceByStatus(status: InvoiceStatus) {
    return this.invoiceService.getInvoiceByStatus(this.url, status);
  }

  getInvoiceById(id: string, operationType: EOperationType): Observable<Invoice>  {
    console.log('getInvoiceById', id);
    return this.invoiceService.getById(this.url, id, operationType);
  }

  getByDateRange(fromDate: Date, toDate: Date, pageNumber: number, pageSize: number) {
    return this.invoiceService.getByDateRange(this.url, fromDate, toDate, pageNumber, pageSize);
  }

  getInvoices (): Observable<Invoice[]> {
    return this.invoiceService.getAllWithoutPage(this.url);
  }

  getInvoiceByIdRefund (id: string): Observable<Invoice> {
    return this.invoiceService.getInvoiceByIdRefund(this.url, id);
  }

  printInvoices (invoice: Invoice): Observable<Invoice[]> {
    return this.invoiceService.printInvoice(this.url, invoice);
  }

  printLastInvoice (): Observable<any> {
    return this.invoiceService.printLastInvoice(this.url);
  }

  updateInvoice (invoice: Invoice, property: string, value: any) {
    return this.invoiceService.updateInvoice(this.url, invoice, property, value);
  }

  recallCheck (id: string): Observable<Invoice> {
    return this.invoiceService.recallCheck(this.url, id);
  }

  cancelCheck (id: string): Observable<Invoice> {
    return this.invoiceService.cancelCheck(this.url, id);
  }

  // ProductOrder

  addProductOrderByInvoice(invoiceId: string, productOrder: ProductOrder, operationType: EOperationType,
                             isRefund = false): Observable<Invoice> {
      return this.invoiceService.addProductOrder(this.url, productOrder, invoiceId, operationType, isRefund);

  }

  deleteProductOrderByInvoice(invoiceId: string, productOrderId: string, isRefund = false): Observable<Invoice> {
      return this.invoiceService.deleteProductOrder(this.url, productOrderId, invoiceId);
  }

  deleteProductOrdersByInvoice(invoiceId: string, productOrders: ProductOrder[], isRefund = false): Observable<Invoice> {
      return this.invoiceService.deleteProductOrders(this.url, productOrders, invoiceId);
  }

  applyDiscountInvoice (id: string, discount: number, productOrderIds: Array<string>, discountType: EApplyDiscount): Observable<Invoice> {
    return this.invoiceService.applyDiscountInvoice(this.url, id, discount, productOrderIds, discountType);
  }

  subtotalInvoice(receiptNumber: string): Observable<Invoice> {
    return this.invoiceService.subtotalInvoice(this.url, receiptNumber);
  }

  fsSubtotalInvoice(receiptNumber: string): Observable<Invoice> {
    return this.invoiceService.fsSubtotalInvoice(this.url, receiptNumber);
  }

  // Payment
  paidByCash(cashPayment: ICashPayment): Observable<any> {
    return this.paymentService.paidByCash(this.url, cashPayment);
  }

  paidByCreditCard(cashPayment: CreditCard): Observable<any> {
    return this.paymentService.paidByCreditCard(this.url, cashPayment);
  }

  paidByDeditCard(cashPayment: CreditCard): Observable<any> {
    return this.paymentService.paidByDebitCard(this.url, cashPayment);
  }

  paidByEBTCard(cashPayment: CreditCard, type: number): Observable<any> {
    return this.paymentService.paidByEBTCard(this.url, cashPayment, type);
  }

  paidByCheck(check: CheckPayment): Observable<any> {
    return this.paymentService.paidByCheck(this.url, check);
  }

  paidByExternalCard(externalPayment: CardManualPayment, paymentMethod?: PaymentMethodEnum): Observable<any> {
    return this.paymentService.paymentExternalCardReader(this.url, externalPayment, paymentMethod);
  }

  getPaymentMedia(): Observable<any> {
    return this.paymentService.getPaymentMedia(this.url);
  }

  paidByGift(receiptNumber: string, gift: IGiftCardPaymentModel): Observable<any> {
    return this.paymentService.paidByGift(this.url, receiptNumber, gift);
  }

  paidByTransfer(transfer: ITransferPayment): Observable<any> {
    return this.paymentService.paidByTransfer(this.url, transfer);
  }

  // Journey
  registryOperation(journey: Journey): Observable<any> {
    return this.journeyService.registryOperation(this.url, journey);
  }

  // Configuration
  getConfiguration(): Observable<Configuration> {
    return this.configurationService.getAll(this.url);
  }

  setConfiguration(config: Configuration): Observable<Configuration> {
    return this.configurationService.setAll(this.url, config);
  }

  // Admin Operations
  getApplicationUsers(): Observable<User[]> {
    return this.adminOperationService.getApplicationUsers(this.url);
  }

  getUsersPosition(): Observable<IPositionModel[]> {
    return this.adminOperationService.getUsersPosition(this.url);
  }

  addPaidOut(paidOut: PaidOut): Observable<any> {
    return this.adminOperationService.addPaidOut(this.url, paidOut);
  }

  getInvoiceByUser(id: string): Observable<Invoice[]> {
    return this.adminOperationService.getInvoiceByUser(this.url, id);
  }

  getPaymentByType(): Observable<Payment[]> {
    return this.adminOperationService.getPaymentByType(this.url);
  }

  printInvoiceByUser(id: string): Observable<any> {
    return this.adminOperationService.printInvoiceByUser(this.url, id);
  }

  printPaymentByType(): Observable<any> {
    return this.adminOperationService.printPaymentByType(this.url);
  }

  closeBatch(closeBatch: CloseBatch): Observable<any> {
    return this.adminOperationService.closeBatch(this.url, closeBatch);
  }

  getCloseBatchReport(closeBatch: CloseBatch): Observable<Report> {
    return this.adminOperationService.getCloseBatchReport(this.url, closeBatch);
  }

  // Order
  getOrder(inv: string) {
    return this.orderService.getByInvoice(this.url, inv);
  }


  updateOrder(order: Order): Observable<Order> {
    return this.orderService.update(this.url, order);
  }

  getTables(): Observable<Table[]> {
    return this.orderService.getTables(this.url);
  }

  // Report
  dayClose(close: boolean, date?: any) {
    const result = (date !== null && date !== undefined) ?
      this.adminOperationService.getDayClose(this.url, close, date.from) :
      this.adminOperationService.getDayClose(this.url, close);
    return result;
  }

  cashierClose(close: boolean, emp: string, date?: any) {
    const result = (date !== null && date !== undefined) ?
      this.adminOperationService.cashierCloseShift(this.url, close, emp, date.from) :
      this.adminOperationService.cashierCloseShift(this.url, close, emp);
    return result;
  }

  weeklyClosePrint(close?: boolean, from?: any, to?: any) {
    return this.adminOperationService.getWeeklyClosePrint(this.url, close, from, to);
  }

  getInvoiceByTransferType(authPending: EOperationType, auth: ETransferType) {
    return this.invoiceService.getInvoiceByTransferType(this.url, auth);
  }

  setUserToInvoice(invoiceId, userId): Observable<Invoice> {
    return this.invoiceService.setUser(this.url, invoiceId, userId);
  }

  // Other
  notSale(): Observable<any> {
    return this.adminOperationService.notSale(this.url);
  }

  inquiryEBTCard() {
    return this.paymentService.ebtInquiry(this.url);
  }

  weightItem(receiptNumber: string, price: number, weight?: number): Observable<Invoice> {
    return this.invoiceService.weightItem(this.url, receiptNumber, price, weight);
  }

  employSetup(employee: EmployeedModel) {
    return this.adminOperationService.employSetup(this.url, employee);
  }

  employClock(credentials: Credentials, clockType?: EClockType): Observable<UserClock> {
    return this.adminOperationService.employClock(this.url, credentials, clockType);
  }

  // Clients
  clientSetup(client: ClientModel) {
    return this.clientService.setClient(this.url, client);
  }

  getClientById(id: string) {
    return this.clientService.getClientById(this.url, id);
  }

  getClients() {
    return this.clientService.getClients(this.url);
  }

  acctCharge(c: string, amount: number, receiptNumber: string) {
    return this.clientService.acctCharge(this.url, c, amount, receiptNumber);
  }

  acctPayment(client: string, payment: CardManualPayment | CheckPayment | TransferPayment, paymentMethod?: PaymentMethodEnum) {
    return this.clientService.acctPayment(this.url, client, payment, paymentMethod);
  }

  clearInvoice(receiptNumber: string): Observable<Invoice> {
    return this.invoiceService.clearInvoice(this.url, receiptNumber);
  }

  printAcctBalance(client: string): Observable<any> {
    return this.clientService.printAcctBalance(this.url, client);
  }

  updateCreditLimit(client: string, credit: number) {
    return this.clientService.setCredit(this.url, client, credit);
  }

  setGiftCard(gift: IGiftModel): Observable<any> {
    return this.clientService.giftCard(this.url, gift);
  }

  validGiftCard(client: string, card: GiftCardModel): Observable<any> {
    return this.clientService.validGiftCard(this.url, client, card);
  }

  refundSale(receiptNumber: string) {
    return this.invoiceService.refundSale(this.url, receiptNumber);
  }

  getWorkerRecordsByUser(id: string, date: string): Observable<WorkerRecords[]> {
    return this.adminOperationService.getWorkerRecordsByUser(this.url, id, date);
  }

  getTimeWorkedByUser(id: string, date: string): Observable<string> {
    return this.adminOperationService.getTimeWorkedByUser(this.url, id, date);
  }
  // Stations
  getStationsStatus(): Observable<Array<Station>> {
    return this.stationService.getStatus(this.url);
  }
}
