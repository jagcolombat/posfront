import { Injectable } from '@angular/core';
import {DepartmentService} from '../services/connection/services/department.service';
import {Observable} from 'rxjs';
import {Department} from '../models/department.model';
import {Product} from '../models/product.model';
import {ProductService} from "../services/connection/services/product.service";
import {InvoiceService} from "../services/connection/services/invoice.service";
import {InvoiceStatus} from "../services/connection/utils/invoice-status.enum";
import {Page} from "../models";
import {HttpParams} from "@angular/common/http";
import {Invoice} from "../models/invoice.model";
import {invoiceStatusToInt} from "../services/connection/utils/invoce.functions";
import {map} from "rxjs/operators";
import {d} from "@angular/core/src/render3";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  deparments: Department[];

  constructor(private departmentService: DepartmentService,
              private productService: ProductService,
              private invoiceService: InvoiceService) { }

  private url = 'http://localhost:5000/api/1.0';

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

  saveInvoiceByStatus(invoice: any, status: InvoiceStatus) {
    console.log(invoice);
    invoice.applicationUserId = 1;
    return this.invoiceService.saveByStatus(this.url, invoice, status);
  }

  getInvoices (): Observable<Invoice[]> {
    return this.invoiceService.getAllWithoutPage(this.url);
  }

  getInvoicesByStatus = (status: InvoiceStatus) => {
    return this.invoiceService.getByStatus(this.url, status);
  }

  getInvoiceById(id: string): Observable<Invoice>  {
    console.log("getInvoiceById", id);
    return this.invoiceService.getById(this.url, id)/*.subscribe(p=> console.log("getById", p))*/;
  }

  getInvoiceNextReceiptNumber() {
    return this.invoiceService.getNextReceiptNumber(this.url);
  }



}
