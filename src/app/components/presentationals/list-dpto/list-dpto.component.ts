import {Component, OnInit} from '@angular/core';
import {Department} from '../../../models/department.model';
import {StockService} from "../../../services/bussiness-logic/stock.service";
import {Router} from "@angular/router";
import {EOperationType} from "../../../utils/operation.type.enum";
import {CashService} from "../../../services/bussiness-logic/cash.service";
import {leaveFocusOnButton} from "../../../utils/functions/functions";

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
    this.page = this.stockService.actualPage;
  }

  doAction(ev, dpto: Department) {
    console.log('doAction', dpto);
    leaveFocusOnButton(ev);
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
      this.stockService.setOperation(EOperationType.PageNext, ev, 'departments');
    } else {
      this.stockService.setOperation(EOperationType.PagePrevious, ev, 'departments');
    }
    this.page = this.stockService.actualPage = ev;
  }

}
