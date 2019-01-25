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
import {BehaviorSubject} from "rxjs";
import {CashService} from "./cash.service";
import {Token} from "../../models";

@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  inactivityTime: number = 600;
  timer: number;
  disableOp = false;

  constructor(private invoiceService: InvoiceService, public cashService: CashService,
              private authService: AuthService, private dialog: MatDialog, private router: Router) {
    this.invoiceService.evAddProd.subscribe(() => this.onAddProduct());
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
    // this.invoiceService.delPOFromInvoice()
    //this.invoiceService.evDelProd.emit(true);
    //this.invoiceService.setTotal();
    if(!1){
      this.invoiceService.evDelProd.emit(true);
      this.invoiceService.setTotal();
    } else {
      this.authService.adminLogged() ? this.invoiceService.evDelProd.emit(true) : this.manager('clear');
    }
    this.resetInactivity(true);
  }

  void() {
    console.log('void');
    this.authService.adminLogged() ? this.cancelCheck() : this.manager('void');
    this.resetInactivity(true);
  }

  plu() {
    console.log('plu');
    // Consume servicio de PLU con this.digits eso devuelve ProductOrder
    this.invoiceService.addProductByUpc(EOperationType.Plu).subscribe(prod => {
      this.invoiceService.evAddProdByUPC.emit(prod);
    }, err => {
      console.error('addProductByUpc', err);
      this.openGenericInfo('Error', 'Can\'t complete get product by plu');
      this.invoiceService.resetDigits();
    });
    this.resetInactivity(false);
  }

  priceCheck() {
    console.log('priceCheck');
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
    /*} else {
      this.router.navigateByUrl('/cash/options');
    }*/

    this.resetInactivity(true);
  }

  hold() {
    if(this.disableOp){
      this.openGenericInfo('Error', 'Not possible Hold Order over Review Check operation');
    } else if (this.invoiceService.invoice.productsOrders.length > 0) {
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
    this.resetInactivity(true);
    if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      this.invoiceService.digits ?
        this.getCheckById(EOperationType.RecallCheck,i => this.invoiceService.setInvoice(i)) :
        this.invoiceService.getInvoicesByStatus(EOperationType.RecallCheck, InvoiceStatus.PENDENT_FOR_PAYMENT)
          .subscribe(next => this.openDialogInvoices(next, i => this.invoiceService.setInvoice(i)),
          err => this.openGenericInfo('Error', 'Can\'t complete recall check operation'));
    } else {
      console.error('Can\'t complete recallw check operation');
      this.openGenericInfo('Error', 'Can\'t complete recall check operation because check is in progress');
    }
  }

  reviewCheck() {
    this.resetInactivity(true);
    this.cashService.resetEvents();
    this.cashService.evEmitReviewCheck.emit();

    if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      if(this.invoiceService.digits) {
        this.disableOp = true;
        this.getCheckById(EOperationType.ReviewCheck, i => this.invoiceService.setInvoice(i));
        this.cashService.evReviewCheck.next(true);
      } else {
        this.openGenericInfo('Error', 'Please input receipt number of check');
        this.invoiceService.resetDigits();
        this.cashService.evReviewCheck.next(false);
      }
    } else {
      console.error('Can\'t complete review check operation');
      this.cashService.evReviewCheck.next(false);
      this.invoiceService.resetDigits();
      this.openGenericInfo('Error', 'Can\'t complete review check operation because check is in progress');
    }
  }

  getCheckById(typeOp: EOperationType, action: (i: Invoice) => void) {
    this.invoiceService.getInvoicesById(typeOp).subscribe(next => action(next),
        err => this.openGenericInfo('Error', 'Can\'t complete get check operation'));
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
    if(this.invoiceService.invoice.status === InvoiceStatus.IN_PROGRESS){
      this.openGenericInfo('Error', 'Can\'t complete logout operation because check is in progress')
    } else {
      this.authService.logout();
      this.invoiceService.resetDigits();
      this.disableOp = false;
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
    this.invoiceService.evDelProd.emit(true);
    this.invoiceService.setTotal();
    this.authService.token = t;
    this.resetInactivity(false);
  }

  openGenericInfo(title: string, content?: string) {
     this.dialog.open(GenericInfoModalComponent,{
        width: '300px', height: '220px', data: {title: title ? title : 'Information', content: content}, disableClose: true
     });
  }

  cash() {
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
          this.invoiceService.cash(payment);
        }
      });
  }

  reprint() {
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
    this.invoiceService.invoice.status = InvoiceStatus.IN_PROGRESS;
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

  goBack() {
    this.cashService.evEmitGoBack.emit();
    this.invoiceService.evCreateInvoice.subscribe(resp => {
      if(resp) { this.cashService.evGoBack.next(true); }
      else this.openGenericInfo('Error', 'Can\'t complete go back operation')
    });
    this.invoiceService.createInvoice();
  }
}
