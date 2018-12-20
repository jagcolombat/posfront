import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProductsService} from '../../services/products.service';
import {Dpto} from '../../models/dptos.models';
import {ProductGenericComponent} from '../product-generic/product-generic.component';
import {ProductGenericData} from '../../shared/product-generic-data';
import { MatDialog } from '@angular/material';
import {Product} from '../../models/product.model';
import {DataStorageService} from '../../shared/data-storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {ProductOrder} from '../../models/order.model';
import { AgeValidationComponent } from '../age-validation/age-validation.component';
import { GenericInfoModalComponent } from '../generic-info-modal/generic-info-modal.component';
import { addProductFunction } from '../../../../../../../refactoring/pos-fronted-tony/src/app/utils/product.function';

const AgeValid = 18;
@Component({
  selector: 'app-list-prod',
  templateUrl: './list-prod.component.html',
  styleUrls: ['./list-prod.component.css']
})
export class ListProdComponent implements OnInit {
  // @Output() selectProduct = new EventEmitter<any>();
  prods: Product[];
  dptTax: number;
  space = '10px';

  constructor(private prodService: ProductsService, public dialog: MatDialog, private route: ActivatedRoute,
              private router: Router, private dataStore: DataStorageService) {

  }

  ngOnInit() {
    // console.log(this.route.params);
    this.route.params.subscribe(p => this.dptTax = p['tax']);
    this.route.params.subscribe(p => this.dataStore.getProductsByDepartment(p['dpto']).
      subscribe(prods => this.prods = prods));
  }

  addProducts(selProd: ProductOrder): void {

    console.log('addProducts', selProd);
    this.prodService.selectProduct.emit(selProd);
  }

  doAction(prod: Product) {
    console.log('doAction', prod);
    addProductFunction(prod, this.prodService, this.dataStore, this.dialog, (po) => this.addProducts(po));
  }
}
