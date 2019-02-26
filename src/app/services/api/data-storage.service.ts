import { Injectable } from '@angular/core';
import {DepartmentService} from './department.service';
import {Observable} from 'rxjs';
import {Department} from '../../models/department.model';
import {Product} from '../../models/product.model';
import {ProductService} from './product.service';
import {InvoiceService} from './invoice.service';
import {Invoice} from '../../models/invoice.model';
import {map} from 'rxjs/operators';
import { baseURL } from '../../utils/url.path.enum';
import { PaymentService } from './payment.service';
import { ProductOrder } from 'src/app/models/product-order.model';
import { EOperationType } from 'src/app/utils/operation.type.enum';
import { ICashPayment } from 'src/app/models/cash-payment.model';
import { Journey } from 'src/app/models/journey.model';
import { JourneyService } from './journey.service';
import { CreditCard } from 'src/app/models';
import { InvoiceRefundService } from './invoice.refund.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  disableOp = false;

  private url = baseURL;

  constructor(private departmentService: DepartmentService,
              private productService: ProductService,
              private invoiceService: InvoiceService,
              private paymentService: PaymentService,
              private journeyService: JourneyService,
              private invoiceRefundService: InvoiceRefundService) { }

  // Departments
  getDepartments(): Observable<Department[]> {
    return this.departmentService.getAll(this.url);
  }

  getProductsByDepartment(department: string): Observable<Product[]> {
    return this.departmentService.getProductByDepartment(this.url, department).pipe();
  }

  // Products
  getProductByUpc(upc: string, typeOp: EOperationType): Observable<Product> {
    return this.productService.getProductByUpc(this.url, upc, typeOp).pipe(map(p => p[0]));
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
    if (!isRefund) {
      return this.invoiceService.changeInvoiceToVoid(this.url, invoice);
    } else {
      return this.invoiceRefundService.changeInvoiceToVoid(this.url, invoice);
    }
  }

  getInvoiceInHold() {
    return this.invoiceService.getInvoiceInHold(this.url);
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

  // ProductOrder

  addProductOrderByInvoice(invoiceId: string, productOrder: ProductOrder, operationType: EOperationType,
                             isRefund = false): Observable<Invoice> {
    if (!isRefund) {
      return this.invoiceService.addProductOrder(this.url, productOrder, invoiceId, operationType);
    } else {
      return this.invoiceRefundService.addProductOrder(this.url, productOrder, invoiceId, operationType);
    }
  }

  deleteProductOrderByInvoice(invoiceId: string, productOrderId: string, isRefund = false): Observable<Invoice> {
    if (!isRefund) {
      return this.invoiceService.deleteProductOrder(this.url, productOrderId, invoiceId);
    } else {
      return this.invoiceRefundService.deleteProductOrder(this.url, productOrderId, invoiceId);
    }
  }

  // Payment
  paidByCash(cashPayment: ICashPayment): Observable<any> {
    return this.paymentService.paidByCash(this.url, cashPayment);
  }

  paidByCreditCard(cashPayment: CreditCard): Observable<any> {
    return this.paymentService.paidByCreditCard(this.url, cashPayment);
  }

  paidByDeditCard(cashPayment: CreditCard): Observable<any> {
    return this.paymentService.paidByCreditCard(this.url, cashPayment);
  }

  paidByEBTCard(cashPayment: CreditCard): Observable<any> {
    return this.paymentService.paidByEBTCard(this.url, cashPayment);
  }

  // Journey
  registryOperation(journey: Journey): Observable<Invoice> {
    return this.journeyService.registryOperation(this.url, journey);
  }

}
