import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProductsService} from "../../services/products.service";
import {Dpto} from "../../models/dptos.models";
import {ProductGenericComponent} from "../product-generic/product-generic.component";
import {ProductGenericData} from "../../shared/product-generic-data";
import { MatDialog } from '@angular/material';
import {Product} from "../../models/product.model";
import {DataStorageService} from "../../shared/data-storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {map} from "rxjs/operators";
import {ProductOrder} from "../../models/order.model";

@Component({
  selector: 'app-list-prod',
  templateUrl: './list-prod.component.html',
  styleUrls: ['./list-prod.component.css']
})
export class ListProdComponent implements OnInit {
  // @Output() selectProduct = new EventEmitter<any>();
  prods: Product[];
  dptTax: number;
  space = "10px";
  constructor(private prodService: ProductsService, public dialog: MatDialog, private route: ActivatedRoute,
              private router: Router, private dataStore: DataStorageService) {

  }

  ngOnInit() {
    // console.log(this.route.params);
    this.route.params.subscribe(p => this.dptTax = p['tax']);
    this.route.params.subscribe(p => this.dataStore.getProductsByDepartment(p['dpto']).
      subscribe(prods => this.prods = prods));
  }

  addProducts(prod: Product) {
    let qty = 1;
    let selProd = new ProductOrder(qty, prod.unitCost, qty * prod.unitCost, this.dptTax, prod);
    selProd.quantity=1;

    if (this.prodService.qty) selProd.quantity = this.prodService.qty;
    console.log("addProducts", selProd);
    this.prodService.qty = 1;
    this.prodService.selectProduct.emit(selProd);
  }

  doAction(prod: Product) {
    console.log("doAction", prod);
    if (prod.generic) {
      this.openDialogGenericProd(prod);
    } else {
      this.addProducts(prod);
    }
  }

  openDialogGenericProd(prod: Product) {
    // this.loginData = new LoginData("Manager");
    let tax = 0;
    if(prod.applyTax && prod.followDeparment) tax = this.dptTax;
    else if (prod.applyTax && !prod.followDeparment) tax = prod.tax;
    const dialogRef = this.dialog.open(ProductGenericComponent,
      {
        width: '480px', height: '650px', data:  new ProductOrder(1, prod.unitCost, 1 * prod.unitCost, tax, prod)
      });
  }
}
