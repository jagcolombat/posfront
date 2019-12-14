import {EventEmitter, Injectable, Output} from '@angular/core';
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
import {Product, Token} from "../../models";
import {FinancialOpEnum, InvioceOpEnum, PaymentOpEnum, TotalsOpEnum} from "../../utils/operations";
import {HttpErrorResponse} from '@angular/common/http';
import {GenericInfoEventsComponent} from "../../components/presentationals/generic-info-events/generic-info-events.component";
import {PaidOutComponent} from "../../components/presentationals/paid-out/paid-out.component";
import {DialogPaidoutComponent} from "../../components/containers/dialog-paidout/dialog-paidout.component";
import {DialogFilterComponent} from "../../components/containers/dialog-filter/dialog-filter.component";
import {MatDialogRef} from "@angular/material";
import {CompanyType} from "../../utils/company-type.enum";
import {PaymentStatus} from "../../utils/payment-status.enum";
import {ProductGenericComponent} from "../../components/presentationals/product-generic/product-generic.component";
import {AdminOpEnum} from "../../utils/operations/admin-op.enum";
import {ETXType} from "../../utils/delivery.enum";
import {DialogDeliveryComponent} from "../../components/presentationals/dialog-delivery/dialog-delivery.component";
import {Table} from "../../models/table.model";
import {Observable, of} from "rxjs";
import {InputCcComponent} from "../../components/presentationals/input-cc/input-cc.component";
import {dataValidation, operationsWithClear} from "../../utils/functions/functions";
import {Order} from "../../models/order.model";
import {OtherOpEnum} from "../../utils/operations/other.enum";
import {EFieldType} from "../../utils/field-type.enum";
import {OrderInfoComponent} from "../../components/presentationals/order-info/order-info.component";
import {ProductGeneric} from "../../models/product-generic";
import {AdminOptionsService} from "./admin-options.service";

