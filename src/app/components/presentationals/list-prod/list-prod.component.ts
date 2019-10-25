import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { StockService } from "../../../services/bussiness-logic/stock.service";
import {ActivatedRoute, Router} from "@angular/router";
import { EOperationType } from "../../../utils/operation.type.enum";
import { leaveFocusOnButton } from "../../../utils/functions/functions";
import { DialogFilterComponent } from "../../containers/dialog-filter/dialog-filter.component";

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

  constructor( private router: Router, private route: ActivatedRoute, public stockService: StockService) {
    this.sizePage = this.stockService.getStockCountItems();
    console.log(this.sizePage);
  }

  ngOnInit() {

    this.route.params.subscribe(p => {
      console.log('onInit', p);
      if(p['filter']){
        Object.assign(this.prods, this.stockService.productsFiltered);
        Object.assign(this.prodsByDpto, this.stockService.productsFiltered);
      } else if (p['dpto'] && p['tax']){
        this.dptTax = p['tax'];
        this.stockService.getProductsByDepartment(p['dpto']).subscribe(prods => {
          Object.assign(this.prods, prods);
          Object.assign(this.prodsByDpto, prods);
        })
      }
    });
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
        if (next && next.text) {
          console.log('filterDialog', next, this.prodsByDpto);
          /*let prods = this.prodsByDpto.filter(p => p.name.includes(next.text));
          prods.length <= 0 ?
            this.stockService.cashService.openGenericInfo('Information', 'Not match any products with ' +
              'the specified filter')
            :
            this.prods = prods;
            this.page = 1;*/
          this.stockService.getProductsByFilter(next.text).subscribe(prods => {
            this.prods.splice(0);
            this.prodsByDpto.splice(0);
            Object.assign(this.prods, prods);
            Object.assign(this.prodsByDpto, prods);
            this.page = 1;
          }, err => {
            this.stockService.cashService.openGenericInfo('Error', 'Not match any products with ' +
              'the specified filter');
          });
        }
      });
  }
}
