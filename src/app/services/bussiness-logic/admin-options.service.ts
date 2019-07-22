import {Injectable} from '@angular/core';
import {InvoiceService} from "./invoice.service";
import {CashService} from "./cash.service";
import {ApplyDiscountComponent} from "../../components/presentationals/apply-discount/apply-discount.component";
import {EOperationType} from "../../utils/operation.type.enum";
import {InvoiceStatus} from "../../utils/invoice-status.enum";
import {OperationsService} from "./operations.service";
import {DataStorageService} from "../api/data-storage.service";
import {GenericSalesComponent} from "../../components/presentationals/generic-sales/generic-sales.component";
import {environment} from "../../../environments/environment";
import {AuthService} from "../api/auth.service";
import {AdminConfigComponent} from "../../components/presentationals/admin-config/admin-config.component";
import {AdminOpEnum} from "../../utils/operations/admin-op.enum";
import {CloseBatch} from "../../utils/close.batch.enum";

@Injectable({
  providedIn: 'root'
})
export class AdminOptionsService {

  constructor(private invoiceService: InvoiceService, private cashService: CashService, private auth: AuthService,
              private operationService: OperationsService, private dataStorage: DataStorageService) { }

  applyDiscount(){
    // if(this.invoiceService.invoice.productOrders.length > 0){
      const dialogRef = this.cashService.dialog.open(ApplyDiscountComponent,
        {
          width: '480px', height: '600px', disableClose: true
        })
        .afterClosed().subscribe((data: string) => {
          console.log('apply discount', data);
          this.invoiceService.applyDiscountInvoice(+data).subscribe(next => {
            this.invoiceService.setInvoice(next);
            this.invoiceService.invoiceProductSelected.splice(0);
          }, err => {
            this.cashService.openGenericInfo('Error', 'Can\'t apply discount')
          })
        });
    /*} else {
      this.cashService.openGenericInfo('Error', 'Can\'t apply discount without products')
    }*/

  }

  cancelCheck() {
    /*this.invoiceService.getInvoiceByStatus(EOperationType.CancelCheck, InvoiceStatus.CANCEL)
      .subscribe(next => this.operationService.openDialogInvoices(next, i => {
        this.invoiceService.setInvoice(i);
        this.cashService.reviewEnableState();
        this.operationService.currentOperation = FinancialOpEnum.REVIEW;
      }),err => this.cashService.openGenericInfo('Error', 'Can\'t complete cancel check operation'));*/
    console.log('cancelCheck');
    if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      this.invoiceService.digits ? this.invoiceService.cancelCheck()
        : this.operationService.keyboard(AdminOpEnum.CANCEL_CHECK);
      // this.cashService.openGenericInfo('Error', 'Please input receipt number of check');

    } else {
      console.error('Can\'t complete cancel check operation');
      this.invoiceService.resetDigits();
      this.cashService.openGenericInfo('Error', 'Can\'t complete cancel check operation because check is in progress');
    }
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
      next.unshift({id: "-1", userName: "All employes"});
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
    /*this.dataStorage.getConfiguration().subscribe(next =>  {
      console.log('configOption', next);*/
      this.cashService.dialog.open(AdminConfigComponent,
        {
          width: '480px', height: '600px', disableClose: true, data: {title: 'Configuration'}
        })/*
    }, error1 => {
      this.cashService.openGenericInfo('Error', 'Can\'t complete Configuration operation', error1);
    });*/
  }

  removeAHold() {
    this.invoiceService.getInvoiceByStatus(EOperationType.RemoveHold, InvoiceStatus.IN_HOLD)
      .subscribe(next => {
          this.operationService.openDialogInvoices(next, i => {
            this.invoiceService.removeHoldOrder(i).subscribe(next => console.log(next), err => console.error(err));
          })
      },err => this.cashService.openGenericInfo('Error', 'Can\'t complete remove a hold operation'));
  }

  closeBatch() {
    this.cashService.dialog.open(AdminConfigComponent,
      {
        width: '480px', height: '600px', disableClose: true, data: {title: AdminOpEnum.CLOSE_BATCH}
      }).afterClosed().subscribe(next=> this.dataStorage.closeBatch(next),
        err=> console.error(err));
  }
}