@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  inactivityTime: number = 60;
  timer: any;
  currentOperation: string;
  invTotalsBeforeFSSubTotal = {total: 0, tax: 0, subtotal: 0};
  @Output() evCancelCheck = new EventEmitter<any>();
  @Output() evRemoveHold = new EventEmitter<any>();
  @Output() evCleanAdminOperation = new EventEmitter<any>();

  constructor(private invoiceService: InvoiceService, public cashService: CashService,
              private authService: AuthService, private router: Router) {
    this.invoiceService.evAddProd.subscribe(() => this.onAddProduct());
    this.invoiceService.evCreateInvoice.subscribe(next => this.router.navigateByUrl('/cash/dptos'));
    this.counterInactivity();
  }

  counterInactivity(){
    this.timer = setTimeout(()=> {
      if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS)
        this.logout();
      else
        this.resetInactivity(true);
    },this.inactivityTime * 60000);
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
        if (this.invoiceService.invoiceProductSelected.length <= 0 ||
          operationsWithClear.filter(i => i === this.currentOperation).length > 0) {
          this.clearOp(false);
        } else {
          this.cashService.getSystemConfig().subscribe(config => {
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
    if(operationsWithClear.filter(i => i === this.currentOperation).length > 0){
        this.cashService.resetEnableState();
        this.invoiceService.isReviewed = false;
        if(this.currentOperation === FinancialOpEnum.REVIEW ||
          this.currentOperation === FinancialOpEnum.REPRINT ||
          this.currentOperation === AdminOpEnum.CANCEL_CHECK ||
          this.currentOperation === AdminOpEnum.REMOVE_HOLD) {
          this.invoiceService.createInvoice();
          if(this.currentOperation === AdminOpEnum.CANCEL_CHECK){
            this.evCancelCheck.emit(false);
          }
          if(this.currentOperation === AdminOpEnum.REMOVE_HOLD){
            this.evRemoveHold.emit(false);
          }
        }
        if(this.currentOperation === TotalsOpEnum.FS_SUBTOTAL) {
          this.resetTotalFromFS();
        }
        this.currentOperation = '';
    } else if(this.invoiceService.invoiceProductSelected.length <= 0 && !this.invoiceService.digits &&
      this.currentOperation === FinancialOpEnum.RECALL){
      this.invoiceService.createInvoice();
    } else if(this.invoiceService.invoiceProductSelected.length > 0 || this.invoiceService.digits){
      this.invoiceService.invoiceProductSelected.length > 0 ?
        this.cashService.openGenericInfo('Confirm', 'Do you want clear?', null,true)
          .afterClosed().subscribe(next => {
          if (next !== undefined && next.confirm) {
            this.invoiceService.evDelProd.emit(true);
            if (total) this.invoiceService.setTotal();
          }
        }):
        this.invoiceService.evDelProd.emit(true);
    }
    this.evCleanAdminOperation.emit();
  }

  void() {
    console.log('void', this.invoiceService.invoice.productOrders);
    if((this.invoiceService.invoice.status === InvoiceStatus.IN_PROGRESS &&
      this.invoiceService.invoice.productOrders.length > 0 ) ||
      this.invoiceService.invoice.status === InvoiceStatus.IN_HOLD ){
      this.cashService.openGenericInfo('Confirm', 'Do you want void?', null,true)
        .afterClosed().subscribe(next => {
        if (next !== undefined && next.confirm) {
          this.currentOperation = 'void';
          this.authService.adminLogged() ? this.cancelCheck() : this.manager('void');
        }
      });
    } else {
      this.cashService.openGenericInfo('Error', 'Void operation is only for invoice with products, in hold or in progress');
    }
    this.resetInactivity(true);
  }

  plu() {
    console.log('plu');
    this.currentOperation = InvioceOpEnum.PLU;
    // Consume servicio de PLU con this.digits eso devuelve ProductOrder
    this.invoiceService.addProductByUpc(EOperationType.Plu).subscribe(prods => {
      this.selectProd(prods).subscribe(prod => {
        console.log('Plu', prod);
        prod ? this.invoiceService.evAddProdByUPC.emit(prod): this.invoiceService.resetDigits();
      });
    }, err => {
      console.error('addProductByUpc', err);
      this.cashService.openGenericInfo('Error', 'Can\'t complete get product by plu');
    });
    this.invoiceService.resetDigits();
    this.resetInactivity(false);
  }

  selectProd(prods: Product[]): Observable<Product>{
    let $prod : Observable<Product>;
    if(prods.length > 1){
      $prod = this.cashService.dialog.open(DialogInvoiceComponent,
        { width: '780px', height: '660px',
          data: {invoice: prods, label: 'name', detail:'unitCost', title: 'Products', subtitle: 'Select a product', filter: false},
          disableClose: true }).afterClosed();
    } else {
      $prod = of(prods[0]);
    }
    return $prod;
  }

  priceCheck() {
    console.log('priceCheck');
    (this.currentOperation !== InvioceOpEnum.PRICE)? this.currentOperation = InvioceOpEnum.PRICE: this.currentOperation = "";
    if(this.invoiceService.digits){
      this.invoiceService.getProductByUpc(EOperationType.PriceCheck).subscribe(prods => {
        this.selectProd(prods).subscribe( prod => {
          if(prod){
            this.cashService.openGenericInfo('Price check', 'Do you want add '+prod.name+' to the invoice',
              prod.unitCost, true)
              .afterClosed().subscribe(next => {
              console.log(next);
              if(next !== undefined && next.confirm ) {
                // Logout
                this.invoiceService.evAddProdByUPC.emit(prod);
              }
            });
          } else {
            this.invoiceService.resetDigits();
          }
        });
      }, err => {
        this.cashService.openGenericInfo('Error', 'Can\'t found this product '+
          this.invoiceService.digits); });
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
    this.invoiceService.isReviewed = true;
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
    this.invoiceService.isReviewed = true;
    this.resetInactivity(true);

    if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      if(this.invoiceService.digits) {
        this.getCheckById(EOperationType.ReviewCheck, i => {
          this.invoiceService.setInvoice(i);
          this.cashService.reviewEnableState();
        });
      } else {
        this.keyboard(FinancialOpEnum.REVIEW);
      }
    } else {
      console.error('Can\'t complete review check operation');
      this.cleanCurrentOp();
      this.invoiceService.resetDigits();
      this.cashService.openGenericInfo('Error', 'Can\'t complete review check operation because check is in progress');
    }
  }

  subTotal(){
    console.log('subTotal', this.currentOperation);
    let refund = this.currentOperation === FinancialOpEnum.REFUND;
    if (this.invoiceService.invoice.productOrders.length > 0) {
      this.currentOperation = TotalsOpEnum.SUBTOTAL;
      this.cashService.totalsEnableState(false, refund);
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
          //this.invoiceService.invoice.subTotal = this.invoiceService.invoice.subTotal - po.subTotal;
          //this.invoiceService.invoice.tax -= po.tax;
          this.invoiceService.invoice.fsTotal = this.invoiceService.invoice.fsTotal ?
            this.invoiceService.invoice.fsTotal + po.subTotal : 0 + po.subTotal;
          //this.invoiceService.invoice.total -= po.total;
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
        (err: HttpErrorResponse) => {
          this.cashService.openGenericInfo('Error', 'Can\'t complete get check operation. ' +
            err.statusText);
          this.cleanCurrentOp();
        });
  }

  openDialogInvoices(inv: Invoice[], action: (i: Invoice) => void) {
    if (inv.length > 0) {
      //inv.map((i, ind) => i.orderInfo = 'Juan Perez Perez - '+ Math.random());
      const dialogRef = this.cashService.dialog.open(DialogInvoiceComponent,
        {
          width: '780px', height: '660px', data: {invoice: inv, label:'receiptNumber', detail:'total', subdetail: 'orderInfo'}, disableClose: true
        });
      dialogRef.afterClosed().subscribe(order => {
        console.log('The dialog was closed', order);
        if (order) { action(order); }
      });
    } else {
      this.cashService.openGenericInfo('Information', 'Not exist hold orders');
    }
  }

  openDialogTables(tabs?: Table[]) {
    this.invoiceService.tables().subscribe(tables => {
      if (tables.length > 0) {
        const dialogRef = this.cashService.dialog.open(DialogInvoiceComponent,
          { width: '780px', height: '660px', data: {invoice: tables, detail:'label', title: 'Tables', subtitle: 'Select a table'}
            , disableClose: true });
        dialogRef.afterClosed().subscribe(table => {
          console.log('The tables dialog was closed', table);
          if(table){
            this.invoiceService.setDineIn(<Table> table).subscribe(next => {
              if(next) {
                this.invoiceService.order = next;
                this.cashService.openGenericInfo('Information', 'The "' +table['label'] + '" was assigned to this order');
              } else {
                this.cashService.openGenericInfo('Error', 'Can\'t complete dine in operation')
              }}, err => {
              this.cashService.openGenericInfo('Error', 'Can\'t complete dine in operation')
            })
          }
        });
      } else {
        this.cashService.openGenericInfo('Information', 'There are not tables');
      }
    }, err => {
      console.error('Error getting tables', err);
      this.cashService.openGenericInfo('Error', 'Can\'t complete get tables operation');
    });
    //let tables = tabs? tabs : [{id:"0", number: 1, label: 'Table 1'}];

  }

  refund() {
    console.log('refund');
    this.currentOperation = FinancialOpEnum.REFUND;
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
        this.keyboard(FinancialOpEnum.REFUND);
        // this.cashService.openGenericInfo('Error', 'Please input receipt number of check');

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
    },err => {
      console.error('cancelCheck failed');
      this.cashService.openGenericInfo('Error', 'Can\'t complete void operation')
    });
    this.resetInactivity(false);
  }

  cancelCheckByAdmin(t?: Token) {
    console.log('cancelCheckByAdmin', t);
    this.invoiceService.cancelInvoice().subscribe(next => {
      this.authService.token = t;
      this.invoiceService.createInvoice();
    },err => {
      console.error('cancelCheck failed');
      this.cashService.openGenericInfo('Error', 'Can\'t complete void operation')
    });
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

  openInfoEventDialog(title: string): MatDialogRef<any, any> {
    let infoEventDialog = this.cashService.dialog.open(GenericInfoEventsComponent,{
      width: '300px', height: '220px', data: {title: title ? title : 'Information'}, disableClose: true
    });
      infoEventDialog.afterClosed().subscribe(() => this.cashService.resetEnableState());
      return infoEventDialog;
  }

  getTotalToPaid(){
    return this.invoiceService.invoice.balance !== undefined ? this.invoiceService.invoice.balance: this.invoiceService.invoice.total;
  }

  cash(opType?: PaymentOpEnum) {
    console.log('cash');
    const totalToPaid = this.getTotalToPaid();
    if (totalToPaid < 0  && this.invoiceService.invoice.isRefund) {
      console.log('paid refund, open cash!!!');
      this.cashService.dialog.open(CashPaymentComponent,
        {
          width: '300px', height: '240px', data: totalToPaid, disableClose: true
        })
      //this.cashService.openGenericInfo('Open Cash', 'Paid Refund: ' + totalToPaid)
        .afterClosed()
        .subscribe(
          result =>{
            if (result !== '') {
              this.invoiceService.cash(totalToPaid, totalToPaid, opType)
                .subscribe(
                  data =>
                  {
                    console.log(data);
                    this.invoiceService.createInvoice();
                  },
                  err => this.cashService.openGenericInfo('Error', 'Error in refund paid'),
                  () => this.cashService.resetEnableState())
            }
          });
    } else if (totalToPaid > 0) {
      const dialogRef = this.cashService.dialog.open(CashOpComponent,
        {
          width: '480px', height: '660px', data: totalToPaid, disableClose: true
        }).afterClosed().subscribe(data => {
        console.log('The dialog was closed', data);
        // this.paymentData = data;
        this.cashPaid(data, totalToPaid)
      });
    }
    this.currentOperation = opType;
    this.resetInactivity(false);
  }

  cashMoney(paid){
    this.currentOperation = PaymentOpEnum.CASH;
    this.cashPaid(paid);
  }

  cashPaid(paid, totalToPaid?:number){
    let total2Paid = (totalToPaid) ? totalToPaid : this.getTotalToPaid();
    if (paid > 0) {
      let valueToReturn = paid - total2Paid;
      if(valueToReturn < 0)
        this.invoiceService.invoice.balance = valueToReturn * -1;
      else
        this.invoiceService.invoice.balance = undefined;
      this.cashReturn(valueToReturn, paid, total2Paid);
    } else {
      this.currentOperation = TotalsOpEnum.SUBTOTAL;
    }
  }

  cashReturn(valueToReturn, payment, totalToPaid) {
    const dialogRef = this.cashService.dialog.open(CashPaymentComponent,
      {
        width: '300px', height: '240px', data: valueToReturn > 0 ? valueToReturn : 0, disableClose: true
      })
      .afterClosed().subscribe((result: string) => {
        if (result !== '') {
          console.log('cash', this.currentOperation);
          this.invoiceService.cash(payment, totalToPaid, <PaymentOpEnum>this.currentOperation)
            .subscribe(data => {
                console.log(data);
                if(+valueToReturn >= 0 || data.status === InvoiceStatus.PAID) this.invoiceService.createInvoice();
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
      } else if(this.invoiceService.isReviewed){
        this.print(this.invoiceService.invoice);
      } else {
        this.keyboard(FinancialOpEnum.REPRINT);
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
    if(this.invoiceService.numbers.length === 12 && this.invoiceService.numbers.startsWith('2') &&
      this.invoiceService.numbers.substring(7, 11) !== '0000'){
      this.invoiceService.priceWic = this.invoiceService.numbers.substring(7, 11);
      let upc = this.invoiceService.numbers.substring(0, 6);
      this.invoiceService.numbers = upc + '000000';
    }
    this.invoiceService.addProductByUpc(EOperationType.Scanner).subscribe(prods => {
      this.selectProd(prods).subscribe( prod => {
        console.log('scanProduct', prod);
        prod ? this.invoiceService.evAddProdByUPC.emit(prod): this.invoiceService.resetDigits();
      });
    }, err => {
      console.error('addProductByUpc', err);
      this.invoiceService.resetDigits();
      this.cashService.openGenericInfo('Error', 'Can\'t complete scan product operation');
    });
    this.resetInactivity(false);
  }

  ebt(type?: number) {
    console.log('EBT Card');
    this.currentOperation = 'EBT Card';

    if (this.invoiceService.invoice.total !== 0 || this.invoiceService.invoice.fsTotal !== 0) {
      let dialogInfoEvents = this.openInfoEventDialog('EBT Card');
      this.invoiceService.ebt(this.invoiceService.invoice.total, type)
        .subscribe(data => {
          console.log(data);
          if(data.status === InvoiceStatus.PAID) {
            this.invoiceService.createInvoice();
            this.cashService.resetEnableState();
          } else {
            this.invoiceService.setInvoice(data);
            this.cashService.ebtEnableState();
          }
        },err => {
          console.log(err);
          this.resetTotalFromFS();
          dialogInfoEvents.close();
          //this.cashService.openGenericInfo('Error', 'Can\'t complete ebt operation');
          this.cashService.openGenericInfo('Error', err);
          this.cashService.resetEnableState();
        }, () => dialogInfoEvents.close());
    }
    this.resetInactivity(false);
  }

  debit() {
    this.currentOperation = 'debit';
    if(this.invoiceService.invoice.isRefund) {
      this.cash();
    } else if (this.invoiceService.invoice.total !== 0) {
      let dialogInfoEvents = this.openInfoEventDialog('Debit Card');
      this.invoiceService.debit(this.invoiceService.invoice.total)
        .subscribe(data => {
          console.log(data);
          dialogInfoEvents.close();
          this.invoiceService.createInvoice();
        },err => {
          console.log(err);
          dialogInfoEvents.close();
          this.cashService.openGenericInfo('Error', 'Can\'t complete debit operation');
          this.cashService.resetEnableState();
        });
    }
    this.resetInactivity(false);
  }

  credit() {
    console.log('Credit Card');
    this.currentOperation = 'Credit Card';
    if (this.invoiceService.invoice.total !== 0) {
      if (this.cashService.systemConfig.companyType === CompanyType.RESTAURANT &&
        this.invoiceService.invoice.paymentStatus === PaymentStatus.AUTH) {
        this.cashService.dialog.open(ProductGenericComponent,
          {
            width: '480px', height: '650px', data: {unitCost: 0, name: 'Tip', label: 'Tip'},
            disableClose: true
          }).afterClosed().subscribe(
          next=> {
            console.log(next);
            this.invoiceService.invoice.tip = next.unitCost;
            this.creditOp();
            //this.setCreditCardType();
          },
          err=> {console.error(err)})
      } else {
        //this.creditOp();
        this.setCreditCardType();
      }
    }
    this.resetInactivity(false);
  }

  private creditOp(splitAmount?: number){
      let dialogInfoEvents = this.openInfoEventDialog('Credit Card');
      this.invoiceService.credit(splitAmount ? splitAmount : this.invoiceService.invoice.balance, this.invoiceService.invoice.tip)
        .subscribe(data => {
            console.log(data);
            dialogInfoEvents.close();
            (data && data.balance > 0) ? this.invoiceService.setInvoice(data) : this.invoiceService.createInvoice();
          },
          err => {
            console.log(err);
            dialogInfoEvents.close();
            this.cashService.openGenericInfo('Error', 'Can\'t complete credit operation');
            this.cashService.resetEnableState();
          });
  }

  private creditManualOp(title, splitAmount?: number){
    this.getNumField(title, 'Number', EFieldType.CARD_NUMBER).subscribe((number) => {
      console.log('cc manual modal', number);
      if(number.number) {
        this.getNumField(title, 'CVV', EFieldType.CVV).subscribe(cvv => {
          if(cvv.number){
            this.getNumField(title, 'Exp. Date', EFieldType.EXPDATE).subscribe(date => {
              if(date.number){
                this.getNumField(title, 'Zip Code', EFieldType.ZIPCODE).subscribe(zipcode => {
                  if (zipcode.number) {
                    this.invoiceService.creditManual(splitAmount ? splitAmount :this.invoiceService.invoice.total,
                      this.invoiceService.invoice.tip, number.number, cvv.number, date.number, zipcode.number)
                      .subscribe(data => {
                          console.log(data);
                          (data && data.balance > 0) ? this.invoiceService.setInvoice(data) : this.invoiceService.createInvoice();
                        },
                        err => {
                          console.log(err);
                          this.cashService.openGenericInfo('Error', 'Can\'t complete credit card manual operation');
                        },
                        () => this.cashService.resetEnableState());
                  }
                });
              } else {
                this.cashService.resetEnableState();
                this.cashService.openGenericInfo('Error', 'Can\'t complete credit card manual operation because no set CC Date')
              }
            });
          } else {
            this.cashService.resetEnableState();
            this.cashService.openGenericInfo('Error', 'Can\'t complete credit card manual operation because no set CVV')
          }
        });
      } else {
        this.cashService.resetEnableState();
        this.cashService.openGenericInfo('Error', 'Can\'t complete credit card manual operation because no set CC Number')
      }
    });
  }

  private resetTotalFromFS() {
    this.invoiceService.invoice.fsTotal = 0;
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
    if(this.invoiceService.invoice.status === InvoiceStatus.IN_PROGRESS){
      this.cashService.openGenericInfo('Error', 'Scan invoice operation is not allow if a invoice is in progress');
      this.invoiceService.resetDigits();
    }
  }

  paidOut() {
    if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS){
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
              console.log('paided out service', data, next);
            }, error1 => {
              console.error('paid out', error1);
              this.cashService.openGenericInfo('Error', 'Can\'t complete paid out operation')
            });
          });
        };
      });
    } else {
      this.cashService.openGenericInfo('Error', 'Paid out operation is not allow if a invoice is in progress');
    }
  }

  keyboard(action?: FinancialOpEnum | AdminOpEnum){
    this.cashService.disabledInputKey = true;
    this.cashService.dialog.open(DialogFilterComponent,
      { width: '1024px', height: '600px', data: {title: "Enter Receipt Number"} , disableClose: true})
      .afterClosed()
      .subscribe(next => {
        console.log('keyboard', next);
        this.cashService.disabledInputKey = false;
        if (next) {
          this.invoiceService.digits = next.text;
          if(action !== undefined){
            switch (action) {
              case FinancialOpEnum.REFUND:
                this.refundOp();
                break;
              case FinancialOpEnum.REVIEW:
                this.reviewCheck();
                break;
              case FinancialOpEnum.REPRINT:
                this.reprint();
                break;
              case AdminOpEnum.CANCEL_CHECK:
                this.evCancelCheck.emit(true);
                break;
            }
          }
        } else if (!next && action === FinancialOpEnum.REVIEW || action === FinancialOpEnum.REFUND ||
          action === FinancialOpEnum.REPRINT) {
          this.cleanCurrentOp();
          this.invoiceService.isReviewed = false;
        }
      });
  }

  cleanCurrentOp(){
    this.currentOperation = "";
  }

  txType() {
    let txTypes= new Array<any>(
      { value: 1, text: 'Dine In', color: 'red' },
            { value: 2, text: 'Pick Up', color: 'yellow' },
            { value: 3, text: 'Delivery', color: 'green' },
            { value: 4, text: 'Retail', color: 'blue' }
      );
    this.cashService.dialog.open(DialogDeliveryComponent,
      { width: '420px', height: '340px', data: { arr: txTypes}, disableClose: true })
      .afterClosed().subscribe(next => {
        console.log('dialog delivery', next);
        if(next){
          this.invoiceService.invoice.type = next;
          switch (this.invoiceService.invoice.type) {
            case ETXType.DINEIN:
              this.dineIn();
              break;
            case ETXType.DELIVERY:
              this.delivery();
              break;
            case ETXType.PICKUP:
              this.pickUp();
              break;
            case ETXType.RETAIL:
              this.retail();
              break;
          }
        } else {
          //this.invoiceService.invoice.type = ETXType.DINEIN;
        }
    });
  }

  setCreditCardType(splitAmount?: number) {
    let ccTypes= new Array<any>({value: 1, text: 'Automatic'}, {value: 2, text: 'Manual'});
    this.cashService.dialog.open(DialogDeliveryComponent,
      { width: '600px', height: '340px', data: {name: 'Credit Card Types', label: 'Select a type', arr: ccTypes},
        disableClose: true })
      .afterClosed().subscribe(next => {
      console.log(next);
      switch (next) {
        case 1:
          this.creditOp(splitAmount);
          break;
        case 2:
          this.creditManualOp('Credit Card', splitAmount);
          break;
        default:
          this.cashService.resetEnableState();
      }
    });
  }

  setEBTCardType() {
    let ccTypes= new Array<any>({value: 0, text: 'EBT'}, {value: 1, text: 'EBT Cash'});
    this.cashService.dialog.open(DialogDeliveryComponent,
      { width: '600px', height: '340px', data: {name: 'EBT Card Types', label: 'Select a type', arr: ccTypes},
        disableClose: true })
      .afterClosed().subscribe(next => {
      console.log(next);
      this.ebt(next);
      this.cashService.resetEnableState();
    });
  }

  retail() {
    console.log('set order to retail');
    this.invoiceService.setRetail().subscribe(next => {
      if(next) {
        this.invoiceService.order = next;
        this.cashService.openGenericInfo('Information', 'This order was set to "Retail"');
      }
    },err => {
      this.cashService.openGenericInfo('Error', 'Can\'t complete set retail operation');
    });
  }

  dineIn(){
    //if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS){
      this.openDialogTables();
    /*} else {
      this.cashService.openGenericInfo('Error', 'Dine in operation is not allow if a invoice is in progress');
    }*/
  }

  pickUp() {
    let title = 'Pick up';
    //if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS){
      this.getField(title, 'Client Name', EFieldType.NAME).subscribe((name) => {
        console.log('pick up modal', name);
        if(name.text) {
          this.getNumField(title, 'Client Phone', EFieldType.PHONE).subscribe(phone => {
            if(phone.number){
              this.getField(title, 'Description', EFieldType.DESC).subscribe(descrip => {
                if (!descrip.text) {
                  console.log('pick up no set description');
                }
                this.invoiceService.setPickUp(name.text, phone.number, descrip.text).subscribe(order => {
                  console.log('pick up this order', order);
                  this.invoiceService.order = order;
                  this.cashService.openGenericInfo('Information', 'This order was set to "Pick up"')
                }, error1 => {
                  console.error('pick upt', error1);
                  this.cashService.openGenericInfo('Error', 'Can\'t complete pick up operation')
                });
              });
            } else {
              this.cashService.openGenericInfo('Error', 'Can\'t complete pick up operation because no set Client Phone')
            }
          });
        } else {
          this.cashService.openGenericInfo('Error', 'Can\'t complete pick up operation because no set Client Name')
        }
      });
    /*} else {
      this.cashService.openGenericInfo('Error', 'Pick up operation is not allow if a invoice is in progress');
    }*/
  }

  delivery(){
    let title = 'Delivery';
    this.getField(title, 'Client Name', EFieldType.NAME).subscribe(name => {
      if (name) {
        //order.type.client.name = name.text;
        this.getField(title, 'Client Address', EFieldType.ADDRESS).subscribe(address => {
          if(address){
            //order.type.client.address = address.text;
            this.getNumField(title, 'Client Phone', EFieldType.PHONE).subscribe(phone => {
              if(phone) {
                //order.type.client.telephone = phone.text;
                this.getField(title, 'Description', EFieldType.DESC).subscribe(descrip => {
                  if (!descrip.text) {
                    console.log('delivery no set description');
                  }
                  this.invoiceService.setDelivery(name.text, address.text, phone.number, descrip.text).subscribe(order => {
                    console.log('delivery this order', order);
                    this.invoiceService.order = order;
                    this.cashService.openGenericInfo('Information', 'This order was set to "Delivery"');
                  }, err => {
                    console.error('delivery', err);
                    this.cashService.openGenericInfo('Error', 'Can\'t complete delivery operation')
                  });
                })
              } else {
                this.cashService.openGenericInfo('Error', 'Can\'t complete delivery operation because no set Client Phone')
              }
            })
          } else {
            this.cashService.openGenericInfo('Error', 'Can\'t complete delivery operation because no set Client Address')
          }
        })
      } else {
        this.cashService.openGenericInfo('Error', 'Can\'t complete delivery operation because no set Client Name')
      }
    }, err => {
      this.cashService.openGenericInfo('Error', 'Can\'t complete delivery operation')
    });
  }

  getField(title, field, fieldType?: EFieldType): Observable<any> {
    return this.cashService.dialog.open(DialogFilterComponent,
    { width: '1024px', height: '600px', disableClose: true, data: {title: title +' - '+ field,
        type: dataValidation(fieldType)}}).afterClosed();
  }

  getNumField(name, label, fieldType?: EFieldType, height = '650'): Observable<any> {
    return this.cashService.dialog.open(InputCcComponent,
      { width:'480px', height: height + 'px', data:{number:'', name: name, label:label,
          type:dataValidation(fieldType)}, disableClose: true }).afterClosed();
  }

  getOrderInfo()/*: Observable<Order>*/ {
    console.log('getOrderInfo', this.invoiceService.invoice.orderInfo);/*
    this.invoiceService.invoice.subscribe(next => console.log('Invoice', next));*/
    if(this.invoiceService.order && this.invoiceService.order.invoiceId === this.invoiceService.invoice.id){
      this.showOrderInfo(this.invoiceService.order);
    } else {
      return this.cashService.getOrder(this.invoiceService.invoice.receiptNumber).subscribe(
        next => {
          console.log(next);
          this.invoiceService.order = next;
          this.showOrderInfo(this.invoiceService.order);
        },
        err => {
          console.error(err);
          this.cashService.openGenericInfo('Error', 'Can\'t complete get order operation');
        }
      );
    }
  }

  showOrderInfo(order: Order){
    //this.cashService.openGenericInfo(OtherOpEnum.ORDER_INFO, ETXType[order.type.type]);
    this.cashService.dialog.open(OrderInfoComponent,
      { width:'480px', height:'350px', data:{title: OtherOpEnum.ORDER_INFO, subtitle:ETXType[order.type.type],
          type:order.type}, disableClose: true });
  }

  notSale() {
    this.invoiceService.notSale().subscribe(d => {
        console.log("Open cash drawer.")
    });
  }

  /*ebtInquiry() {
    console.log('EBT Inquiry');
    this.currentOperation = 'EBT Inquiry';

    if (this.invoiceService.invoice.total !== 0 || this.invoiceService.invoice.fsTotal !== 0) {
      this.invoiceService.ebtInquiry()
        .subscribe(data => {
          console.log(data);
          if(data.remainingBalance) {
            this.cashService.openGenericInfo('EBT Inquiry', 'Remaining balance:'+ data.remainingBalance,
              'Extra balance:'+ data.extraBalance);
            this.cashService.resetEnableState();
          } else {
            this.cashService.openGenericInfo('Error', 'Can\'t complete ebt inquiry operation');
            this.cashService.ebtEnableState();
          }
        },err => {
          console.log(err);
          this.cashService.openGenericInfo('Error', 'Can\'t complete ebt inquiry operation');
          this.cashService.resetEnableState()
        });
    }
    this.resetInactivity(false);
  }*/

  weightItem() {
    this.cashService.dialog.open(ProductGenericComponent,
      {
        width: '480px', height: '650px', data: {name: 'Weight Item', label: 'Price', unitCost: 0.00},
        disableClose: true
      }).afterClosed().subscribe(
      next => {
        console.log('weightItem', next);
        if(next) {
          this.setWeightedProduct(next['unitCost']);
        }
        /*if(next && !this.cashService.systemConfig.externalScale) {
          this.cashService.dialog.open(ProductGenericComponent,
            {
              width: '480px',
              height: '650px',
              data: {name: 'Set Weight', label: 'Weight (Lbs)', unitCost: 0},
              disableClose: true
            }).afterClosed().subscribe(
            next => {
              this.setWeightedProduct();
            });
          } else {
            this.setWeightedProduct();
          }*/
      });
  }

  setWeightedProduct(price: number){
    if(this.invoiceService.digits){
      // Send scanned product to invoice
      this.invoiceService.getProductByUpc(EOperationType.WeightItem).subscribe(
        next => {
          console.log(next);
          next['unitCost'] = price;
          this.invoiceService.evAddProdByUPC.emit(next);
        },
        err => { this.cashService.openGenericInfo('Error', 'Can\'t get product by upc'); },
        () => this.invoiceService.resetDigits()
      );
    } else {
      // Send misc product to invoice
      this.cashService.openGenericInfo('Information', 'Send misc product to invoice');
      if(!this.cashService.systemConfig.externalScale){
        this.cashService.dialog.open(ProductGenericComponent,
          {
            width: '480px', height: '650px', data: {name: 'Weight', label: 'Weight (Lbs)', unitCost: 0}, disableClose: true
          }).afterClosed().subscribe( (data: any) => {
          if(data) {
            this.invoiceService.weightItem(price, data.unitCost).subscribe(
              i => {
                this.invoiceService.setInvoice(i);
              },
              err => {
                this.invoiceService.resetDigits();
                this.cashService.openGenericInfo('Error', 'Can\'t complete weight operation');
              }
            );
          } else {
            console.log('Weight not specified');
          }
        });
      } else {
        this.invoiceService.weightItem(price);
      }
    }
  }

  splitCard() {
    if(this.invoiceService.invoice.balance){
      this.cashService.dialog.open(ProductGenericComponent,
        {
          width: '480px', height: '650px', data: {unitCost: 0, name: OtherOpEnum.SPLIT_CARD, label: 'Amount',
            max: this.invoiceService.invoice.balance},
          disableClose: true
        }).afterClosed().subscribe(
        next=> {
          console.log(next);
          if(next['unitCost'].toFixed(2) > this.invoiceService.invoice.balance){
            this.cashService.openGenericInfo('Error', 'The spècified amount is superior to amount to pay')
          } else {
            this.setCreditCardType(next['unitCost'].toFixed(2));
          }
        },
        err=> {console.error(err)});
    } else {
      this.cashService.openGenericInfo('Error', 'There is not amount to pay')
    }
  }
}
