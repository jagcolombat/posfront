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

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private departmentService: DepartmentService,
              private productService: ProductService,
              private invoiceService: InvoiceService) { }

  private url = Url.PATH;

  getDepartments(): Observable<Department[]> {
    return this.departmentService.getAll(this.url);
  }

  getProductsByDepartment(department: number): Observable<Product[]> {
    return this.departmentService.getProductByDepartment(this.url, department).pipe();
  }

  getProductByUpc(upc: number): Observable<Product> {
    return this.productService.getProductByUpc(this.url, upc).pipe(map(p => p[0]));
  }

  saveInvoice( invoice: Invoice) {
    // invoice.applicationUserId = 1;
    console.log(invoice);
    return this.invoiceService.save(this.url, invoice);
  }

  saveInvoiceByStatus(invoice: Invoice, status: InvoiceStatus): Observable<Invoice> {
    console.log(invoice);
    invoice.status = status;
    invoice.applicationUserId = 1;
    return this.invoiceService.saveByStatus(this.url, invoice, status);
  }

  getInvoices (): Observable<Invoice[]> {
    return this.invoiceService.getAll(this.url);
  }

  getInvoicesByStatus = (status: InvoiceStatus) => {
    return this.invoiceService.getByStatus(this.url, status);
  }

  getInvoiceById(id: string): Observable<Invoice>  {
    console.log('getInvoiceById', id);
    return this.invoiceService.getById(this.url, id)/*.subscribe(p=> console.log("getById", p))*/;
  }

  getInvoiceNextReceiptNumber() {
    return this.invoiceService.getNextReceiptNumber(this.url);
  }

  deleteProductOrderByInvoice(invoiceId: number, productOrderId: number): Observable<Invoice> {
    return this.invoiceService.deleteProductOrderByInvoice(this.url, invoiceId, productOrderId);
  }

}
