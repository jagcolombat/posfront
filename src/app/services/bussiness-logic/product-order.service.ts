import {Injectable, OnDestroy} from '@angular/core';
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
import {CashService} from "./cash.service";
import {EOperationType} from "../../utils/operation.type.enum";
import {OperationsService} from "./operations.service";
import {InvioceOpEnum} from "../../utils/operations";

export const AGE = 18;

@Injectable({
  providedIn: 'root'
})
export class ProductOrderService implements OnDestroy {
  // ageValidation: boolean;
  departments: Department[];
  quantityByProduct = 1;
  subscription: Subscription [] = [];

  constructor(public dialog: MatDialog, private invoiceService: InvoiceService, private cashService: CashService,
              private operationService: OperationsService) {
    this.subscription.push(this.invoiceService.evAddProdByUPC.subscribe(prod => this.addProduct(prod)));
    this.subscription.push(this.operationService.evAddProdGen.subscribe(prod => this.productGeneric(prod)));
  }

  addProduct(product: Product): void {
    if ( product.followDepartment ) {
      const dpto = this.departments.find(dpto => dpto.id === product.departmentId);
      // const isAgeVerification = this.departments.find(dpto => dpto.id === product.departmentId).ageVerification;
      if (dpto && dpto.ageVerification && !this.invoiceService.invoice.clientAge) {
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
    if (product.scalable || product.generic|| product.wic ) {
      if(product.wic){
        this.productWeightFormat(product);
      } else if (product.scalable) {
        this.productScalable(product);
      } else if (product.generic) {
        console.log('adminLogged', this.invoiceService.authService.adminLogged());
        this.cashService.systemConfig.allowAddProdGen ?
          this.productGeneric(product):
          this.invoiceService.authService.adminLogged() ?
            this.productGeneric(product) :
            this.operationService.manager('prodGen', product);
      }
    } else {
      this.invoiceService.addProductOrder(this.createProductOrder(product));
    }
  }

  productGeneric(product: Product){
    console.log('Product generic', this.operationService.currentOperation);
    (product.prefixIsPrice && this.operationService.currentOperation !== InvioceOpEnum.PLU)?
      this.prefixIsPrice(product):
      this.openDialogGenericProd(product);
  }

  productWeightFormat(product: Product){
    if(this.invoiceService.priceWic){
      if(product.unitCost) {
        this.quantityByProduct = Number(((+this.invoiceService.priceWic/100) / product.unitCost).toFixed(2));
        this.invoiceService.addProductOrder(this.createProductOrder(product, +this.invoiceService.priceWic/100));
      } else {
        this.cashService.openGenericInfo('Error', 'Can\'t add weight format product because unit cost is 0');
        this.invoiceService.resetDigits();
      }
      this.invoiceService.priceWic = '';
    } else {
      this.productScalable(product);
    }

  }

  productScalable(product: Product){
    this.cashService.systemConfig.externalScale ?
      product.generic ? this.openDialogGenericProd(product): this.invoiceService.addProductOrder(this.createProductOrder(product)) :
      this.openDialogScalableProd(product);
  }

  private openDialogGenericProd(product: Product): void {
    const dialogRef = this.dialog.open(ProductGenericComponent,
      {
        width: '480px', height: '650px', data: {name: product.name, label: 'Price', unitCost: product.unitCost},
        disableClose: true
      });
    dialogRef.afterClosed().subscribe( (data: ProductGeneric) => {
      if(data) {
        product.unitCost = data.unitCost;
        this.invoiceService.addProductOrder(this.createProductOrder(product));
      }
    });
  }

  private openDialogScalableProd(product: Product): void {
    const dialogRef = this.dialog.open(ProductGenericComponent,
      {
        width: '480px', height: '650px', data: {name: product.name, label: 'Weight (Lbs)', unitCost: 0}, disableClose: true
      });
    dialogRef.afterClosed().subscribe( (data: ProductGeneric) => {
      if(data) {
        this.quantityByProduct = data.unitCost;
        product.generic ? this.openDialogGenericProd(product):
          this.invoiceService.addProductOrder(this.createProductOrder(product));
      }
    });
  }

  private createProductOrder(prod: Product, totalWF?: number): ProductOrder {
    let qty = this.invoiceService.qty > 1 ? this.invoiceService.qty: this.quantityByProduct;
    if(this.quantityByProduct !== 1) this.quantityByProduct = 1;
    let tax = this.getTax(prod);
    let price = Number(prod.unitCost.toFixed(2));
    let total = Number((qty * price).toFixed(2));
    //let total = Number((qty * price).toFixed(2));
    return new ProductOrder(qty, prod.unitCost, totalWF ? totalWF : total, tax, 0, prod.id, prod.upc,
      prod.name, prod.foodStamp, prod.isRefund, 0, prod.scalable);
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
        if (data.age >= product.ageAllow) {
          this.invoiceService.updateClientAge(data.age);
          this.onCreateProductOrder(product);
        } else {
          this.invalidAge();
        }
      }
    });
  }

  private prefixIsPrice(product: Product) {
    if(this.invoiceService.digits){
      if(this.invoiceService.digits.includes('@')){
        let qtyPrice = this.invoiceService.digits.split('@').map(value => value.trim());
        this.quantityByProduct = +qtyPrice[0];
        this.invoiceService.digits = qtyPrice[1];
      }
      if(this.invoiceService.digits.length > 5 ){
        this.cashService.openGenericInfo('Information', 'The price specified is too long');
        this.invoiceService.resetDigits();
      } else {
        let prefixPrice = (+this.invoiceService.digits / 100).toFixed(2);
        product.unitCost = +prefixPrice;
        this.invoiceService.addProductOrder(this.createProductOrder(product));
      }
    } else {
      console.info('No specified price for product with prefixIsPrice');
      this.openDialogGenericProd(product);
    }
  }

  ngOnDestroy() {
    this.subscription.map(sub => sub.unsubscribe());
  }

}
