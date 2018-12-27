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

export const AGE = 18;

@Injectable({
  providedIn: 'root'
})
export class ProductOrderService {
  ageValidation: boolean;
  departments: Department[];
  quantityByProduct = 1;

  constructor(public dialog: MatDialog, private invoiceService: InvoiceService) { }

  addProduct(product: Product): void {
    if (product.ageVerification && !this.ageValidation) {
      this.onAgeVerification().afterClosed().subscribe(data => {
        if (data.age && data.age >= AGE) {
          this.ageValidation=true;
          this.onCreateProductOrder(product);
        } else {
          this.invalidAge();
        }
      });
    } else {
      this.onCreateProductOrder(product);
    }
  }

  onAgeVerification() {
    return this.dialog.open(AgeValidationComponent, { width: '450px', height: '250px' });
  }

  private invalidAge() {
    this.ageValidation=false;
    this.dialog.open(GenericInfoModalComponent,
      { width:'300px', height:'220px', data: {title:'Error', content: 'Invalid age.'}});
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
        width: '480px', height: '650px', data: {name: product.name, unitCost: product.unitCost}
      });
    dialogRef.afterClosed().subscribe( (data: ProductGeneric) => {
      if(data) {
        product.unitCost = data.unitCost;
        this.invoiceService.addProductOrder(this.createProductOrder(product));
      }
    });
  }

  private createProductOrder(prod: Product): ProductOrder {
    let qty = this.quantityByProduct;
    let tax = this.getTax(prod);
    return new ProductOrder(qty, prod.unitCost, qty * prod.unitCost, tax, prod);
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

}
