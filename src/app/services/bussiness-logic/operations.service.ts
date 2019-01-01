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
    this.resetInactivity(true);
  }

  logout() {
    console.log('logout');
    this.authService.logout();
    this.resetInactivity(false);
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

  numpadInput(ev) {
    this.invoiceService.evNumpadInput.emit(ev)
  }
}
