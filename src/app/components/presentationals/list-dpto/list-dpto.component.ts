import { Component, OnInit } from '@angular/core';
import {Department} from '../../../models/department.model';
import {StockService} from "../../../services/bussiness-logic/stock.service";
import {MatDialog} from "@angular/material";
import {Router} from "@angular/router";

@Component({
  selector: 'list-dpto',
  templateUrl: './list-dpto.component.html',
  styleUrls: ['./list-dpto.component.css']
})
export class ListDptoComponent implements OnInit {
  dptos: Department[];
  space = '10px';

  constructor(private router: Router, public dialog: MatDialog, private stockService: StockService) {
    this.stockService.getDepartments().subscribe(dptos => {
      this.stockService.productOrderService.departments = this.dptos = dptos;
    });
  }

  ngOnInit() {
  }

  doAction(dpto: Department) {
    console.log('doAction', dpto);
    if (dpto.generic) {
      this.getGenericProdByDpto(dpto);
    } else {
      this.router.navigateByUrl('/cash/products/' + dpto.id + '/' + dpto.tax);
    }
  }

  getGenericProdByDpto(dpto: Department) {
    this.stockService.getProductsByDepartment(dpto.id).subscribe(prods => {
      prods.filter(p => p.name === dpto.name)
      .map(pg =>  this.stockService.productOrderService.addProduct(pg));
    });
  }

}
