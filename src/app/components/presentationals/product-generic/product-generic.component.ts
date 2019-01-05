import {Component, Inject, Input, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ProductGeneric} from "../../../models/product-generic";

@Component({
  selector: 'app-product-generic',
  templateUrl: './product-generic.component.html',
  styleUrls: ['./product-generic.component.scss']
})
export class ProductGenericComponent implements OnInit {
  @Input() title = 'Generic Product ';
  inputDigits: boolean;
  digits = '';
  cost = '';
  maxlength = 12;

  constructor(public dialogRef: MatDialogRef<ProductGenericComponent>, @Inject(MAT_DIALOG_DATA) public data: ProductGeneric) { }

  ngOnInit() {
    this.cost = this.data.unitCost.toString();
    if (this.data.name) {
      this.title = this.data.name;
    }
  }

  getKeys(ev) {
    if (ev.type === 1 && this.digits.length < this.maxlength) {
      this.inputNumber(ev.value);
    } else if (ev.value === 'Clear') {
      this.resetPrice();
    } else if (ev.value === 'Enter') {
      this.addGenericProd();
    } else if (ev.value === 'Back') {
      this.back();
    }
  }

  inputNumber(value) {
    if (!this.inputDigits) {
      this.inputDigits = true;
    }
    this.digits += value + '';
    const cost = parseFloat(this.digits) * 0.01;
    if (cost !== 0) {
      this.cost = cost.toPrecision(this.digits.length);
      this.data.unitCost = cost;
    } else {
      this.resetPrice();
    }
  }

  addGenericProd() {
    // console.log("addGenericProd", this.data);
    this.dialogRef.close(this.data);
  }

  back() {
    if (this.digits.length > 1 ) {
      this.digits = this.digits.slice(0, this.digits.length - 1);
      const cost = parseFloat(this.digits) * 0.01;
      this.cost = cost.toPrecision(this.digits.length);
      this.data.unitCost = cost;
    } else {
      this.resetPrice();
    }
  }

  resetPrice() {
    this.data.unitCost = 0;
    this.digits = '';
    this.cost = '0.00';
  }

}
