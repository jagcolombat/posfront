import { Component, OnInit } from '@angular/core';
import {Department} from '../../../models/department.model';
import {StockService} from "../../../services/bussiness-logic/stock.service";
import {Router} from "@angular/router";

@Component({
  selector: 'list-dpto',
  templateUrl: './list-dpto.component.html',
  styleUrls: ['./list-dpto.component.scss']
})
export class ListDptoComponent implements OnInit {
  dptos: Department[] = [];
  page = 1;
  sizePage = 12;

  constructor(private router: Router, private stockService: StockService) {
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
