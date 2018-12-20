import { Component, OnInit } from '@angular/core';
import {Department} from '../../../models/department.model';
/*import {dptos} from '../../shared/dptos-data';
import {Dpto} from '../../models/dptos.models';
import {ActivatedRoute, Router} from '@angular/router';
import { MatDialog } from '@angular/material';
import {ProductGenericComponent} from '../product-generic/product-generic.component';
import {ProductGenericData} from '../../shared/product-generic-data';
import {DataStorageService} from '../../shared/data-storage.service';

import {ProductOrder} from '../../models/order.model';
import {Observable, Subscription} from 'rxjs';
import {Product} from '../../models';
import { addProductFunction } from '../../../../../../../refactoring/pos-fronted-tony/src/app/utils/product.function';
import { ProductsService } from 'src/app/services/products.service';*/

@Component({
  selector: 'list-dpto',
  templateUrl: './list-dpto.component.html',
  styleUrls: ['./list-dpto.component.css']
})
export class ListDptoComponent implements OnInit {
  dptos: Department[];
  space = '10px';

  /*constructor(private route: ActivatedRoute, private router: Router, public dialog: MatDialog,
              private dataStore: DataStorageService, private prodService: ProductsService) {
    this.dataStore.getDepartments().subscribe(dptos => this.dataStore.deparments = this.dptos = dptos );
  }*/

  ngOnInit() {
  }

  /*doAction(dpto: Department) {
    console.log('doAction', dpto);

    if (dpto.generic) {
      this.getGenericProdByDpto(dpto);
    } else {
      this.router.navigateByUrl('/home/products/' + dpto.id + '/' + dpto.tax);
    }
  }

  getGenericProdByDpto(dpto: Department) {
    this.dataStore.getProductsByDepartment(dpto.id).subscribe(prods => {
      prods.filter(p => p.name === dpto.name)
      .map(pg =>  addProductFunction(pg, this.prodService, this.dataStore, this.dialog, (po) => this.addProducts(po)));
    });
  }

  private addProducts(selProd: ProductOrder): void {

    console.log('addProducts', selProd);
    this.prodService.selectProduct.emit(selProd);
  }*/

}
