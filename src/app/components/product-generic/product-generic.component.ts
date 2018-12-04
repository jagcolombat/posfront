import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ProductGenericData} from "../../shared/product-generic-data";
import {ProductsService} from "../../services/products.service";
import {Product} from "../../models/product.model";
import {ProductOrder} from "../../models/order.model";

@Component({
  selector: 'app-product-generic',
  templateUrl: './product-generic.component.html',
  styleUrls: ['./product-generic.component.css']
})
export class ProductGenericComponent implements OnInit {
  inputDigits: boolean;
  digits = "";

  constructor(public dialogRef: MatDialogRef<ProductGenericComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ProductOrder, private prodService: ProductsService) {
  }

  ngOnInit() {
  }

  addGenericProd(){
    console.log("addGenericProd", this.data);
    if(this.prodService.qty) this.data.quantity = this.prodService.qty;
    this.prodService.evAddProd.emit(<ProductOrder>this.data);
    this.prodService.qty = 1;
    this.dialogRef.close(this.data);
  }

  getKeys(ev) {
    console.log(ev);
    if(ev.type === 1) {
      //let cost = this.data.unitCost + "";
      if(!this.inputDigits) {
         // cost = "0.00";
        this.inputDigits = true;
      }
      this.digits += ev.value + "";
      // console.log(typeof cost, cost, ev.value);
      let cost = parseInt(this.digits) * 0.01;
      // console.log(typeof cost, cost, ev.value);
      this.data.unitCost = cost;
      console.log(this.data.unitCost, cost, this.digits, ev.value);
      //this.tryValidation = false;
    }
    else if(ev.value === 'Clear') {
      this.data.unitCost = 0;
      this.digits = "";
    }
    else if(ev.value === 'Enter') {
      console.log(this.data.unitCost);
      this.addGenericProd();
    }
  }

}
