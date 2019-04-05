import {Component, Input, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-apply-discount',
  templateUrl: './apply-discount.component.html',
  styleUrls: ['./apply-discount.component.scss']
})
export class ApplyDiscountComponent implements OnInit {
  @Input() title = 'Apply discount';
  inputDigits: boolean;
  digits = '';
  cost = '';
  maxlength = 3;
  constructor(public dialogRef: MatDialogRef<ApplyDiscountComponent>) { }

  ngOnInit() {
  }

  getKeys(ev) {
    if (ev.type === 1 && this.digits.length < this.maxlength) {
      this.inputNumber(ev.value);
    } else if (ev.value === 'Clear') {
      this.resetPrice();
    } else if (ev.value === 'Enter') {
      this.paidOut();
    } else if (ev.value === 'Back') {
      this.back();
    }
  }

  inputNumber(value) {
    if (!this.inputDigits) {
      this.inputDigits = true;
    }
    this.digits += value + '';
    /*const cost = parseFloat(this.digits) * 0.01;
    if (cost !== 0) {
      this.cost = cost.toPrecision(this.digits.length);
    } else {
      this.resetPrice();
    }*/
    this.cost = this.digits;
  }

  paidOut() {
    // console.log("addGenericProd", this.data);
    console.log("apply discount", this.cost);
    this.dialogRef.close();
  }

  back() {
    if (this.digits.length > 1 ) {
      this.digits = this.digits.slice(0, this.digits.length - 1);
      // const cost = parseFloat(this.digits) * 0.01;
      this.cost = this.digits;
    } else {
      this.resetPrice();
    }
  }

  resetPrice() {
    this.digits = '';
    this.cost = '1';
  }

}
