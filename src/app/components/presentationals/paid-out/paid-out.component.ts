import {Component, Inject, Input, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'app-paid-out',
  templateUrl: './paid-out.component.html',
  styleUrls: ['./paid-out.component.scss']
})
export class PaidOutComponent implements OnInit {
  @Input() title = 'Paid out';
  inputDigits: boolean;
  digits = '';
  cost = '';
  maxlength = 12;
  constructor(public dialogRef: MatDialogRef<PaidOutComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data.title) {
      this.title = this.data.title;
    }
  }

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
    const cost = parseFloat(this.digits) * 0.01;
    if (cost !== 0) {
      this.cost = cost.toPrecision(this.digits.length);
    } else {
      this.resetPrice();
    }
  }

  paidOut() {
    // console.log("addGenericProd", this.data);
    console.log("open cash", this.cost);
    console.log("print paid out", this.cost);
    this.dialogRef.close(this.cost);
  }

  back() {
    if (this.digits.length > 1 ) {
      this.digits = this.digits.slice(0, this.digits.length - 1);
      const cost = parseFloat(this.digits) * 0.01;
      this.cost = cost.toPrecision(this.digits.length);
    } else {
      this.resetPrice();
    }
  }

  resetPrice() {
    this.digits = '';
    this.cost = '0.00';
  }

}
