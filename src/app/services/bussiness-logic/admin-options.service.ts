import { Injectable } from '@angular/core';
import {InvoiceService} from "./invoice.service";
import {CashService} from "./cash.service";
import {ApplyDiscountComponent} from "../../components/presentationals/apply-discount/apply-discount.component";
import {EOperationType} from "../../utils/operation.type.enum";
import {InvoiceStatus} from "../../utils/invoice-status.enum";
import {OperationsService} from "./operations.service";
import {FinancialOpEnum} from "../../utils/operations";

@Injectable({
  providedIn: 'root'
})
export class AdminOptionsService {

  constructor(private invoiceService: InvoiceService, public cashService: CashService, public operationService: OperationsService) { }

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

  cancelCheck() {
    this.invoiceService.getInvoiceByStatus(EOperationType.CancelCheck, InvoiceStatus.CANCEL)
      .subscribe(next => this.operationService.openDialogInvoices(next, i => {
        this.invoiceService.setInvoice(i);
        this.cashService.reviewEnableState();
        this.operationService.currentOperation = FinancialOpEnum.REVIEW;
      }),err => this.cashService.openGenericInfo('Error', 'Can\'t complete cancel check operation'));
  }
}
