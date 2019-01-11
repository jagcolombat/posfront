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

@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  inactivityTime: number = 300;
  timer: number;
  constructor(private invoiceService: InvoiceService, private authService: AuthService, private dialog: MatDialog,
              private router: Router) {
    this.invoiceService.evAddProd.subscribe(() => this.resetInactivity(true));
    this.counterInactivity();
  }

  counterInactivity(){
    this.timer = setTimeout(()=> this.logout(), this.inactivityTime * 1000);
  }

  resetInactivity(cont: boolean) {
    console.log('resetInactivity');
    clearTimeout(this.timer);
    if(cont) this.counterInactivity();
  }

  clear() {
    console.log('clear');
    this.invoiceService.evDelProd.emit(true);
    this.resetInactivity(true);
  }

  void() {
    console.log('void');
    this.authService.adminLogged() ? this.cancelCheck() : this.manager();
    this.resetInactivity(true);
  }

  plu() {
    console.log('plu');
    // Consume servicio de PLU con this.digits eso devuelve ProductOrder
    this.invoiceService.addProductByUpc();
    this.resetInactivity(true);
  }

  priceCheck() {
    console.log('priceCheck');
    this.invoiceService.getProductByUpc().subscribe(prod => {
      this.dialog.open(GenericInfoModalComponent, { width: '350px', height: '250px',
        data: { title: 'Price Check', content: prod.name, price: prod.unitCost }})
        .afterClosed().subscribe(ev => {
          this.invoiceService.resetDigits();
      });
    });
    this.resetInactivity(true);
  }

  numpadInput(ev) {
    this.invoiceService.evNumpadInput.emit(ev)
  }

  manager() {
    console.log('manager');
    if(!this.authService.adminLogged()){
      const dialogRef = this.dialog.open(DialogLoginComponent, { width: '530px', height: '580px'});
      dialogRef.afterClosed().subscribe(loginValid => {
        console.log('The dialog was closed', loginValid);
        if (loginValid) {
          this.invoiceService.getCashier();
          this.router.navigateByUrl('/cash/options');
        }
      });
    } else {
      this.router.navigateByUrl('/cash/options');
    }

    this.resetInactivity(true);
  }

  hold() {
    if (this.invoiceService.invoice.productsOrders.length > 0) {
      this.invoiceService.holdOrder().
      subscribe(
        next => this.invoiceService.createInvoice(),
        err => this.openGenericInfo('Error', 'Can\'t complete hold order operation'));
    } else {
      this.openGenericInfo('Error', 'Not possible Hold Order without products in this Invoice');
    }
  }

  recallCheck() {
    return this.invoiceService.digits ?
      this.getCheckById(EOperationType.RecallCheck) :
      this.invoiceService.getInvoicesByStatus(EOperationType.RecallCheck, InvoiceStatus.PENDENT_FOR_PAYMENT)
        .subscribe(next => this.openDialogInvoices(next),
        err => this.openGenericInfo('Error', 'Can\'t complete recall check operation'));
  }

  reviewCheck() {
    return this.invoiceService.digits ?
      this.getCheckById(EOperationType.ReviewCheck) :
      this.invoiceService.getInvoicesByStatus(EOperationType.ReviewCheck)
        .subscribe(next => this.openDialogInvoices(next),
          err => this.openGenericInfo('Error', 'Can\'t complete review check operation'));
  }

  getCheckById(typeOp: EOperationType) {
    this.invoiceService.getInvoicesById(typeOp).subscribe(next => this.invoiceService.setInvoice(next),
        err => this.openGenericInfo('Error', 'Can\'t complete get check operation'));
  }

  openDialogInvoices(inv: Invoice[]) {
      if (inv.length > 0) {
        const dialogRef = this.dialog.open(DialogInvoiceComponent,
          {
            width: '700px', height: '450px', data: inv
          });
        dialogRef.afterClosed().subscribe(order => {
          console.log('The dialog was closed', order);
          if (order) { this.invoiceService.setInvoice(order); }
        });
      } else {
        this.openGenericInfo('Information', 'Not exist hold orders');
      }
  }

  logout() {
    console.log('logout');
    this.authService.logout();
    this.invoiceService.resetDigits();
    this.resetInactivity(false);
  }

  cancelCheck() {
    console.log('cancelar factura');
    this.invoiceService.cancelInvoice().subscribe(next => {
      this.invoiceService.createInvoice();
    },err => console.error('cancelCheck failed'));
  }

  openGenericInfo(title: string, content?: string) {
     this.dialog.open(GenericInfoModalComponent,{
        width: '300px', height: '220px', data: {title: title ? title : 'Information', content: content}
     });
  }

  cash() {
    if (this.invoiceService.invoice.total > 0) {
      const dialogRef = this.dialog.open(CashOpComponent,
        {
          width: '480px', height: '660px', data: this.invoiceService.invoice.total
        }).afterClosed().subscribe(data => {
        console.log('The dialog was closed', data);
        // this.paymentData = data;
        if (data > 0) {
          let valueToReturn = data - this.invoiceService.invoice.total;
          this.cashReturn(valueToReturn, data);
        }
      });
    }
  }

  cashReturn(valueToReturn, payment) {
    const dialogRef = this.dialog.open(CashPaymentComponent,
      {
        width: '300px', height: '200px', data: valueToReturn
      })
      .afterClosed().subscribe((result: string) => {
        if (result !== '') {
          this.invoiceService.cash(payment);
        }
      });
  }

  reprint() {
    return this.invoiceService.digits ?
      this.getCheckById(EOperationType.Reprint) :
      this.invoiceService.getInvoicesByStatus(EOperationType.Reprint)
        .subscribe(next => this.openDialogInvoices(next),
          err => this.openGenericInfo('Error', 'Can\'t complete recall check operation'));
  }
}
