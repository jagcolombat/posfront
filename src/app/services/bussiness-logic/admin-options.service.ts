import { Injectable } from '@angular/core';
import {InvoiceService} from "./invoice.service";
import {CashService} from "./cash.service";
import {ApplyDiscountComponent} from "../../components/presentationals/apply-discount/apply-discount.component";

@Injectable({
  providedIn: 'root'
})
export class AdminOptionsService {

  constructor(private invoiceService: InvoiceService, public cashService: CashService) { }

  applyDiscount(){
    const dialogRef = this.cashService.dialog.open(ApplyDiscountComponent,
      {
        width: '480px', height: '600px', disableClose: true
      })
      .afterClosed().subscribe((data: string) => {
        console.log('apply discount', data);
        this.invoiceService.applyDiscountInvoice(+data).subscribe(next => {
          this.invoiceService.setInvoice(next);
        }, err => {
          this.cashService.openGenericInfo('Error', 'Can\'t apply discount')
        })
      });
  }
}
