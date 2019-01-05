import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { StockService } from "../../../services/bussiness-logic/stock.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-list-prod',
  templateUrl: './list-prod.component.html',
  styleUrls: ['./list-prod.component.scss']
})
export class ListProdComponent implements OnInit {
  // @Output() selectProduct = new EventEmitter<any>();
  prods: Product[] = [];
  dptTax: number;
  page = 1;

  constructor( private route: ActivatedRoute, private stockService: StockService) { }

  ngOnInit() {
    // console.log(this.route.params);
    this.route.params.subscribe(p => this.dptTax = p['tax']);
    this.route.params.subscribe(p => this.stockService.getProductsByDepartment(p['dpto']).
      subscribe(prods => this.prods = prods));
  }

  /*addProducts(selProd: ProductOrder): void {

    console.log('addProducts', selProd);
    this.prodService.selectProduct.emit(selProd);
  }*/

  doAction(prod: Product) {
    console.log('doAction', prod);
    this.stockService.productOrderService.addProduct(prod);
  }
}
