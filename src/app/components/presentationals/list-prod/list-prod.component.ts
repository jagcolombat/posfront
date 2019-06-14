import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { StockService } from "../../../services/bussiness-logic/stock.service";
import { ActivatedRoute } from "@angular/router";
import {EOperationType} from "../../../utils/operation.type.enum";
import {leaveFocusOnButton} from "../../../utils/functions/functions";
import {FilterComponent} from "../filter/filter.component";
import {DialogFilterComponent} from "../../containers/dialog-filter/dialog-filter.component";

@Component({
  selector: 'app-list-prod',
  templateUrl: './list-prod.component.html',
  styleUrls: ['./list-prod.component.scss']
})
export class ListProdComponent implements OnInit {
  prods: Product[] = [];
  prodsByDpto: Product[] = [];
  dptTax: number;
  page: number = 1;
  sizePage = 20;

  constructor( private route: ActivatedRoute, public stockService: StockService) { }

  ngOnInit() {
    this.route.params.subscribe(p => this.dptTax = p['tax']);
    this.route.params.subscribe(p => this.stockService.getProductsByDepartment(p['dpto']).
      subscribe(prods => {
      Object.assign(this.prods, prods);
      Object.assign(this.prodsByDpto, prods);
    }));
  }

  doAction(ev, prod: Product) {
    console.log('doAction', ev, prod);
    leaveFocusOnButton(ev);
    this.stockService.productOrderService.addProduct(prod);
  }

  setPage(ev){
    if(ev > this.page){
      this.stockService.setOperation(EOperationType.PageNext, ev, 'products');
    } else {
      this.stockService.setOperation(EOperationType.PagePrevious, ev, 'products');
    }
    this.page = ev;
  }

  filter() {
    this.stockService.cashService.dialog.open(DialogFilterComponent, { width: '1024px', height: '600px', disableClose: true})
      .afterClosed()
      .subscribe(next => {
        console.log('filterDialog', next);
        this.prods = this.prodsByDpto.filter(p => p.name.includes(next.text));
      });
  }
}
