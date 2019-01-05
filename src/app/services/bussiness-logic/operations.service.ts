import { Injectable } from '@angular/core';
import {InvoiceService} from "./invoice.service";
import {Router} from "@angular/router";
import {AuthService} from "../api/auth.service";
import {MatDialog} from "@angular/material";
import {GenericInfoModalComponent} from "../../components/presentationals/generic-info-modal/generic-info-modal.component";
import {LoginComponent} from "../../components/presentationals/login/login.component";
import {DialogLoginComponent} from "../../components/containers/dialog-login/dialog-login.component";
import {ProductOrderService} from "./product-order.service";

@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  counter: number = 300;
  interval: number;
  constructor(private invoiceService: InvoiceService, private authService: AuthService, private dialog: MatDialog,
              private router: Router) {
    this.invoiceService.evAddProd.subscribe(() => this.resetInactivity(true));
    this.counterInactivity();
  }

  counterInactivity(){
    this.interval = setTimeout(()=> this.logout(), this.counter * 1000);
  }

  resetInactivity(cont: boolean) {
    console.log('resetInactivity');
    clearTimeout(this.interval);
    if(cont) this.counterInactivity();
  }

  clear() {
    console.log('clear');
    this.invoiceService.evDelProd.emit(true);
    this.resetInactivity(true);
  }

  void() {
    console.log('void');
    this.invoiceService.evDelAllProds.emit(true);
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
    const dialogRef = this.dialog.open(DialogLoginComponent, { width: '530px', height: '580px'});
    dialogRef.afterClosed().subscribe(loginValid => {
      console.log('The dialog was closed', loginValid);
      if (loginValid) {
        this.invoiceService.getCashier();
        this.router.navigateByUrl('/cash/options');
      }
    });
    this.resetInactivity(true);
  }

  hold() {
    if (this.invoiceService.invoice.productsOrders.length > 0) {
      this.invoiceService.holdOrder().
      subscribe(result => this.successHoldOrder(result), error1 => this.errorHoldOrder (error1));
    } else {
      console.error('Not possible Hold Order without products this Invoice');
      this.openGenericInfo('Error', 'Not possible Hold Order without products in this Invoice');
    }
  }

  recallCheck() {
    this.invoiceService.digits ?
      this.invoiceService.recallCheckByOrder().subscribe(inv => this.invoiceService.setInvoice(inv), err => console.log(err)) :
      this.invoiceService.recallCheck();
  }

  logout() {
    console.log('logout');
    this.authService.logout();
    this.resetInactivity(false);
  }

  successHoldOrder(resp: any) {
    console.log(resp, typeof resp);
    this.invoiceService.getReceiptNumber();
  }

  errorHoldOrder(e) {
    console.log(e, typeof e);
    this.openGenericInfo('Error', 'Can\'t complete hold order operation');
  }

  openGenericInfo(title: string, content?: string) {
     this.dialog.open(GenericInfoModalComponent,{
        width: '300px', height: '220px', data: {title: title ? title : 'Information', content: content}
     });
  }

}
