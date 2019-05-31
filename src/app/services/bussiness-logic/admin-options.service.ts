import { Injectable } from '@angular/core';
import {InvoiceService} from "./invoice.service";
import {CashService} from "./cash.service";
import {ApplyDiscountComponent} from "../../components/presentationals/apply-discount/apply-discount.component";
import {EOperationType} from "../../utils/operation.type.enum";
import {InvoiceStatus} from "../../utils/invoice-status.enum";
import {OperationsService} from "./operations.service";
import {FinancialOpEnum} from "../../utils/operations";
import {PaidOutComponent} from "../../components/presentationals/paid-out/paid-out.component";
import {DataStorageService} from "../api/data-storage.service";
import {GenericSalesComponent} from "../../components/presentationals/generic-sales/generic-sales.component";
import {environment} from "../../../environments/environment";
import {AuthService} from "../api/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AdminOptionsService {

  constructor(private invoiceService: InvoiceService, private cashService: CashService, private auth: AuthService,
              private operationService: OperationsService, private dataStorage: DataStorageService) { }

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

  sysZ() {
    this.dataStorage.getPaymentByType().subscribe(next =>  {
      console.log('sysZ', next);
      this.cashService.dialog.open(GenericSalesComponent,
        {
          width: '480px', height: '600px', disableClose: true, data: {title: 'SYS Z', content: next }
        })
    }, error1 => {
      this.cashService.openGenericInfo('Error', 'Can\'t complete sysZ operation')
    });
  }

  emplZ() {
    this.dataStorage.getApplicationUsers().subscribe(next =>  {
      console.log('emplZ', next);
      this.cashService.dialog.open(GenericSalesComponent,
        {
          width: '480px', height: '600px', disableClose: true, data: {title: 'EMPL Z', empl: next }
        })
    }, error1 => {
      this.cashService.openGenericInfo('Error', 'Can\'t complete emplZ operation')
    });
  }

  systemVersion() {
    this.cashService.openGenericInfo('System Version', environment.version);
  }

  backToUser() {
    this.auth.restoreInitialLogin();
    this.invoiceService.getCashier();
  }

  configOption() {
    this.dataStorage.getConfiguration().subscribe(next =>  {
      console.log('configOption', next);
      /*this.cashService.dialog.open(GenericSalesComponent,
        {
          width: '480px', height: '600px', disableClose: true, data: {title: 'EMPL Z', empl: next }
        })*/
    }, error1 => {
      this.cashService.openGenericInfo('Error', 'Can\'t complete Configuration operation', error1);
    });
  }
}
