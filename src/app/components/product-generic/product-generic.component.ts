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

  constructor(public dialogRef: MatDialogRef<ProductGenericComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ProductOrder, private prodService: ProductsService) {
  }

  ngOnInit() {
  }

  addGenericProd(){
    console.log("addGenericProd", this.data);
    this.prodService.evAddProd.emit(<ProductOrder>this.data);
    this.dialogRef.close(this.data);
  }

}
