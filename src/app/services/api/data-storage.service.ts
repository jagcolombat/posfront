import { Injectable } from '@angular/core';
import {DepartmentService} from './department.service';
import {Observable} from 'rxjs';
import {Department} from '../../models/department.model';
import {Product} from '../../models/product.model';
import {ProductService} from './product.service';
import {InvoiceService} from './invoice.service';
import {InvoiceStatus} from '../../utils/invoice-status.enum';
import {Invoice} from '../../models/invoice.model';
import {map} from 'rxjs/operators';
import { Url } from '../../utils/url.path.enum';
import { ProductOrderService } from './product-order.service';
import { PaymentService } from './payment.service';
import { ProductOrder } from 'src/app/models/product-order.model';
import { EOperationType } from 'src/app/utils/operation.type.enum';
import { ICashPayment } from 'src/app/models/cash-payment.model';
import { Journey } from 'src/app/models/journey.model';
import { JourneyService } from './journey.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private departmentService: DepartmentService,
              private productService: ProductService,
              private invoiceService: InvoiceService,
              private productOrderService: ProductOrderService,
              private paymentService: PaymentService,
              private journeyService: JourneyService) { }

  private url = Url.PATH;

  // Departments
  getDepartments(): Observable<Department[]> {
    return this.departmentService.getAll(this.url);
  }

  getProductsByDepartment(department: number): Observable<Product[]> {
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

  saveInvoiceByStatus(invoice: Invoice, status: InvoiceStatus, operationType: EOperationType): Observable<Invoice> {
    console.log(invoice);
    invoice.status = status;
    return this.invoiceService.saveByStatus(this.url, invoice, status, operationType);
  }

  getInvoicesByStatus(status: InvoiceStatus, operationType: EOperationType) {
    return this.invoiceService.getByStatus(this.url, status, operationType);
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

  printInvoices (invoice: Invoice): Observable<Invoice[]> {
    return this.invoiceService.printInvoice(this.url, invoice);
  }

  // ProductOrder

  addProductOrderByInvoice(invoiceId: string, productOrder: ProductOrder, operationType: EOperationType): Observable<any> {
    return this.invoiceService.addProductOrder(this.url, productOrder, invoiceId, operationType);
  }

  deleteProductOrderByInvoice(invoiceId: string, productOrderId: number): Observable<any> {
    return this.invoiceService.deleteProductOrder(this.url, productOrderId, invoiceId);
  }

  // Payment
  paidByCash(cashPayment: ICashPayment): Observable<any> {
    return this.paymentService.paidByCash(this.url, cashPayment);
  }

  // Journey
  registryOperation(journey: Journey): Observable<Invoice> {
    return this.journeyService.registryOperation(this.url, journey);
  }

}
