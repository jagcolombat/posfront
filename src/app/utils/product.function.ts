import { Product } from '../models';
import { MatDialog } from '@angular/material';
/*import { ProductGenericComponent } from '../components/product-generic/product-generic.component';
import { AgeValidationComponent } from '../components/age-validation/age-validation.component';
import { GenericInfoModalComponent } from '../components/generic-info-modal/generic-info-modal.component';*/
import { ProductOrder } from '../models/product-order.model';
import { DataStorageService } from '../services/api/data-storage.service';
import { ProductsService } from '../services/bussiness-logic/products.service';

const AgeValid = 18;

export function  addProductFunction(product: Product, prodService: ProductsService, dataStore: DataStorageService,
     dialog: MatDialog, action?: (param) => void ): void {

        if (product.ageVerification && !prodService.invoice.clientAge) {
            onAgeVerification(product, prodService, dataStore, dialog, action);
        } else {
            onCreateProductOrder(product, prodService, dataStore, dialog, action);
        }
}

function onCreateProductOrder(product: Product, prodService: ProductsService, dataStore: DataStorageService,
    dialog: MatDialog, action?: (param) => void): void {
    let tax = 0;
        if (product.applyTax && product.followDepartment) {
            tax = dataStore.deparments.filter(dpto => dpto.id === product.departmentId).
                map(dpto => dpto.tax)[0];
        } else
        if (product.applyTax && !product.followDepartment) {
            tax = product.tax;
        }

        const productOrder = createProductOrder(product, prodService.qty, tax);

        if (product.generic) {
            openDialogGenericProd(productOrder, prodService, dataStore, dialog, (po) => action(po));
        } else {
            // tslint:disable-next-line:no-unused-expression
            action(productOrder);
        }
}

  function openDialogGenericProd(productOrder: ProductOrder, prodService: ProductsService,
     dataStore: DataStorageService, dialog: MatDialog, action?: (param) => void): void {
    /*const dialogRef = dialog.open(ProductGenericComponent,
      {
        width: '480px', height: '650px', data: productOrder
      });

      dialogRef.afterClosed().subscribe( (data: ProductOrder) => {
        // prodService.evAddProd.emit(<ProductOrder>data);
        if(data) action(data);
      });*/

  }

  function onAgeVerification(product: Product, prodService: ProductsService, dataStore: DataStorageService,
    dialog: MatDialog, action?: (param) => void) {

    /*const dialogRef = dialog.open(AgeValidationComponent,
      {
        width: '450px', height: '250px'
      });

    dialogRef.afterClosed().subscribe( (data: {age, date}) => {
        console.log(data.age);

        if (data.age) {
            if (data.age >= AgeValid) {
                prodService.invoice.clientAge = data.date;
                onCreateProductOrder(product, prodService, dataStore, dialog, action);
            } else {
              const errorDialogRef = dialog.open(GenericInfoModalComponent,
                {
                  width: '300px', height: '220px', data: {title: 'Error', content: 'Invalid age.'}
                });
            }
        }
      });*/
  }

function createProductOrder(prod: Product, qty: number, tax: number): ProductOrder {
    return new ProductOrder(qty, prod.unitCost, qty * prod.unitCost, tax, prod);
  }
