import {Injectable, OnDestroy} from '@angular/core';
import {AgeValidationComponent} from '../../components/presentationals/age-validation/age-validation.component';
import {GenericInfoModalComponent} from '../../components/presentationals/generic-info-modal/generic-info-modal.component';
import {Product} from '../../models';
import {ProductOrder} from '../../models/product-order.model';
import {Department} from '../../models/department.model';
import {InvoiceService} from './invoice.service';
import {ProductGenericComponent} from '../../components/presentationals/product-generic/product-generic.component';
import {ProductGeneric} from '../../models/product-generic';
import {Subscription} from 'rxjs';
import {CashService} from './cash.service';
import {EOperationType} from '../../utils/operation.type.enum';
import {OperationsService} from './operations.service';
import {InvioceOpEnum} from '../../utils/operations';
import {StockOpEnum} from '../../utils/operations/stock-op.enum';
import {ScanOpEnum} from '../../utils/operations/scanner-op.enum';
import {InformationType} from '../../utils/information-type.enum';
import {InitViewService} from './init-view.service';

export const AGE = 18;

@Injectable({
  providedIn: 'root'
})
export class ProductOrderService implements OnDestroy {
  // ageValidation: boolean;
  departments: Department[];
  quantityByProduct = 1;
  subscription: Subscription [] = [];

  constructor(private invoiceService: InvoiceService, private cashService: CashService,
              private operationService: OperationsService, private initService: InitViewService) {
    this.subscription.push(this.operationService.evAddProdByUPC.subscribe(prod => this.addProduct(prod)));
    this.subscription.push(this.operationService.evAddProdGen.subscribe(prod => this.productGeneric(prod)));
  }

  addProduct(product: Product): void {
    this.initService.setOperation(EOperationType.Add, 'Product', 'Before add product id: ' + product.id);
    if (this.invoiceService.allowAddProductByStatus()) {
      if (!this.isAddByPluOrScan()) {
        this.operationService.currentOperation = StockOpEnum.ADD_PROD;
      }
      if (product.followDepartment && this.departments) {
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
    } else {
      this.cashService.openGenericInfo(InformationType.INFO, 'Invoice status no let add products');
    }
  }

  isAddByPluOrScan() {
    return this.operationService.currentOperation === InvioceOpEnum.PLU ||
      this.operationService.currentOperation === ScanOpEnum.SCAN_PROD;
  }

  onAgeVerification() {
    return this.cashService.dialog.open(AgeValidationComponent, { width: '480px', height: '650px', disableClose: true });
  }

  private invalidAge() {
    this.cashService.dialog.open(GenericInfoModalComponent,
      { width: '300px', height: '220px', data: {title: 'Error', content: 'Invalid age.'}, disableClose: true});
  }

  private onCreateProductOrder(product: Product): void {
    if (product.scalable || product.generic || product.wic ) {
      if (product.wic) {
        this.productWeightFormat(product);
      } else if (product.scalable) {
        this.productScalable(product);
      } else if (product.generic) {
        console.log('adminLogged', this.invoiceService.authService.adminLogged());
        this.cashService.config.sysConfig.allowAddProdGen ?
          this.productGeneric(product) :
          this.invoiceService.authService.adminLogged() ?
            this.productGeneric(product) :
            this.operationService.manager('prodGen', product);
      }
    } else {
      this.invoiceService.addProductOrder(this.createProductOrder(product));
    }
  }

  productGeneric(product: Product) {
    console.log('Product generic', this.operationService.currentOperation);
    if (this.invoiceService.allowAddProductByStatus()) {
      (product.prefixIsPrice && !this.isAddByPluOrScan()) ?
        this.prefixIsPrice(product) :
        this.openDialogGenericProd(product);
    }
  }

  productWeightFormat(product: Product) {
    if (this.invoiceService.priceWic) {
      if (product.unitCost) {
        this.quantityByProduct = Number(((+this.invoiceService.priceWic / 100) / product.unitCost).toFixed(2));
        this.invoiceService.addProductOrder(this.createProductOrder(product, +this.invoiceService.priceWic / 100));
      } else {
        this.cashService.openGenericInfo('Error', 'Can\'t add weight format product because unit cost is 0');
        this.invoiceService.resetDigits();
      }
      this.invoiceService.priceWic = '';
    } else {
      this.productScalable(product);
    }

  }

  productScalable(product: Product) {
    this.cashService.config.sysConfig.externalScale ?
      product.generic ? this.openDialogGenericProd(product) : this.invoiceService.addProductOrder(this.createProductOrder(product)) :
      this.openDialogScalableProd(product);
  }

  private openDialogGenericProd(product: Product): void {
    const dialogRef = this.cashService.dialog.open(ProductGenericComponent,
      {
        width: '480px', height: '650px', data: {name: product.name, label: 'Price', unitCost: product.unitCost},
        disableClose: true
      });
    dialogRef.afterClosed().subscribe( (data: ProductGeneric) => {
      if (data) {
        product.unitCost = data.unitCost;
        this.invoiceService.addProductOrder(this.createProductOrder(product));
      }
    });
  }

  private openDialogScalableProd(product: Product): void {
    console.log('openDialogScalableProd', product);
    if (this.invoiceService.qty > 0 && this.invoiceService.qty !== 1) {
      this.addProdScalable(product, this.invoiceService.qty);
    } else {
      const dialogRef = this.cashService.dialog.open(ProductGenericComponent,
        {
          width: '480px', height: '650px', data: {name: product.name, label: 'Weight (Lbs)', unitCost: 0}, disableClose: true
        });
      dialogRef.afterClosed().subscribe( (data: ProductGeneric) => {
        if (data) {
          /*this.quantityByProduct = data.unitCost;
          product.generic ? this.openDialogGenericProd(product):
            this.invoiceService.addProductOrder(this.createProductOrder(product));*/
          this.addProdScalable(product, data.unitCost);
        }
      });
    }

  }

  addProdScalable(product: Product, amount: number) {
    this.quantityByProduct = amount;
    product.generic ? this.openDialogGenericProd(product) :
      this.invoiceService.addProductOrder(this.createProductOrder(product));
  }

  private createProductOrder(prod: Product, totalWF?: number): ProductOrder {
    const qty = this.invoiceService.qty > 1 ? this.invoiceService.qty : this.quantityByProduct;
    if (this.quantityByProduct !== 1) { this.quantityByProduct = 1; }
    const tax = this.getTax(prod);
    const price = Number(prod.unitCost.toFixed(2));
    const total = Number((qty * price).toFixed(2));
    // let total = Number((qty * price).toFixed(2));
    return new ProductOrder(qty, prod.unitCost, totalWF ? totalWF : total, tax, 0, prod.id, prod.upc,
      prod.name, prod.foodStamp, prod.isRefund, 0, prod.scalable);
  }

  private getTax(product: Product) {
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
    if (this.invoiceService.digits) {
      if (this.invoiceService.digits.includes('@')) {
        const qtyPrice = this.invoiceService.digits.split('@').map(value => value.trim());
        this.quantityByProduct = +qtyPrice[0];
        this.invoiceService.digits = qtyPrice[1];
      }
      if (this.invoiceService.digits.length > 5 ) {
        this.cashService.openGenericInfo('Information', 'The price specified is too long');
        this.invoiceService.resetDigits();
      } else {
        const prefixPrice = (+this.invoiceService.digits / 100).toFixed(2);
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
