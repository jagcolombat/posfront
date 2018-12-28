import { Injectable } from '@angular/core';
import {InvoiceService} from "./invoice.service";

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  constructor(private invoiceService: InvoiceService) { }

  clear() {
    console.log('clear');
    this.invoiceService.evDelProd.emit(true);
  }

  void() {
    console.log('void');
    this.invoiceService.evDelAllProds.emit(true);
  }
}
