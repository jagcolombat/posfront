import { Component, OnInit } from '@angular/core';
import {dptos} from "../../shared/dptos-data";
import {Dpto} from "../../models/dptos.models";
import {ActivatedRoute, Router} from "@angular/router";
import { MatDialog } from '@angular/material';
import {ProductGenericComponent} from "../product-generic/product-generic.component";
import {ProductGenericData} from "../../shared/product-generic-data";
import {DataStorageService} from "../../shared/data-storage.service";
import {Department} from "../../models/department.model";
import {ProductOrder} from "../../models/order.model";
import {Observable, Subscription} from "rxjs";
import {Product} from "../../models";

@Component({
  selector: 'app-list-dpto',
  templateUrl: './list-dpto.component.html',
  styleUrls: ['./list-dpto.component.css']
})
export class ListDptoComponent implements OnInit {
  dptos: Department[];
  space = "10px";

  constructor(private route: ActivatedRoute, private router: Router, public dialog: MatDialog,
              private dataStore: DataStorageService) {
    this.dataStore.getDepartments().subscribe(dptos => this.dataStore.deparments = this.dptos = dptos );
  }

  ngOnInit() {
  }

  doAction(dpto: Department) {
    console.log("doAction", dpto);
    if (dpto.generic) {
      // this.openDialogGenericProd(dpto);
      this.getGenericProdByDpto(dpto);
    } else {
      this.router.navigateByUrl('/home/products/' + dpto.id + '/' + dpto.tax);
    }
  }

  getGenericProdByDpto(dpto: Department) {
    this.dataStore.getProductsByDepartment(dpto.id).subscribe(prods => {
      prods.filter(p => p.name === dpto.name).map(pg => this.openDialogGenericProd(pg, dpto.tax))
    });
  }

  openDialogGenericProd(prod: Product, tax) {
    // this.loginData = new LoginData("Manager");
    // this.getGenericProdByDpto(dpto)
    console.log(prod, tax);
    if(!prod.applyTax) tax = 0;
    else if (prod.applyTax && !prod.followDeparment) tax = prod.tax;
    const dialogRef = this.dialog.open(ProductGenericComponent,
      {
        width: '480px', height: '650px', data:  new ProductOrder(1, prod.unitCost, prod.unitCost, tax, prod)
      });

1    /*dialogRef.afterClosed().subscribe(loginValid => {
      console.log('The dialog was closed', loginValid);
      this.finService.setUsername(loginValid);
    });*/
  }

}
