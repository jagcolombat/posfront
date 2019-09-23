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
import {Invoice} from "../../models/invoice.model";

@Injectable({
  providedIn: 'root'
})
export class AdminOptionsService {
  private cancelCheckLoaded: boolean;
  private removeHoldLoaded: boolean;

  constructor(private invoiceService: InvoiceService, public cashService: CashService, private auth: AuthService,
              private operationService: OperationsService, private dataStorage: DataStorageService) {

    this.operationService.evCancelCheck.subscribe(next => {
      next ? this.cancelCheck(): this.cancelCheckLoaded=false;
    });

    this.operationService.evRemoveHold.subscribe(next => {
      this.removeHoldLoaded=false;
    });
  }

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
    console.log('cancelCheck');
    this.operationService.currentOperation = AdminOpEnum.CANCEL_CHECK;
    if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      (this.invoiceService.digits || this.cancelCheckLoaded) ?
        this.cancelCheckOp()
        : this.operationService.keyboard(AdminOpEnum.CANCEL_CHECK);
      // this.cashService.openGenericInfo('Error', 'Please input receipt number of check');

    } else {
      console.error('Can\'t complete cancel check operation');
      this.invoiceService.resetDigits();
      this.cashService.openGenericInfo('Error', 'Can\'t complete cancel check operation because check is in progress');
    }
  }

  cancelCheckOp(){
    this.cancelCheckLoaded ?
      this.doCancelCheck():
    this.invoiceService.getInvoicesById(EOperationType.CancelCheck)
      .subscribe(next => {
        this.invoiceService.setInvoice(next);
        this.cancelCheckLoaded= true;
        this.cashService.cancelCheckEnableState();
        //this.operationService.currentOperation = FinancialOpEnum.REVIEW;
      }),err => this.cashService.openGenericInfo('Error', 'Can\'t complete cancel check operation');
  }

  doCancelCheck(){
    this.invoiceService.cancelCheck();
    this.cancelCheckLoaded= false;
  }

  sysZ() {
    this.dataStorage.getPaymentByType().subscribe(next =>  {
      console.log('sysZ', next);
      this.cashService.dialog.open(GenericSalesComponent,
        {
          width: '480px', height: '620px', disableClose: true, data: {title: AdminOpEnum.SYSZ, content: next }
        })
    }, error1 => {
      this.cashService.openGenericInfo('Error', 'Can\'t complete sysZ operation')
    });
  }

  emplZ() {
    this.dataStorage.getApplicationUsers().subscribe(next =>  {
      console.log('emplZ', next);
      next.unshift({id: "-1", userName: "All employees"});
      this.cashService.dialog.open(GenericSalesComponent,
        {
          width: '480px', height: '620px', disableClose: true, data: {title: AdminOpEnum.EMPLZ, empl: next }
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
        }).afterClosed().subscribe(next => {
          if(next){
            console.log('configOption', next);
            this.operationService.inactivityTime = +next;
            this.operationService.resetInactivity(true);
          }
      })/*
    }, error1 => {
      this.cashService.openGenericInfo('Error', 'Can\'t complete Configuration operation', error1);
    });*/
  }

  removeAHold() {
    this.operationService.currentOperation = AdminOpEnum.REMOVE_HOLD;
    if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      if(!this.removeHoldLoaded){
        this.invoiceService.getInvoiceByStatus(EOperationType.RemoveHold, InvoiceStatus.IN_HOLD)
          .subscribe(next => {
            this.operationService.openDialogInvoices(next, i => this.removeHoldOp(i))
          },err => this.cashService.openGenericInfo('Error', 'Can\'t complete remove a hold operation'));
      } else {
        this.removeHoldOp();
      }
    } else {
      this.cashService.openGenericInfo('Error', 'Can\'t complete remove a hold operation because check is in progress');
    }
  }

  removeHoldOp(i?:Invoice){
    console.log('removeHold', i);
    if(this.removeHoldLoaded){
      this.doRemoveHold();
    } else {
      this.invoiceService.setInvoice(i);
      this.removeHoldLoaded= true;
      this.cashService.removeHoldEnableState();
    }
  }

  doRemoveHold(){
    this.invoiceService.removeHoldOrder(this.invoiceService.invoice);
    this.removeHoldLoaded= false;
  }

  closeBatch() {
    this.cashService.dialog.open(AdminConfigComponent,
      {
        width: '750px', height: '600px', disableClose: true, data: {title: AdminOpEnum.CLOSE_BATCH}
      }).afterClosed().subscribe(
        next => {
          if(next){
            this.dataStorage.closeBatch(next).subscribe(
            next => console.log('closeBatch', next),
            err => this.cashService.openGenericInfo('Error','Can\'t complete close batch operation'))
          };
        },err=> console.error(err));
  }

  doDayClose() {
    this.dataStorage.dayClose().subscribe(
      next => {
        console.log("Day Close");
        this.cashService.openGenericInfo('Day Close', 'Complete day close operation');
      },
      err => this.cashService.openGenericInfo('Error', 'Can\'t complete day close operation')
    );
    this.removeHoldLoaded= false;
  }
}
