import {Component, OnInit} from '@angular/core';
import {Department} from '../../../models/department.model';
import {StockService} from "../../../services/bussiness-logic/stock.service";
import {Router} from "@angular/router";
import {EOperationType} from "../../../utils/operation.type.enum";
import {CashService} from "../../../services/bussiness-logic/cash.service";

@Component({
  selector: 'list-dpto',
  templateUrl: './list-dpto.component.html',
  styleUrls: ['./list-dpto.component.scss']
})
export class ListDptoComponent implements OnInit {
  dptos: Department[] = [];
  page = 1;
  sizePage = 16;

  constructor(private router: Router, public stockService: StockService) {
  }

  ngOnInit() {
    this.stockService.getDepartments().subscribe(dptos => {
      this.stockService.productOrderService.departments = this.dptos = dptos;
    });
  }

  doAction(ev, dpto: Department) {
    console.log('doAction', dpto);
    ev.target.blur();
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

  setPage(ev){
    if(ev > this.page){
      this.stockService.setOperation(EOperationType.PageNext, ev, 'products');
    } else {
      this.stockService.setOperation(EOperationType.PagePrevious, ev, 'products');
    }
    this.page = ev;
  }

}
