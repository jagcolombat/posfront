import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {PosProductsTableComponent} from "../pos-products-table/pos-products-table.component";
import {ValueCalculator} from "../../models/value-calculator.model";
import {TypeKey} from "../../utils/typekey.enum";
import {ERightOp} from "../../utils/right-op.enum";
import {ProductsService} from "../../services/products.service";
import {Order, ProductOrder} from "../../models/order.model";
import {FinancialOpService} from "../../services/financial-op.service";
import {Product} from "../../models/product.model";
import {DataStorageService} from "../../shared/data-storage.service";
import {p} from "@angular/core/src/render3";
import {Invoice} from "../../models/invoice.model";

@Component({
  selector: 'app-shopping-car',
  templateUrl: './shopping-car.component.html',
  styleUrls: ['./shopping-car.component.css']
})
export class ShoppingCarComponent implements OnInit {
  @ViewChild("productstable") productstable: PosProductsTableComponent;
  cashier = this.finService.username;
  account = 10780;
  products: ProductOrder;
  @Input() product:any;
  subtotal = 0;
  tax = 0;
  total = 0;
  showDigits: boolean;
  digits = "";
  qty:number;
  numbers = 0;

  constructor(public prodService: ProductsService, private finService: FinancialOpService, private dataStore: DataStorageService) { }

  ngOnInit() {
    this.prodService.selectProduct.subscribe(ev => this.resetDigits());
    this.prodService.evAddProd.subscribe(ev => this.resetDigits());
    this.prodService.evSetOrder.subscribe(ev => this.setOrder(ev));
    this.finService.evCreateOrder.subscribe(ev => this.createOrder(ev));
    this.finService.evSetUser.subscribe(ev => this.cashier = ev);
    this.prodService.evSyncProd.subscribe(() => this.setTotal());
  }

  setTotal() {
    this.subtotal = this.computeTotal().total;
    this.tax = this.computeTotal().taxes;
    this.finService.total = this.total = this.subtotal + this.tax;
  }

  computeTotal() {
    let total = 0;
    let subtotal = 0;
    let tax = 0;
    let taxes = 0;
    this.productstable.dataSource.data.map(p => {
      subtotal = p.unitCost * p.quantity;
      total += subtotal;
      if (p.tax > 0 ) {
        // console.log(subtotal, p.tax);
        tax = p.tax * subtotal / 100;
        taxes += tax;
      }
    });
    // console.log(total, taxes);
    return { total: total, taxes: taxes };
  }

  setKey(val: ValueCalculator) {
    if(val.type === TypeKey.NUMBER) {
      this.showDigits = true;
      console.log(this.prodService.digits, this.prodService.qty, val.value );
      this.prodService.digits += val.value.toString();
      this.numbers = parseInt(this.numbers + "" + val.value.toString());
    } else if(val.type === TypeKey.FOR) {
      // console.log(this.numbers);
      this.prodService.qty = this.numbers;
      this.prodService.digits += " @ ";
      this.numbers = 0;
    } else {
      this.showDigits = false;
      // console.log(ERightOp[val.value]);
      if (ERightOp[val.value] === ERightOp.PLU) {
        // Consume servicio de PLU con this.digits eso devuelve ProductOrder
        let qty = 1;
        let mockOrder;
        this.dataStore.getProductByUpc(this.numbers).subscribe(prod => {
          let tax = 0;
          if(prod.applyTax && prod.followDeparment) {
            tax = this.dataStore.deparments.filter(dpto => dpto.id == prod.departmentId).
            map(dpto => dpto.tax)[0];
          } else if (prod.applyTax && !prod.followDeparment) {
            tax =  prod.tax;
          }

          if(this.prodService.qty) qty = this.prodService.qty;
          mockOrder = new ProductOrder(qty, prod.unitCost, prod.unitCost * qty, tax, prod);
          // console.log(mockOrder);
          this.prodService.selectProduct.emit(mockOrder);
          this.prodService.qty = 1;
        }, error1 => {
          console.log(error1);
          this.prodService.qty = 1;
          this.resetDigits();
        });

      } else if (val.value === ERightOp.CLEAR) {
        this.prodService.qty = 1;
        this.resetDigits();
        this.productstable.deleteProduscts();
      }
    }
  }

  resetDigits() {
    this.showDigits = false;
    this.prodService.digits = "";
    this.numbers = 0;
  }

  resetTotals() {
    this.total = 0;
    this.subtotal = 0;
  }

  createOrder(orderId: number){
    this.productstable.products = new Array<ProductOrder>();
    this.account = orderId;
    this.resetDigits();
    this.resetTotals();
  }

  setOrder(o: Invoice) {
    this.productstable.products = o.productsOrders;
    this.account = parseInt(o.receiptNumber);
    this.resetDigits();
  }
}
