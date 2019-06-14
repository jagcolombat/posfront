import {Injectable} from '@angular/core';
import {InvoiceService} from "./invoice.service";
import {Router} from "@angular/router";
import {AuthService} from "../api/auth.service";
import {DialogLoginComponent} from "../../components/containers/dialog-login/dialog-login.component";
import {Invoice} from "../../models/invoice.model";
import {DialogInvoiceComponent} from "../../components/presentationals/dialog-invoice/dialog-invoice.component";
import {CashOpComponent} from "../../components/presentationals/cash-op/cash-op.component";
import {CashPaymentComponent} from "../../components/presentationals/cash-payment/cash-payment.component";
import {InvoiceStatus} from "../../utils/invoice-status.enum";
import {EOperationType} from "../../utils/operation.type.enum";
import {CashService} from "./cash.service";
import {Token} from "../../models";
import {FinancialOpEnum, InvioceOpEnum, PaymentOpEnum, TotalsOpEnum} from "../../utils/operations";
import {HttpErrorResponse} from '@angular/common/http';
import {GenericInfoEventsComponent} from "../../components/presentationals/generic-info-events/generic-info-events.component";
import {PaidOutComponent} from "../../components/presentationals/paid-out/paid-out.component";
import {DialogPaidoutComponent} from "../../components/containers/dialog-paidout/dialog-paidout.component";

