import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { StockService } from "../../../services/bussiness-logic/stock.service";
import { ActivatedRoute } from "@angular/router";
import {EOperationType} from "../../../utils/operation.type.enum";

@Component({
  selector: 'app-list-prod',
  templateUrl: './list-prod.component.html',
  styleUrls: ['./list-prod.component.scss']
})
export class ListProdComponent implements OnInit {
  prods: Product[] = [];
  dptTax: number;
  page: number = 1;
  sizePage = 8;

  constructor( private route: ActivatedRoute, private stockService: StockService) { }

  ngOnInit() {
    this.route.params.subscribe(p => this.dptTax = p['tax']);
    this.route.params.subscribe(p => this.stockService.getProductsByDepartment(p['dpto']).
      subscribe(prods => this.prods = prods));
  }

  doAction(prod: Product) {
    console.log('doAction', prod);
    this.stockService.productOrderService.addProduct(prod);
  }

  setPage(ev){
    if(ev > this.page){
      this.stockService.setOperation(EOperationType.PageNext, ev, 'departments');
    } else {
      this.stockService.setOperation(EOperationType.PagePrevious, ev, 'departments');
    }
    this.page = ev;
  }
}
