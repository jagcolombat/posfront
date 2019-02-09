import {Injectable} from '@angular/core';
import {InvoiceService} from "./invoice.service";
import {Router} from "@angular/router";
import {AuthService} from "../api/auth.service";
import {MatDialog} from "@angular/material";
import {GenericInfoModalComponent} from "../../components/presentationals/generic-info-modal/generic-info-modal.component";
import {DialogLoginComponent} from "../../components/containers/dialog-login/dialog-login.component";
import {Invoice} from "../../models/invoice.model";
import {DialogInvoiceComponent} from "../../components/presentationals/dialog-invoice/dialog-invoice.component";
import {CashOpComponent} from "../../components/presentationals/cash-op/cash-op.component";
import {CashPaymentComponent} from "../../components/presentationals/cash-payment/cash-payment.component";
import {InvoiceStatus} from "../../utils/invoice-status.enum";
import {EOperationType} from "../../utils/operation.type.enum";
import {CashService} from "./cash.service";
import {Token} from "../../models";
import {FinancialOpEnum, TotalsOpEnum} from "../../utils/operations";
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  inactivityTime: number = 600;
  timer: number;
  currentOperation: string;

  constructor(private invoiceService: InvoiceService, public cashService: CashService,
              private authService: AuthService, private dialog: MatDialog, private router: Router) {
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
    if(!this.invoiceService.invoiceProductSelected || this.currentOperation === FinancialOpEnum.REVIEW ||
      this.currentOperation === TotalsOpEnum.FS_SUBTOTAL || this.currentOperation === TotalsOpEnum.SUBTOTAL) {
      this.clearOp(false);
    } else {
      this.authService.adminLogged() ? this.clearOp() : this.manager('clear');
    }
    this.resetInactivity(true);
  }

  clearOp(total:boolean = true){
    this.invoiceService.evDelProd.emit(true);
    if(total) this.invoiceService.setTotal();
    if(this.currentOperation === FinancialOpEnum.REVIEW || this.currentOperation === TotalsOpEnum.FS_SUBTOTAL ||
      this.currentOperation === TotalsOpEnum.SUBTOTAL){
        this.cashService.resetEnableState();
        if(this.currentOperation === FinancialOpEnum.REVIEW) {
          this.invoiceService.createInvoice();
        }
    }
  }

  void() {
    console.log('void');
    this.currentOperation = 'void';
    this.authService.adminLogged() ? this.cancelCheck() : this.manager('void');
    this.resetInactivity(true);
  }

  plu() {
    console.log('plu');
    this.currentOperation = 'plu';
    // Consume servicio de PLU con this.digits eso devuelve ProductOrder
    this.invoiceService.addProductByUpc(EOperationType.Plu).subscribe(prod => {
      this.invoiceService.evAddProdByUPC.emit(prod);
    }, err => {
      console.error('addProductByUpc', err);
      this.openGenericInfo('Error', 'Can\'t complete get product by plu');
    }, () => this.invoiceService.resetDigits());
    this.resetInactivity(false);
  }

  priceCheck() {
    console.log('priceCheck');
    this.currentOperation = 'priceCheck';
    this.invoiceService.getProductByUpc(EOperationType.PriceCheck).subscribe(prod => {
      this.dialog.open(GenericInfoModalComponent, { width: '350px', height: '250px',
        data: { title: 'Price Check', content: prod.name, price: prod.unitCost }, disableClose: true});
    }, err => { this.openGenericInfo('Error', 'Can\'t found this product '+ this.invoiceService.digits); });
    this.invoiceService.resetDigits();
    this.resetInactivity(true);
  }

  numpadInput(ev) {
    this.invoiceService.evNumpadInput.emit(ev)
  }

  manager(action?: string) {
    console.log('manager');
    // this.currentOperation = 'manager';
    // if(!this.authService.adminLogged()){
      const dialogRef = this.dialog.open(DialogLoginComponent, { width: '530px', height: '580px', disableClose: true});
      dialogRef.afterClosed().subscribe(loginValid => {
        console.log('The dialog was closed', loginValid);
        if(loginValid.valid) {
          if(action){
            switch (action) {
              case 'void':
                this.cancelCheckByAdmin(loginValid.token);
                break;
              case 'clear':
                this.clearCheckByAdmin(loginValid.token);
                break;
            }
          } else {
            this.invoiceService.getCashier();
            this.router.navigateByUrl('/cash/options');
          }
        }
      });

    this.resetInactivity(true);
  }

  hold() {
    console.log('hold');
    this.currentOperation = 'hold';
    if (this.invoiceService.invoice.productsOrders.length > 0) {
      this.invoiceService.holdOrder().
      subscribe(
        next => this.invoiceService.createInvoice(),
        err => this.openGenericInfo('Error', 'Can\'t complete hold order operation'));
    } else {
      this.openGenericInfo('Error', 'Not possible Hold Order without products in this Invoice');
    }
    this.resetInactivity(true);
  }

  recallCheck() {
    console.log('recallCheck');
    this.currentOperation = 'recallCheck';

    this.resetInactivity(true);
    if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      this.invoiceService.digits ?
        this.getCheckById(EOperationType.RecallCheck,i => {
          this.invoiceService.setInvoice(i);}) :
        this.invoiceService.getInvoicesByStatus(EOperationType.RecallCheck, InvoiceStatus.IN_HOLD)
          .subscribe(next => this.openDialogInvoices(next, i => {
              this.invoiceService.setInvoice(i);}),
          err => this.openGenericInfo('Error', 'Can\'t complete recall check operation'));
    } else {
      console.error('Can\'t complete recallw check operation');
      this.openGenericInfo('Error', 'Can\'t complete recall check operation because check is in progress');
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
        this.openGenericInfo('Error', 'Please input receipt number of check');
        this.invoiceService.resetDigits();
      }
    } else {
      console.error('Can\'t complete review check operation');
      this.invoiceService.resetDigits();
      this.openGenericInfo('Error', 'Can\'t complete review check operation because check is in progress');
    }
  }

  subTotal(){
    console.log('subTotal');
    if (this.invoiceService.invoice.productsOrders.length > 0) {
      this.currentOperation = TotalsOpEnum.SUBTOTAL;
      this.cashService.totalsEnableState();
    }
  }

  fsSubTotal(){
    console.log('fsSubTotal');
    this.currentOperation = TotalsOpEnum.FS_SUBTOTAL;
    this.cashService.totalsEnableState(true);

  }

  getCheckById(typeOp: EOperationType, action: (i: Invoice) => void) {
    this.invoiceService.getInvoicesById(typeOp)
        .subscribe(next => action(next),
                    (err: HttpErrorResponse) =>
                       this.openGenericInfo('Error', 'Can\'t complete get check operation. ' + err.statusText));
  }

  openDialogInvoices(inv: Invoice[], action: (i: Invoice) => void) {
      if (inv.length > 0) {
        const dialogRef = this.dialog.open(DialogInvoiceComponent,
          {
            width: '700px', height: '450px', data: inv, disableClose: true
          });
        dialogRef.afterClosed().subscribe(order => {
          console.log('The dialog was closed', order);
          if (order) { action(order); }
        });
      } else {
        this.openGenericInfo('Information', 'Not exist hold orders');
      }
  }

  refund() {
    console.log('refund');
    this.currentOperation = 'refund';

    if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      this.invoiceService.digits ?
        this.invoiceService.refund().subscribe(i => {
            this.invoiceService.setInvoice(i);
          },
          err => {
            console.error(err);
            this.invoiceService.resetDigits();
            this.openGenericInfo('Error', 'Can\'t complete refund operation');
          }
        )
        :
        this.openGenericInfo('Error', 'Please input receipt number of check');
    } else {
      console.error('Can\'t complete refund operation');
      this.invoiceService.resetDigits();
      this.openGenericInfo('Error', 'Can\'t complete refund operation because check is in progress');
    }

  }

  logout() {
    console.log('logout');
    this.currentOperation = 'logout';

    if(this.invoiceService.invoice.status === InvoiceStatus.IN_PROGRESS){
      this.openGenericInfo('Error', 'Can\'t complete logout operation because check is in progress')
    } else {
      this.authService.logout();
      this.invoiceService.resetDigits();
      this.cashService.resetEnableState();
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

  openGenericInfo(title: string, content?: string) {
     this.dialog.open(GenericInfoModalComponent,{
        width: '300px', height: '220px', data: {title: title ? title : 'Information', content: content}, disableClose: true
     });
  }

  cash() {
    console.log('cash');
    this.currentOperation = 'cash';

    if (this.invoiceService.invoice.total > 0) {
      const dialogRef = this.dialog.open(CashOpComponent,
        {
          width: '480px', height: '660px', data: this.invoiceService.invoice.total, disableClose: true
        }).afterClosed().subscribe(data => {
        console.log('The dialog was closed', data);
        // this.paymentData = data;
        if (data > 0) {
          let valueToReturn = data - this.invoiceService.invoice.total;
          this.cashReturn(valueToReturn, data);
        } else {
          this.currentOperation = TotalsOpEnum.SUBTOTAL;
        }
      });
    }

    this.resetInactivity(false);
  }

  cashReturn(valueToReturn, payment) {
    const dialogRef = this.dialog.open(CashPaymentComponent,
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
              err => {console.log(err); this.openGenericInfo('Error', 'Can\'t complete cash operation')},
              () => this.cashService.resetEnableState())
        }
      });
  }

  reprint() {
    console.log('reprint');
    this.currentOperation = 'reprint';

    if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      if(this.invoiceService.digits) {
        this.getCheckById(EOperationType.Reprint,i => {
          this.invoiceService.resetDigits();
          this.invoiceService.print(i).subscribe(
            data => this.openGenericInfo('Print', 'Print is finish'),
            err => this.openGenericInfo('Error', 'Can\'t complete print operation'));
        })
      } else {
        this.openGenericInfo('Error', 'Please input receipt number of check');
        this.invoiceService.resetDigits();
      }

    } else {
      console.error('Can\'t complete print operation');
      this.openGenericInfo('Error', 'Can\'t complete print operation');
      this.invoiceService.resetDigits();
    }

  }

  onAddProduct(){
    this.resetInactivity(true);
    // this.invoiceService.invoice.status = InvoiceStatus.IN_PROGRESS;
  }

  scanProduct(){
    this.invoiceService.addProductByUpc(EOperationType.Scanner).subscribe(prod => {
      this.invoiceService.evAddProdByUPC.emit(prod);
    }, err => {
      console.error('addProductByUpc', err);
      this.invoiceService.resetDigits();
      this.openGenericInfo('Error', 'Can\'t complete scan product operation');
    });
    this.resetInactivity(false);
  }

  ebt() {
    // this.invoiceService.invoice.productsOrders[0].product.
  }

  debit() {

  }
}