@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  inactivityTime: number = 600;
  timer: any;
  currentOperation: string;
  invTotalsBeforeFSSubTotal = {total: 0, tax: 0, subtotal: 0};

  constructor(private invoiceService: InvoiceService, public cashService: CashService,
              private authService: AuthService, private router: Router) {
    this.invoiceService.evAddProd.subscribe(() => this.onAddProduct());
    this.counterInactivity();
  }

  counterInactivity(){
    this.timer = setTimeout(()=> {
      if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS)
        this.logout();
      else
        this.resetInactivity(true)
    },this.inactivityTime * 1000);
  }

  resetInactivity(cont: boolean) {
    console.log('resetInactivity');
    clearTimeout(this.timer);
    if(cont) this.counterInactivity();
  }

  clear() {
    console.log('clear');
    // this.currentOperation = 'clear';
    /*this.cashService.openGenericInfo('Confirm', 'Do you want clear?', null,true)
      .afterClosed().subscribe(next => {
      if (next !== undefined && next.confirm) {*/
        if (this.invoiceService.invoiceProductSelected.length <= 0 || this.currentOperation === FinancialOpEnum.REVIEW ||
          this.currentOperation === FinancialOpEnum.REPRINT ||
          this.currentOperation === TotalsOpEnum.FS_SUBTOTAL || this.currentOperation === TotalsOpEnum.SUBTOTAL ||
          this.currentOperation === PaymentOpEnum.CASH || this.currentOperation === PaymentOpEnum.EBT_CARD) {
          this.clearOp(false);
        } else {
          this.invoiceService.getSystemConfig().subscribe(config => {
            config.allowClear ? this.clearOp() :
              this.authService.adminLogged() ? this.clearOp() : this.manager('clear');
          }, err => {
            this.cashService.openGenericInfo('Error', 'Can\'t get configuration');
          });
        }
      /*}
    })*/;
    this.resetInactivity(true);
  }

  clearOp(total:boolean = true){
    if(this.currentOperation === FinancialOpEnum.REVIEW ||
      this.currentOperation === FinancialOpEnum.REPRINT ||
      this.currentOperation === TotalsOpEnum.FS_SUBTOTAL ||
      this.currentOperation === TotalsOpEnum.SUBTOTAL || this.currentOperation === PaymentOpEnum.CASH ||
      this.currentOperation === PaymentOpEnum.EBT_CARD ){
        this.cashService.resetEnableState();
        if(this.currentOperation === FinancialOpEnum.REVIEW || this.currentOperation === FinancialOpEnum.REPRINT) {
          this.invoiceService.createInvoice();
        }
        if(this.currentOperation === TotalsOpEnum.FS_SUBTOTAL) {
          this.resetTotalFromFS();
        }
        this.currentOperation = '';
    } else if(this.invoiceService.invoiceProductSelected.length <= 0 && !this.invoiceService.digits &&
      this.currentOperation === FinancialOpEnum.RECALL){
      this.invoiceService.createInvoice();
    } else if(this.invoiceService.invoiceProductSelected.length > 0 || this.invoiceService.digits){
      this.cashService.openGenericInfo('Confirm', 'Do you want clear?', null,true)
        .afterClosed().subscribe(next => {
        if (next !== undefined && next.confirm) {
          this.invoiceService.evDelProd.emit(true);
          if (total) this.invoiceService.setTotal();
        }
      });
    }
  }

  void() {
    console.log('void');
    this.cashService.openGenericInfo('Confirm', 'Do you want void?', null,true)
      .afterClosed().subscribe(next => {
        if (next !== undefined && next.confirm) {
          this.currentOperation = 'void';
          this.authService.adminLogged() ? this.cancelCheck() : this.manager('void');
        }
    });
    this.resetInactivity(true);
  }

  plu() {
    console.log('plu');
    this.currentOperation = InvioceOpEnum.PLU;
    // Consume servicio de PLU con this.digits eso devuelve ProductOrder
    this.invoiceService.addProductByUpc(EOperationType.Plu).subscribe(prod => {
      this.invoiceService.evAddProdByUPC.emit(prod);
    }, err => {
      console.error('addProductByUpc', err);
      this.cashService.openGenericInfo('Error', 'Can\'t complete get product by plu');
    }, () => this.invoiceService.resetDigits());
    this.resetInactivity(false);
  }

  priceCheck() {
    console.log('priceCheck');
    (this.currentOperation !== InvioceOpEnum.PRICE)? this.currentOperation = InvioceOpEnum.PRICE: this.currentOperation = "";
    //this.currentOperation = InvioceOpEnum.PRICE;
    if(this.invoiceService.digits){
      this.invoiceService.getProductByUpc(EOperationType.PriceCheck).subscribe(prod => {
        this.cashService.openGenericInfo('Price check', 'Do you want add '+prod.name+' to the invoice',
          prod.unitCost, true)
          .afterClosed().subscribe(next => {
          console.log(next);
          if(next !== undefined && next.confirm ) {
            // Logout
            this.invoiceService.evAddProdByUPC.emit(prod);
          }
        });
      }, err => { this.cashService.openGenericInfo('Error', 'Can\'t found this product '+ this.invoiceService.digits); });
      this.invoiceService.resetDigits();
    }
    this.resetInactivity(true);
  }

  numpadInput(ev) {
    this.invoiceService.evNumpadInput.emit(ev)
  }

  actionByManager(action: string, token: any){
    switch (action) {
      case 'void':
        this.cancelCheckByAdmin(token);
        break;
      case 'clear':
        this.clearCheckByAdmin(token);
        break;
      case 'refund':
        this.refundCheckByAdmin(token);
        break;
    }
  }

  manager(action?: string) {
    console.log('manager');
    // this.currentOperation = 'manager';
    if(this.authService.adminLogged()){
      if(action){
        this.actionByManager(action, this.authService.token);
      } else {
        this.router.navigateByUrl('/cash/options');
      }
    } else {
      this.authService.initialLogin = this.authService.token;
      this.cashService.dialog.open(DialogLoginComponent, { width: '530px', height: '580px', disableClose: true})
        .afterClosed()
        .subscribe(loginValid => {
          console.log('The dialog was closed', loginValid);
          if (loginValid.valid) {
            if (action) {
              this.actionByManager(action, loginValid.token);
            } else {
              this.invoiceService.getCashier();
              this.router.navigateByUrl('/cash/options');
            }
          }
        });
    }
    this.resetInactivity(true);
  }

  hold() {
    console.log('hold');
    this.currentOperation = 'hold';
    if (this.invoiceService.invoice.productOrders.length > 0) {
      this.invoiceService.holdOrder().
      subscribe(
        next => this.invoiceService.createInvoice(),
        err => this.cashService.openGenericInfo('Error', 'Can\'t complete hold order operation'));
    } else {
      this.cashService.openGenericInfo('Error', 'Not possible Hold Order without products in this Invoice');
    }
    this.resetInactivity(true);
  }

  recallCheck() {
    console.log('recallCheck');
    this.currentOperation = FinancialOpEnum.RECALL;

    this.resetInactivity(true);
    if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      this.invoiceService.digits ?
        /*this.getCheckById(EOperationType.RecallCheck,i => {
          i.status === InvoiceStatus.IN_HOLD ? this.invoiceService.setInvoice(i) :
            this.cashService.openGenericInfo('Error', 'Can\'t complete recall check operation because invoice is not in hold');
        })*/
        this.invoiceService.recallCheck().subscribe(i => {
          i.status === InvoiceStatus.IN_HOLD ? this.invoiceService.setInvoice(i) :
            this.cashService.openGenericInfo('Error', 'Can\'t complete recall check operation because invoice is not in hold');
        })
        :
        this.invoiceService.getInvoiceByStatus(EOperationType.RecallCheck, InvoiceStatus.IN_HOLD)
          .subscribe(next => this.openDialogInvoices(next, i => {
              this.invoiceService.setInvoice(i);}),
            err => this.cashService.openGenericInfo('Error', 'Can\'t complete recall check operation'));
    } else {
      console.error('Can\'t complete recall check operation');
      this.cashService.openGenericInfo('Error', 'Can\'t complete recall check operation because check is in progress');
    }
  }

  reviewCheck() {
    console.log('reviewCheck');
    this.currentOperation = FinancialOpEnum.REVIEW;

    this.resetInactivity(true);

    if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      if(this.invoiceService.digits) {
        this.getCheckById(EOperationType.ReviewCheck, i => {
          this.invoiceService.setInvoice(i);
          this.cashService.reviewEnableState();
        });
      } else {
        this.cashService.openGenericInfo('Error', 'Please input receipt number of check');
        this.invoiceService.resetDigits();
      }
    } else {
      console.error('Can\'t complete review check operation');
      this.invoiceService.resetDigits();
      this.cashService.openGenericInfo('Error', 'Can\'t complete review check operation because check is in progress');
    }
  }

  subTotal(){
    console.log('subTotal');
    if (this.invoiceService.invoice.productOrders.length > 0) {
      this.currentOperation = TotalsOpEnum.SUBTOTAL;
      this.cashService.totalsEnableState();
    }
  }

  fsSubTotal(){
    console.log('fsSubTotal');
    if (this.invoiceService.invoice.productOrders.length > 0) {
      this.currentOperation = TotalsOpEnum.FS_SUBTOTAL;
      // Send invoice for calculate totals
      // Receive updated invoice and execute this.invoiceService.setInvoice
      this.saveStateTotals();
      this.invoiceService.invoice.productOrders.filter(po => {
        if(po.foodStamp){
          this.invoiceService.invoice.subTotal = this.invoiceService.invoice.subTotal - po.subTotal;
          this.invoiceService.invoice.tax -= po.tax;
          this.invoiceService.invoice.fsTotal = this.invoiceService.invoice.fsTotal ?
            this.invoiceService.invoice.fsTotal + po.total : 0 + po.total;
          this.invoiceService.invoice.total -= po.total;
          this.invoiceService.evUpdateTotals.emit();
        }
        console.log('fsTotal', this.invoiceService.invoice.fsTotal);
        if(!this.invoiceService.invoice.fsTotal){
          this.cashService.totalsEnableState();
        } else {
          this.cashService.totalsEnableState(true);
        }
      })
    }
    this.resetInactivity(true);
  }

  getCheckById(typeOp: EOperationType, action: (i: Invoice) => void) {
    this.invoiceService.getInvoicesById(typeOp)
      .subscribe(next => action(next),
        (err: HttpErrorResponse) =>
          this.cashService.openGenericInfo('Error', 'Can\'t complete get check operation. ' + err.statusText));
  }

  openDialogInvoices(inv: Invoice[], action: (i: Invoice) => void) {
    if (inv.length > 0) {
      const dialogRef = this.cashService.dialog.open(DialogInvoiceComponent,
        {
          width: '700px', height: '450px', data: inv, disableClose: true
        });
      dialogRef.afterClosed().subscribe(order => {
        console.log('The dialog was closed', order);
        if (order) { action(order); }
      });
    } else {
      this.cashService.openGenericInfo('Information', 'Not exist hold orders');
    }
  }

  refund() {
    console.log('refund');
    this.currentOperation = 'refund';
    if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      this.invoiceService.digits ?
        this.authService.adminLogged() ? this.refundOp() : this.manager('refund')
        /*this.invoiceService.refund().subscribe(i => {
            this.invoiceService.setInvoice(i);
          },
          err => {
            console.error(err);
            this.invoiceService.resetDigits();
            this.cashService.openGenericInfo('Error', 'Can\'t complete refund operation');
          }
        )*/
        :
        this.cashService.openGenericInfo('Error', 'Please input receipt number of check');
    } else {
      console.error('Can\'t complete refund operation');
      this.invoiceService.resetDigits();
      this.cashService.openGenericInfo('Error', 'Can\'t complete refund operation because check is in progress');
    }

  }

  refundOp() {
    this.invoiceService.refund().subscribe(i => {
      console.log('refund', i);
        this.invoiceService.setInvoice(i);
      },
      err => {
        console.error(err);
        this.invoiceService.resetDigits();
        this.cashService.openGenericInfo('Error', 'Can\'t complete refund operation');
      }
    )
  }

  logout() {
    console.log('logout');
    this.currentOperation = 'logout';

    if(this.invoiceService.invoice.status === InvoiceStatus.IN_PROGRESS){
      this.cashService.openGenericInfo('Error', 'Can\'t complete logout operation because check is in progress')
    } else {
      this.cashService.openGenericInfo('Confirm', 'Do you want logout?', null,true)
        .afterClosed().subscribe(next => {
          console.log(next);
          if(next !== undefined && next.confirm ) {
            // Logout
            this.authService.logout();
            this.invoiceService.resetDigits();
            this.cashService.resetEnableState();
          }
      });
    }
    this.resetInactivity(false);
  }

  cancelCheck() {
    console.log('cancelar factura');
    this.invoiceService.cancelInvoice().subscribe(next => {
      this.invoiceService.createInvoice();
    },err => console.error('cancelCheck failed'));
    this.resetInactivity(false);
  }

  cancelCheckByAdmin(t?: Token) {
    console.log('cancelCheckByAdmin', t);
    this.invoiceService.cancelInvoice().subscribe(next => {
      this.authService.token = t;
      this.invoiceService.createInvoice();
    },err => console.error('cancelCheck failed'));
    this.resetInactivity(false);
  }

  clearCheckByAdmin(t?: Token) {
    console.log('clearCheckByAdmin', t);
    this.clearOp();
    this.authService.token = t;
    this.resetInactivity(false);
  }

  refundCheckByAdmin(t?: Token) {
    console.log('refundCheckByAdmin', t);
    this.refundOp();
    this.authService.token = t;
    this.resetInactivity(false);
  }

  openInfoEventDialog(title: string) {
    this.cashService.dialog.open(GenericInfoEventsComponent,{
      width: '300px', height: '220px', data: {title: title ? title : 'Information'}, disableClose: true
    })
      .afterClosed().subscribe(() => this.cashService.resetEnableState());
  }

  cash() {
    console.log('cash');
    const totalToPaid = this.invoiceService.invoice.total;
    if (totalToPaid < 0  && this.invoiceService.invoice.isRefund) {
      console.log('paid refund, open cash!!!');
      this.cashService.openGenericInfo('Open Cash', 'Paid Refund: ' + totalToPaid)
        .afterClosed()
        .subscribe(
          () => this.invoiceService.cash(totalToPaid)
            .subscribe(
              data =>
              {
                console.log(data);
                this.invoiceService.createInvoice();
              },
              err => this.cashService.openGenericInfo('Error', 'Error in refund paid'),
              () => this.cashService.resetEnableState()));
    } else if (totalToPaid > 0) {
      const dialogRef = this.cashService.dialog.open(CashOpComponent,
        {
          width: '480px', height: '660px', data: totalToPaid, disableClose: true
        }).afterClosed().subscribe(data => {
        console.log('The dialog was closed', data);
        // this.paymentData = data;
        if (data > 0) {
          let valueToReturn = data - totalToPaid;
          this.cashReturn(valueToReturn, data);
        } else {
          this.currentOperation = TotalsOpEnum.SUBTOTAL;
        }
      });
    }
    this.currentOperation = PaymentOpEnum.CASH;
    this.resetInactivity(false);
  }

  cashReturn(valueToReturn, payment) {
    const dialogRef = this.cashService.dialog.open(CashPaymentComponent,
      {
        width: '300px', height: '200px', data: valueToReturn, disableClose: true
      })
      .afterClosed().subscribe((result: string) => {
        if (result !== '') {
          this.invoiceService.cash(payment)
            .subscribe(data => {
                console.log(data);
                this.invoiceService.createInvoice();
              },
              err => {
                console.log(err); this.cashService.openGenericInfo('Error', 'Can\'t complete cash operation')
              },
              () => this.cashService.resetEnableState())
        }
      });
  }

  reprint() {
    console.log('reprint');
    this.currentOperation = FinancialOpEnum.REPRINT;

    if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      if(this.invoiceService.digits) {
        this.getCheckById(EOperationType.Reprint,i => {
          this.invoiceService.resetDigits();
          this.print(i);
        })
      } else if(this.currentOperation === FinancialOpEnum.REPRINT){
        this.print(this.invoiceService.invoice);
      } else {
        this.cashService.openGenericInfo('Error', 'Please input receipt number of check');
        this.invoiceService.resetDigits();
      }

    } else {
      console.error('Can\'t complete print operation');
      this.cashService.openGenericInfo('Error', 'Can\'t complete print operation');
      this.invoiceService.resetDigits();
    }

  }

  private print (i: Invoice){
    this.invoiceService.print(i).subscribe(
      data => this.cashService.openGenericInfo('Print', 'Print is finish'),
      err => this.cashService.openGenericInfo('Error', 'Can\'t complete print operation'));
  }

  onAddProduct(){
    this.resetInactivity(true);
    // this.invoiceService.invoice.status = InvoiceStatus.IN_PROGRESS;
  }

  scanProduct(){
    this.invoiceService.addProductByUpc(EOperationType.Scanner).subscribe(prod => {
      console.log('scanProduct', prod);
      this.invoiceService.evAddProdByUPC.emit(prod);
    }, err => {
      console.error('addProductByUpc', err);
      this.invoiceService.resetDigits();
      this.cashService.openGenericInfo('Error', 'Can\'t complete scan product operation');
    });
    this.resetInactivity(false);
  }

  ebt() {
    console.log('EBT Card');
    this.currentOperation = 'EBT Card';

    if (this.invoiceService.invoice.total !== 0 || this.invoiceService.invoice.fsTotal !== 0) {
      this.openInfoEventDialog('EBT Card');
      this.invoiceService.ebt(this.invoiceService.invoice.total)
        .subscribe(data => {
          console.log(data);
          if(this.invoiceService.invoice.total === 0) {
            this.invoiceService.createInvoice();
            this.cashService.resetEnableState();
          } else {
            this.invoiceService.setInvoice(data);
            this.cashService.ebtEnableState();
          }
        },err => {
          console.log(err);
          this.cashService.openGenericInfo('Error', 'Can\'t complete ebt operation');
          this.cashService.resetEnableState()
        });
    }
    this.resetInactivity(false);
  }

  debit() {
    this.currentOperation = 'debit';

    if (this.invoiceService.invoice.total !== 0) {
      this.openInfoEventDialog('Debit Card');
      this.invoiceService.debit(this.invoiceService.invoice.total)
        .subscribe(data => {
          console.log(data);
          this.invoiceService.createInvoice();
        },err => {
          console.log(err); this.cashService.openGenericInfo('Error', 'Can\'t complete debit operation');
          this.cashService.resetEnableState();
        });
    }
    this.resetInactivity(false);
  }

  credit() {
    console.log('Credit Card');
    this.currentOperation = 'Credit Card';

    if (this.invoiceService.invoice.total !== 0) {
      this.openInfoEventDialog('Credit Card');
      this.invoiceService.credit(this.invoiceService.invoice.total)
        .subscribe(data => {
            console.log(data);
            this.invoiceService.createInvoice();
          },
          err => {
            console.log(err); this.cashService.openGenericInfo('Error', 'Can\'t complete credit operation');
            this.cashService.resetEnableState();
          });
    }
    this.resetInactivity(false);
  }

  private resetTotalFromFS() {
    this.invoiceService.invoice.fsTotal = 0;
    this.invoiceService.invoice.total = this.invTotalsBeforeFSSubTotal.total;
    this.invoiceService.invoice.subTotal = this.invTotalsBeforeFSSubTotal.subtotal;
    this.invoiceService.invoice.tax = this.invTotalsBeforeFSSubTotal.tax;
    this.invoiceService.evUpdateTotals.emit();
  }

  private saveStateTotals() {
    this.invTotalsBeforeFSSubTotal['total'] = this.invoiceService.invoice.total;
    this.invTotalsBeforeFSSubTotal['subtotal']  = this.invoiceService.invoice.subTotal;
    this.invTotalsBeforeFSSubTotal['tax']  = this.invoiceService.invoice.tax;
  }

  public printLast() {
    this.invoiceService.printLastInvoice();
  }

  scanInvoice() {
    /*if(this.invoiceService.digits) {
      this.getCheckById(EOperationType.ReviewCheck, i => {
        if (i.status === InvoiceStatus.IN_PROGRESS) {
          this.cashService.reviewEnableState();
        } else if (i.status === InvoiceStatus.PAID) {
          this.cashService.reviewPaidEnableState();
        } else if (i.status === InvoiceStatus.IN_HOLD) {
          this.cashService.reviewEnableState();
        } else this.cashService.reviewEnableState();
      });
    }*/
  }

  paidOut() {
    this.cashService.dialog.open(PaidOutComponent,
      {
        width: '480px', height: '600px', disableClose: true
      })
      .afterClosed().subscribe((data: string) => {
        console.log('paided out modal', data);
        if(data) {
          this.cashService.dialog.open(DialogPaidoutComponent,
            {
              width: '1024px', height: '600px', disableClose: true
            })
            .afterClosed().subscribe(next => {
              this.invoiceService.addPaidOut(data, next.text).subscribe(next => {
                console.log('paided out service', data);
              }, error1 => {
                console.error('paid out', error1);
                this.cashService.openGenericInfo('Error', 'Can\'t complete paid out operation')
              });
          });
        };
      });
  }
}
