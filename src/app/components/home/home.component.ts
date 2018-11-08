import {Component, OnInit, ViewChild} from '@angular/core';
import {ShoppingCarComponent} from "../shopping-car/shopping-car.component";
import {ProductsService} from "../../services/products.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild("shoppingcar") shoppingcar: ShoppingCarComponent;
  product: any;

  constructor(private prodService: ProductsService) { }

  ngOnInit() {
    this.prodService.selectProduct.subscribe(ev => this.addProduct(ev));
  }

  addProduct(ev) {
    console.log(ev, this.shoppingcar.productstable);
    this.shoppingcar.productstable.addProduct(ev);
    this.shoppingcar.setTotal();
    // this.product = ev;
  }

  getKey(val: any) {
    this.shoppingcar.setKey(val);
  }

}
