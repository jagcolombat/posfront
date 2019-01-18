import { Injectable } from '@angular/core';
import {AgeValidationComponent} from "../../components/presentationals/age-validation/age-validation.component";
import {GenericInfoModalComponent} from "../../components/presentationals/generic-info-modal/generic-info-modal.component";
import {MatDialog} from "@angular/material";
import {Product} from "../../models";
import {ProductOrder} from "../../models/product-order.model";
import {Department} from "../../models/department.model";
import {InvoiceService} from "./invoice.service";
import {ProductGenericComponent} from "../../components/presentationals/product-generic/product-generic.component";
import {ProductGeneric} from "../../models/product-generic";
import {Subscription} from "rxjs";

export const AGE = 18;

@Injectable({
  providedIn: 'root'
})
export class ProductOrderService {
  // ageValidation: boolean;
  departments: Department[];
  quantityByProduct = 1;
  subscription: Subscription [] = [];

  constructor(public dialog: MatDialog, private invoiceService: InvoiceService) {
    this.subscription.push(this.invoiceService.evAddProdByUPC.subscribe(prod => this.addProduct(prod)));
  }

  addProduct(product: Product): void {
    if ( product.followDepartment ) {
      const isAgeVerification = this.departments.find(dpto => dpto.id === product.departmentId).ageVerification;
      if (isAgeVerification) {
        this.ageVerification(product);
      } else {
        this.onCreateProductOrder(product);
      }
    } else if (product.ageVerification && !this.invoiceService.invoice.clientAge) {
      this.ageVerification(product);
    } else {
      this.onCreateProductOrder(product);
    }
  }

  onAgeVerification() {
    return this.dialog.open(AgeValidationComponent, { width: '480px', height: '650px', disableClose: true });
  }

  private invalidAge() {
    this.dialog.open(GenericInfoModalComponent,
      { width:'300px', height:'220px', data: {title:'Error', content: 'Invalid age.'}, disableClose: true});
  }

  private onCreateProductOrder(product: Product): void {
    if (product.generic) {
      this.openDialogGenericProd(product);
    } else {
      this.invoiceService.addProductOrder(this.createProductOrder(product));
    }
  }

  private openDialogGenericProd(product: Product): void {
    const dialogRef = this.dialog.open(ProductGenericComponent,
      {
        width: '480px', height: '650px', data: {name: product.name, unitCost: product.unitCost}, disableClose: true
      });
    dialogRef.afterClosed().subscribe( (data: ProductGeneric) => {
      if(data) {
        product.unitCost = data.unitCost;
        this.invoiceService.addProductOrder(this.createProductOrder(product));
      }
    });
  }

  private createProductOrder(prod: Product): ProductOrder {
    let qty = this.invoiceService.qty > 1 ? this.invoiceService.qty: this.quantityByProduct;
    let tax = this.getTax(prod);
    let price = parseFloat(prod.unitCost.toFixed(2));
    let total = parseFloat((qty * price).toFixed(2));
    return new ProductOrder(qty, price, total, tax, prod);
  }

  private getTax(product: Product){
    let tax = 0;
    if (product.applyTax && product.followDepartment) {
      tax = this.departments.filter(dpto => dpto.id === product.departmentId).
      map(dpto => dpto.tax)[0];
    } else if (product.applyTax && !product.followDepartment) {
      tax = product.tax;
    }
    return tax;
  }

  private ageVerification(product: Product) {
    this.onAgeVerification().afterClosed().subscribe(data => {
      if (data.age) {
        if (data.age >= AGE) {
          this.invoiceService.invoice.clientAge = data.age;
          this.onCreateProductOrder(product);
        } else {
          this.invalidAge();
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.map(sub => sub.unsubscribe());
  }

}
